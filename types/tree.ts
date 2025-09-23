export interface TreeState {
  visibleLeaves: Set<number>;
  leafNames: Map<number, string>;
  nextLeafIndex: number;
  totalLeaves: number;
}

export interface LeafData {
  path: string;
  centerX: number;
  centerY: number;
  index: number;
  width: number;
  height: number;
  area: number;
  isSmall: boolean;
}

export interface LeafExtractionResult {
  leaves: LeafData[];
  totalCount: number;
}
