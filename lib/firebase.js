import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, set, onValue, off, get, child } from 'firebase/database'

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Database helper functions
export const leavesDB = {
  // Get all leaves
  async getAllLeaves() {
    try {
      const snapshot = await get(ref(database, 'leaves'))
      if (snapshot.exists()) {
      const leaves = []
      snapshot.forEach((childSnapshot) => {
        leaves.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
      return leaves.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      }
      return []
    } catch (error) {
      console.error('Error fetching leaves:', error)
      return []
    }
  },

  // Add a new leaf
  async addLeaf(leafData) {
    try {
      const newLeafRef = push(ref(database, 'leaves'))
      const leafWithTimestamp = {
        ...leafData,
        created_at: new Date().toISOString()
      }
      await set(newLeafRef, leafWithTimestamp)
      return { id: newLeafRef.key, ...leafWithTimestamp }
    } catch (error) {
      console.error('Error adding leaf:', error)
      throw error
    }
  },

  // Check if coordinates are available
  async checkCoordinates(x, y) {
    try {
      const snapshot = await get(ref(database, 'leaves'))
      if (snapshot.exists()) {
        let isAvailable = true
        snapshot.forEach((childSnapshot) => {
          const leaf = childSnapshot.val()
          if (leaf.x === x && leaf.y === y) {
            isAvailable = false
          }
        })
        return isAvailable
      }
      return true
    } catch (error) {
      console.error('Error checking coordinates:', error)
      return false
    }
  },

  // Subscribe to real-time changes
  subscribeToLeaves(callback) {
    const leavesRef = ref(database, 'leaves')
    
    const handleChange = (snapshot) => {
      if (snapshot.exists()) {
        const leaves = []
        snapshot.forEach((childSnapshot) => {
          leaves.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        
        // Find the newest leaf (most recent)
        const sortedLeaves = leaves.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        if (sortedLeaves.length > 0) {
          callback({ new: sortedLeaves[0] })
        }
      }
    }

    onValue(leavesRef, handleChange)
    
    // Return unsubscribe function
    return {
      unsubscribe: () => off(leavesRef, 'value', handleChange)
    }
  }
}
