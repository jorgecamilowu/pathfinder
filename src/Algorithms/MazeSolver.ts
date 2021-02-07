import { Node } from "../models";

interface MazeSolver {
  solve(src: Node, sink: Node): { visitedNodes: Node[]; shortestPath: Node[] };
}

export default MazeSolver;
