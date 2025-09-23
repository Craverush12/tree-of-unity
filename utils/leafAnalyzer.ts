// /**
//  * Utility functions for analyzing leaf path data and identifying small leaves
//  */

// import { LeafData } from '../types/tree';

// /**
//  * Analyzes a collection of leaf paths to identify size patterns
//  * @param leaves - Array of leaf data
//  * @returns Analysis results including size statistics
//  */
// export function analyzeLeafSizes(leaves: LeafData[]) {
//   if (leaves.length === 0) {
//     return {
//       totalLeaves: 0,
//       smallLeaves: 0,
//       largeLeaves: 0,
//       averageWidth: 0,
//       averageHeight: 0,
//       averageArea: 0,
//       sizeDistribution: []
//     };
//   }

//   const smallLeaves = leaves.filter(leaf => leaf.isSmall);
//   const largeLeaves = leaves.filter(leaf => !leaf.isSmall);
  
//   const totalWidth = leaves.reduce((sum, leaf) => sum + leaf.width, 0);
//   const totalHeight = leaves.reduce((sum, leaf) => sum + leaf.height, 0);
//   const totalArea = leaves.reduce((sum, leaf) => sum + leaf.area, 0);
  
//   // Create size distribution buckets
//   const sizeBuckets = [
//     { name: 'Tiny', min: 0, max: 500, count: 0 },
//     { name: 'Small', min: 500, max: 2000, count: 0 },
//     { name: 'Medium', min: 2000, max: 5000, count: 0 },
//     { name: 'Large', min: 5000, max: 10000, count: 0 },
//     { name: 'Very Large', min: 10000, max: Infinity, count: 0 }
//   ];
  
//   leaves.forEach(leaf => {
//     const bucket = sizeBuckets.find(b => leaf.area >= b.min && leaf.area < b.max);
//     if (bucket) bucket.count++;
//   });

//   return {
//     totalLeaves: leaves.length,
//     smallLeaves: smallLeaves.length,
//     largeLeaves: largeLeaves.length,
//     averageWidth: totalWidth / leaves.length,
//     averageHeight: totalHeight / leaves.length,
//     averageArea: totalArea / leaves.length,
//     sizeDistribution: sizeBuckets,
//     smallLeafPercentage: (smallLeaves.length / leaves.length) * 100
//   };
// }

// /**
//  * Creates a detailed report of leaf analysis
//  * @param leaves - Array of leaf data
//  * @returns Formatted analysis report
//  */
// export function generateLeafAnalysisReport(leaves: LeafData[]): string {
//   const analysis = analyzeLeafSizes(leaves);
  
//   let report = `Leaf Analysis Report\n`;
//   report += `===================\n\n`;
//   report += `Total Leaves: ${analysis.totalLeaves}\n`;
//   report += `Small Leaves: ${analysis.smallLeaves} (${analysis.smallLeafPercentage.toFixed(1)}%)\n`;
//   report += `Large Leaves: ${analysis.largeLeaves}\n\n`;
  
//   report += `Size Statistics:\n`;
//   report += `- Average Width: ${analysis.averageWidth.toFixed(2)}px\n`;
//   report += `- Average Height: ${analysis.averageHeight.toFixed(2)}px\n`;
//   report += `- Average Area: ${analysis.averageArea.toFixed(2)}px²\n\n`;
  
//   report += `Size Distribution:\n`;
//   analysis.sizeDistribution.forEach(bucket => {
//     const percentage = (bucket.count / analysis.totalLeaves) * 100;
//     report += `- ${bucket.name}: ${bucket.count} leaves (${percentage.toFixed(1)}%)\n`;
//   });
  
//   return report;
// }

// /**
//  * Tests the small leaf detection with sample data
//  * @param samplePaths - Array of sample path strings
//  * @returns Test results
//  */
// export function testSmallLeafDetection(samplePaths: string[]): {
//   detected: LeafData[];
//   smallLeaves: LeafData[];
//   report: string;
// } {
//   // This would be used to test with the actual path data you provided
//   // For now, we'll return a placeholder structure
//   return {
//     detected: [],
//     smallLeaves: [],
//     report: "Test function ready for implementation with actual path data"
//   };
// }
