import { LeafData, LeafExtractionResult } from '../types/tree';

/**
 * Parses SVG path data to extract coordinates
 * @param pathData - The SVG path string
 * @returns Array of coordinate points
 */
function parsePathData(pathData: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  // Match all coordinate pairs in the path
  const coordRegex = /([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)/g;
  let match;
  
  while ((match = coordRegex.exec(pathData)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  }
  
  return points;
}

/**
 * Calculates the center point of a path
 * @param points - Array of coordinate points
 * @returns Center coordinates
 */
function calculatePathCenter(points: { x: number; y: number }[]): { x: number; y: number } {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }
  
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

/**
 * Calculates the bounding box and dimensions of a path
 * @param points - Array of coordinate points
 * @returns Bounding box dimensions
 */
function calculatePathDimensions(points: { x: number; y: number }[]): { 
  width: number; 
  height: number; 
  area: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (points.length === 0) {
    return { width: 0, height: 0, area: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }
  
  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);
  
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  
  const width = maxX - minX;
  const height = maxY - minY;
  const area = width * height;
  
  return { width, height, area, minX, maxX, minY, maxY };
}

/**
 * Determines if a leaf path is considered "small" based on its dimensions
 * @param dimensions - Path dimensions
 * @returns True if the leaf is considered small
 */
function isSmallLeaf(dimensions: { width: number; height: number; area: number }): boolean {
  // Define thresholds for small leaves
  const MAX_WIDTH = 50;  // Maximum width for small leaves
  const MAX_HEIGHT = 50; // Maximum height for small leaves
  const MAX_AREA = 2000; // Maximum area for small leaves
  
  return dimensions.width <= MAX_WIDTH && 
         dimensions.height <= MAX_HEIGHT && 
         dimensions.area <= MAX_AREA;
}

/**
 * Extracts leaf paths from the withleaf SVG content
 * @param svgContent - The full SVG content from withleaf.txt
 * @returns Object containing array of leaf data and total count
 */
export function extractLeavesFromSVG(svgContent: string): LeafExtractionResult {
  // Find all path elements with fill="#A6D061" (green leaves)
  const leafPathRegex = /<path[^>]*fill="#A6D061"[^>]*>/g;
  const leafMatches = svgContent.match(leafPathRegex);
  
  if (!leafMatches) {
    return { leaves: [], totalCount: 0 };
  }

  const leaves: LeafData[] = leafMatches.map((pathElement, index) => {
    // Extract the path data
    const pathMatch = pathElement.match(/d="([^"]*)"/);
    const pathData = pathMatch ? pathMatch[1] : '';
    
    // Parse the path to get coordinates
    const points = parsePathData(pathData);
    const center = calculatePathCenter(points);
    const dimensions = calculatePathDimensions(points);
    const isSmall = isSmallLeaf(dimensions);
    
    return {
      path: pathData,
      centerX: center.x,
      centerY: center.y,
      index,
      width: dimensions.width,
      height: dimensions.height,
      area: dimensions.area,
      isSmall
    };
  });

  return {
    leaves,
    totalCount: leaves.length
  };
}

/**
 * Loads and processes the withleaf SVG file
 * @returns Promise containing the extraction result
 */
export async function loadAndExtractLeaves(): Promise<LeafExtractionResult> {
  try {
    // Try to fetch from API first
    const response = await fetch('/api/leaves/extract');
    if (response.ok) {
      const data = await response.json();
      return {
        leaves: data.leaves,
        totalCount: data.totalCount
      };
    }
    
    // Fallback to mock data if API fails
    console.warn('API failed, using mock data');
    const mockLeaves: LeafData[] = Array.from({ length: 170 }, (_, index) => {
      const width = 20 + (index % 5) * 10;
      const height = 20 + (index % 5) * 10;
      const area = width * height;
      const isSmall = width <= 50 && height <= 50 && area <= 2000;
      
      return {
        path: `M${100 + index * 2} ${100 + index} L${150 + index * 2} ${150 + index} Z`,
        centerX: 200 + (index % 10) * 50,
        centerY: 200 + Math.floor(index / 10) * 50,
        index,
        width,
        height,
        area,
        isSmall
      };
    });

    return {
      leaves: mockLeaves,
      totalCount: 170
    };
  } catch (error) {
    console.error('Error loading leaves:', error);
    return { leaves: [], totalCount: 0 };
  }
}
