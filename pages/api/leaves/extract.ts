import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { extractLeavesFromSVG } from '../../../utils/leafExtractor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the withleaf.txt file
    const filePath = path.join(process.cwd(), 'public', 'withleaf.txt');
    const svgContent = fs.readFileSync(filePath, 'utf8');
    
    // Use the improved extraction function
    const result = extractLeavesFromSVG(svgContent);
    
    if (result.leaves.length === 0) {
      return res.status(404).json({ error: 'No leaves found in SVG' });
    }

    res.status(200).json({
      leaves: result.leaves,
      totalCount: result.totalCount
    });
  } catch (error) {
    console.error('Error extracting leaves:', error);
    res.status(500).json({ error: 'Failed to extract leaves' });
  }
}
