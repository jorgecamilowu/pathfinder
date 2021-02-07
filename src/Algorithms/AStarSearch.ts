import PathFinder from "./PathFinder";
import MazeSolver from "./MazeSolver";
import { Node } from "../models";

/**
 * Uses additional heuristic metrics to narrow down nodes explored
 * This implementation uses the Euclidean distance.
 */
export default class AStarSearch extends PathFinder implements MazeSolver {
  public solve(src: Node, sink: Node) {
    let visitedNodes: Node[] = [];

    //source node has distance 0
    src.distance = 0;
    src.isVisited = true;
    this.pq.add(src);
    // let i = 0;
    while (!this.pq.isEmpty()) {
      let minNode = this.pq.poll();
      if (minNode === null) break;

      visitedNodes.push(minNode);
      if (minNode.isWall) continue; // skip walls

      if (minNode === sink) {
        return {
          visitedNodes: visitedNodes,
          shortestPath: this.buildShortestPath(sink),
        };
      }
      // exploration
      let neighbors = this.getNeighbors(minNode.row, minNode.col);

      // attempt relaxation on explored nodes
      neighbors.forEach((node) => {
        // should not happen, help compiler
        if (minNode === null) return;

        let tentativeDistance = minNode.distance + node.weight;
        // calculate heuristic and update the node
        let eucledianDistance = Math.sqrt(
          (node.row - sink.row) ** 2 + (node.col - sink.col) ** 2
        );
        node.heuristic = eucledianDistance;
        if (tentativeDistance < node.distance) {
          node.distance = tentativeDistance;
          this.pq.updateKey(node, tentativeDistance);
        }
        // keep track of previous node to eventually build shortest path
        if (node.prevNode === null && node !== src) node.prevNode = minNode;

        if (!node.isVisited) {
          node.isVisited = true;
          this.pq.add(node);
        }
      });
    }
    // should not reach here
    return {
      visitedNodes: [],
      shortestPath: [],
    };
  }
}
