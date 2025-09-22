import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TreeVisualization from '../components/TreeVisualization';
import { saveTreeState, loadTreeState, clearTreeState, hasSavedState } from '../utils/persistence';

const TestPage: React.FC = () => {
  const [treeState, setTreeState] = useState({
    visibleLeaves: new Set<number>(),
    leafNames: new Map<number, string>(),
    nextLeafIndex: 0,
    totalLeaves: 170
  });
  
  const [recentAdditions, setRecentAdditions] = useState<Array<{name: string, leafIndex: number, timestamp: Date}>>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadTreeState();
    if (savedState) {
      setTreeState(savedState);
      console.log('Loaded saved tree state');
    }
    setHasLoaded(true);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (hasLoaded) {
      saveTreeState(treeState);
    }
  }, [treeState, hasLoaded]);

  const handleNameSubmit = (name: string) => {
    // Update our local state
    const leafIndex = treeState.nextLeafIndex;
    setTreeState(prev => ({
      visibleLeaves: new Set([...prev.visibleLeaves, leafIndex]),
      leafNames: new Map([...prev.leafNames, [leafIndex, name]]),
      nextLeafIndex: prev.nextLeafIndex + 1
    }));
    
    // Add to recent additions
    setRecentAdditions(prev => [
      { name, leafIndex, timestamp: new Date() },
      ...prev.slice(0, 9) // Keep only last 10
    ]);
  };

  const handleLeafAdded = (leafIndex: number, name: string) => {
    console.log(`Leaf ${leafIndex} added with name: ${name}`);
  };

  const handleLeafRemoved = (leafIndex: number) => {
    console.log(`Leaf ${leafIndex} removed`);
  };

  const clearAllLeaves = () => {
    setTreeState({
      visibleLeaves: new Set(),
      leafNames: new Map(),
      nextLeafIndex: 0,
      totalLeaves: 170
    });
    setRecentAdditions([]);
    clearTreeState();
  };

  const removeLastLeaf = () => {
    if (treeState.visibleLeaves.size === 0) return;
    
    const lastLeafIndex = Math.max(...Array.from(treeState.visibleLeaves));
    const leafName = treeState.leafNames.get(lastLeafIndex);
    
    setTreeState(prev => {
      const newVisibleLeaves = new Set(prev.visibleLeaves);
      const newLeafNames = new Map(prev.leafNames);
      
      newVisibleLeaves.delete(lastLeafIndex);
      newLeafNames.delete(lastLeafIndex);

      return {
        ...prev,
        visibleLeaves: newVisibleLeaves,
        leafNames: newLeafNames
      };
    });
    
    // Remove from recent additions
    setRecentAdditions(prev => prev.filter(addition => addition.leafIndex !== lastLeafIndex));
    
    console.log(`Removed leaf ${lastLeafIndex} with name: ${leafName}`);
  };

  const addRandomLeaves = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    names.forEach((name, index) => {
      setTimeout(() => {
        handleNameSubmit(name);
      }, index * 500); // Add with delay for visual effect
    });
  };

  return (
    <>
      <Head>
        <title>Tree of Unity - Test Page</title>
        <meta name="description" content="Test page for Tree of Unity visualization" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Tree of Unity - Test Page</h1>
            <p className="text-gray-600">Test the tree visualization and leaf addition functionality</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tree Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Tree Visualization</h2>
                <TreeVisualization
                  onLeafAdded={handleLeafAdded}
                  onLeafRemoved={handleLeafRemoved}
                  onNameSubmit={handleNameSubmit}
                />
              </div>
            </div>
            
            {/* Controls and Info */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={addRandomLeaves}
                    disabled={treeState.visibleLeaves.size >= 170}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add 10 Random Names
                  </button>
                  
                  <button
                    onClick={removeLastLeaf}
                    disabled={treeState.visibleLeaves.size === 0}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove Last Leaf
                  </button>
                  
                  <button
                    onClick={clearAllLeaves}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Clear All Leaves
                  </button>
                </div>
              </div>
              
              {/* Recent Additions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Additions</h3>
                {recentAdditions.length === 0 ? (
                  <p className="text-gray-500">No leaves added yet</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {recentAdditions.map((addition, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{addition.name}</span>
                        <span className="text-gray-500">Leaf #{addition.leafIndex}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tree Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Tree Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Visible Leaves:</span>
                    <span className="font-medium">{treeState.visibleLeaves.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Leaves:</span>
                    <span className="font-medium">{treeState.totalLeaves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Leaf Index:</span>
                    <span className="font-medium">{treeState.nextLeafIndex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-medium">{Math.max(0, (treeState.totalLeaves || 170) - treeState.visibleLeaves.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-save:</span>
                    <span className="font-medium text-green-600">✓ Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;
