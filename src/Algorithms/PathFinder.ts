import { Node, MinHeap } from "../models";

abstract class PathFinder {
  protected grid: Node[][];
  protected pq: MinHeap;

  constructor(grid: Node[][]) {
    this.grid = grid;
    this.pq = new MinHeap();
  }

  abstract solve(
    src: Node,
    sink: Node
  ): { visitedNodes: Node[]; shortestPath: Node[] };

  /** -----------Utilities for derived classes----------- */
  // recursively builds shortest path
  protected buildShortestPath(node: Node): Node[] {
    let output = [];
    let currentNode = node;
    while (currentNode !== null && currentNode.prevNode !== null) {
      output.push(currentNode);
      currentNode = currentNode.prevNode;
    }
    return output;
  }

  // gathers neighboring nodes if not out of bounds
  protected getNeighbors(row: number, col: number): Node[] {
    let output: Node[] = [];
    if (row > 0) output.push(this.grid[row - 1][col]);
    if (row < this.grid.length - 1) output.push(this.grid[row + 1][col]);
    if (col > 0) output.push(this.grid[row][col - 1]);
    if (col < this.grid[0].length - 1) output.push(this.grid[row][col + 1]);
    return output;
  }
}

export default PathFinder;
