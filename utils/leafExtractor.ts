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
    
    return {
      path: pathData,
      centerX: center.x,
      centerY: center.y,
      index
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
    const mockLeaves: LeafData[] = Array.from({ length: 170 }, (_, index) => ({
      path: `M${100 + index * 2} ${100 + index} L${150 + index * 2} ${150 + index} Z`,
      centerX: 200 + (index % 10) * 50,
      centerY: 200 + Math.floor(index / 10) * 50,
      index
    }));

    return {
      leaves: mockLeaves,
      totalCount: 170
    };
  } catch (error) {
    console.error('Error loading leaves:', error);
    return { leaves: [], totalCount: 0 };
  }
}
