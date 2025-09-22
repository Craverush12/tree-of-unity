import { useEffect, useState } from 'react'
import Head from 'next/head'
import TreeVisualization from '../components/TreeVisualization'
import { leavesDB } from '../lib/firebase'

export default function Tree() {
  const [treeState, setTreeState] = useState({
    visibleLeaves: new Set<number>(),
    leafNames: new Map<number, string>(),
    nextLeafIndex: 0,
    totalLeaves: 170
  });
  
  const [recentAdditions, setRecentAdditions] = useState<Array<{name: string, leafIndex: number, timestamp: Date}>>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isAddingLeaf, setIsAddingLeaf] = useState(false);

  // Load existing leaves from database
  const loadExistingLeaves = async () => {
    try {
      const leaves = await leavesDB.getAllLeaves();
      console.log(`Loaded ${leaves.length} existing leaves from database`);
      
      // Convert database leaves to our state format
      const visibleLeaves = new Set<number>();
      const leafNames = new Map<number, string>();
      
      leaves.forEach((leaf, index) => {
        // Handle both old and new database structures
        let leafIndex;
        if (leaf.leafIndex !== undefined) {
          // New structure with leafIndex
          leafIndex = leaf.leafIndex;
        } else {
          // Old structure - use array index as leafIndex
          leafIndex = index;
          console.log('Old database structure detected, using array index as leafIndex:', leafIndex);
        }
        
        console.log('Loading leaf from database:', leafIndex, leaf.name);
        
        // Validate leafIndex is within bounds
        if (leafIndex >= 0 && leafIndex < 170) {
          visibleLeaves.add(leafIndex);
          leafNames.set(leafIndex, leaf.name);
        } else {
          console.warn('Invalid leafIndex:', leafIndex, 'for leaf:', leaf.name);
        }
      });
      
      setTreeState(prev => ({
        ...prev,
        visibleLeaves,
        leafNames,
        nextLeafIndex: Math.max(...leaves.map((l, index) => l.leafIndex !== undefined ? l.leafIndex : index), 0) + 1
      }));
      
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading existing leaves:', error);
      setHasLoaded(true);
    }
  };

  // Load leaves on mount
  useEffect(() => {
    loadExistingLeaves();
  }, []);

  // Set up real-time subscription for new leaves
  useEffect(() => {
    const subscription = leavesDB.subscribeToLeaves((payload: any) => {
      console.log('New leaf added via subscription:', payload.new);
      
      // Skip if we're currently adding a leaf ourselves
      if (isAddingLeaf) {
        console.log('Skipping subscription update - we are adding leaf ourselves');
        return;
      }
      
      const newLeaf = payload.new;
      if (!newLeaf) {
        console.log('Invalid leaf data, skipping');
        return;
      }
      
      // Handle both old and new database structures
      let leafIndex;
      if (newLeaf.leafIndex !== undefined) {
        // New structure with leafIndex
        leafIndex = newLeaf.leafIndex;
      } else {
        // Old structure - use next available index
        leafIndex = treeState.nextLeafIndex;
        console.log('Old database structure detected in subscription, using nextLeafIndex:', leafIndex);
      }
      
      console.log('Subscription received leaf:', leafIndex, newLeaf.name);
      
      // Validate leafIndex is within bounds
      if (leafIndex < 0 || leafIndex >= 170) {
        console.warn('Invalid leafIndex from subscription:', leafIndex, 'for leaf:', newLeaf.name);
        return;
      }
      
      setTreeState(prev => {
        // Check if this leaf already exists
        if (prev.visibleLeaves.has(leafIndex)) {
          console.log('Leaf already exists, skipping:', leafIndex);
          return prev;
        }
        
        const newVisibleLeaves = new Set(prev.visibleLeaves);
        const newLeafNames = new Map(prev.leafNames);
        
        newVisibleLeaves.add(leafIndex);
        newLeafNames.set(leafIndex, newLeaf.name);
        
        console.log('Adding new leaf from subscription:', leafIndex, newLeaf.name);
        
        return {
          visibleLeaves: newVisibleLeaves,
          leafNames: newLeafNames,
          nextLeafIndex: Math.max(prev.nextLeafIndex, leafIndex + 1),
          totalLeaves: prev.totalLeaves
        };
      });
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [isAddingLeaf]);

  const handleNameSubmit = async (name: string, city?: string) => {
    try {
      // Set flag to prevent subscription from triggering
      setIsAddingLeaf(true);
      
      // Get the next leaf position from the SVG
      const leafIndex = treeState.nextLeafIndex;
      console.log('Saving leaf with leafIndex:', leafIndex, 'for name:', name);
      
      // Validate leafIndex is within bounds
      if (leafIndex < 0 || leafIndex >= 170) {
        console.error('Invalid leafIndex:', leafIndex, 'cannot save leaf');
        return;
      }
      
      // Create leaf data object for database with new structure
      const leafData = {
        name: name,
        city: city || "Unknown",
        leafIndex: leafIndex,
        created_at: new Date().toISOString()
      };
      
      const savedLeaf = await leavesDB.addLeaf(leafData);
      console.log('Leaf saved to database:', savedLeaf);
      
      // Update local state
      setTreeState(prev => {
        const newVisibleLeaves = new Set(prev.visibleLeaves);
        const newLeafNames = new Map(prev.leafNames);
        
        newVisibleLeaves.add(leafIndex);
        newLeafNames.set(leafIndex, name);
        
        console.log('Adding leaf:', leafIndex, 'with name:', name);
        console.log('Current leafNames map:', Array.from(newLeafNames.entries()));
        
        return {
          visibleLeaves: newVisibleLeaves,
          leafNames: newLeafNames,
          nextLeafIndex: prev.nextLeafIndex + 1,
          totalLeaves: prev.totalLeaves
        };
      });
      
      // Add to recent additions
      setRecentAdditions(prev => [
        { name, leafIndex, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only last 10
      ]);
      
      // Reset flag after a short delay
    setTimeout(() => {
        setIsAddingLeaf(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving leaf to database:', error);
      setIsAddingLeaf(false);
    }
  };

  const handleLeafAdded = (leafIndex: number, name: string) => {
    console.log(`Leaf ${leafIndex} added with name: ${name}`);
  };

  const handleLeafRemoved = (leafIndex: number) => {
    console.log(`Leaf ${leafIndex} removed`);
  };

  return (
    <>
      <Head>
        <title>Tree of Unity</title>
      </Head>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        fontFamily: 'sans-serif', 
        margin: '0',
        padding: '20px',
        justifyContent: 'center',
        backgroundImage: 'url(/Tree.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}>
        <TreeVisualization
          treeState={treeState}
          onLeafAdded={handleLeafAdded}
          onLeafRemoved={handleLeafRemoved}
          onNameSubmit={handleNameSubmit}
        />
      </div>
    </>
  )
}