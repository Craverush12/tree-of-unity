import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const leavesDB = {
  // Get all leaves
  async getAllLeaves() {
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching leaves:', error)
      return []
    }
    return data || []
  },

  // Add a new leaf
  async addLeaf(leafData) {
    const { data, error } = await supabase
      .from('leaves')
      .insert([leafData])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding leaf:', error)
      throw error
    }
    return data
  },

  // Check if coordinates are available
  async checkCoordinates(x, y) {
    const { data, error } = await supabase
      .from('leaves')
      .select('id')
      .eq('x', x)
      .eq('y', y)
      .single()
    
    if (error && error.code === 'PGRST116') {
      // No row found - coordinates are available
      return true
    }
    
    if (error) {
      console.error('Error checking coordinates:', error)
      return false
    }
    
    // Row found - coordinates are taken
    return false
  },

  // Subscribe to real-time changes
  subscribeToLeaves(callback) {
    return supabase
      .channel('leaves-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'leaves' 
        }, 
        callback
      )
      .subscribe()
  }
}
