// Server-Sent Events alternative for real-time updates
// This is a simpler solution that works with any backend

export class SSEClient {
  constructor() {
    this.eventSource = null
    this.listeners = new Map()
  }

  // Connect to SSE endpoint
  connect(endpoint) {
    if (this.eventSource) {
      this.eventSource.close()
    }

    this.eventSource = new EventSource(endpoint)
    
    this.eventSource.onopen = () => {
      console.log('SSE connection opened')
    }

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        this.connect(endpoint)
      }, 3000)
    }

    return this.eventSource
  }

  // Listen for specific events
  on(eventType, callback) {
    if (!this.eventSource) {
      console.error('SSE not connected')
      return
    }

    this.eventSource.addEventListener(eventType, callback)
    this.listeners.set(eventType, callback)
  }

  // Disconnect
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    this.listeners.clear()
  }
}

// Database helper functions for SSE implementation
export const leavesDB = {
  // Get all leaves (you'll need to implement this with your preferred database)
  async getAllLeaves() {
    try {
      const response = await fetch('/api/leaves')
      if (!response.ok) throw new Error('Failed to fetch leaves')
      return await response.json()
    } catch (error) {
      console.error('Error fetching leaves:', error)
      return []
    }
  },

  // Add a new leaf
  async addLeaf(leafData) {
    try {
      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leafData),
      })
      
      if (!response.ok) throw new Error('Failed to add leaf')
      return await response.json()
    } catch (error) {
      console.error('Error adding leaf:', error)
      throw error
    }
  },

  // Check if coordinates are available
  async checkCoordinates(x, y) {
    try {
      const response = await fetch(`/api/leaves/check?x=${x}&y=${y}`)
      if (!response.ok) throw new Error('Failed to check coordinates')
      const result = await response.json()
      return result.available
    } catch (error) {
      console.error('Error checking coordinates:', error)
      return false
    }
  },

  // Subscribe to real-time changes using SSE
  subscribeToLeaves(callback) {
    const sseClient = new SSEClient()
    sseClient.connect('/api/leaves/events')
    sseClient.on('new-leaf', (event) => {
      const leafData = JSON.parse(event.data)
      callback({ new: leafData })
    })
    
    return {
      unsubscribe: () => sseClient.disconnect()
    }
  }
}
