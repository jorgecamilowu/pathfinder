import MazeSolver from "./MazeSolver";
import PathFinder from "./PathFinder";
import { Node } from "../models";

export default class DijkstraShortestPath
  extends PathFinder
  implements MazeSolver {
  public solve(src: Node, sink: Node) {
    let visitedNodes: Node[] = [];

    //source node has distance 0
    src.distance = 0;
    src.isVisited = true;
    this.pq.add(src);
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
        if (tentativeDistance < node.distance) {
          node.distance = tentativeDistance;
          this.pq.updateKey(node, tentativeDistance); // maintain heap structure in the priority queue
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
