import { TreeState } from '../types/tree';

const STORAGE_KEY = 'tree-of-unity-state';

/**
 * Saves tree state to localStorage
 * @param state - The tree state to save
 */
export function saveTreeState(state: TreeState): void {
  try {
    const serializedState = {
      visibleLeaves: Array.from(state.visibleLeaves),
      leafNames: Array.from(state.leafNames.entries()),
      nextLeafIndex: state.nextLeafIndex,
      totalLeaves: state.totalLeaves
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
  } catch (error) {
    console.error('Error saving tree state:', error);
  }
}

/**
 * Loads tree state from localStorage
 * @returns The saved tree state or null if not found
 */
export function loadTreeState(): TreeState | null {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    
    return {
      visibleLeaves: new Set(parsedState.visibleLeaves),
      leafNames: new Map(parsedState.leafNames),
      nextLeafIndex: parsedState.nextLeafIndex,
      totalLeaves: parsedState.totalLeaves
    };
  } catch (error) {
    console.error('Error loading tree state:', error);
    return null;
  }
}

/**
 * Clears saved tree state from localStorage
 */
export function clearTreeState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tree state:', error);
  }
}

/**
 * Checks if there's saved state in localStorage
 * @returns True if saved state exists
 */
export function hasSavedState(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Error checking saved state:', error);
    return false;
  }
}
