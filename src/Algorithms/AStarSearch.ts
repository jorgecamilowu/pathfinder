import DijkstraShortestPath from "./DijkstraShortestPath";
import Node from "../DataStructures/Node";

/**
 * A* Search is an extension of Dijkstra's shortest path algorithm
 * Uses additional heuristic metrics to narrow down nodes explored
 * This implementation uses the Euclidean distance.
 */
export default class AStarSearch extends DijkstraShortestPath {
  // OVERRIDE run method
  public run(src: Node, end: Node) {
    let visitedNodes: Node[] = [];
    //source node has distance 0
    src.setDistance(0);
    src.setVisited(true);
    this.pq.add(src);
    // let i = 0;
    while (!this.pq.isEmpty()) {
      // i++;
      let minNode: Node = this.pq.poll();
      visitedNodes.push(minNode);
      if (minNode.nodeIsWall()) continue; // skip walls
      if (minNode === end) {
        // console.log("finished A*");
        // console.log(`visited: ${i}`);
        return {
          visitedNodes: visitedNodes,
          shortestPath: this.buildShortestPath(end),
        };
      }
      // exploration
      let neighbors: Node[] = this.getNeighbors(
        minNode.getRow(),
        minNode.getCol()
      );
      // attempt relaxation on explored nodes
      neighbors.forEach((node) => {
        let tentativeDistance = minNode.getDistance() + node.getWeight();
        // calculate heuristic and update the node
        let eucledianDistance = Math.sqrt(
          (node.getRow() - end.getRow()) ** 2 +
            (node.getCol() - end.getCol()) ** 2
        );
        node.setHeuristic(eucledianDistance);

        if (tentativeDistance < node.getDistance()) {
          node.setDistance(tentativeDistance);
          this.pq.updateKey(node, tentativeDistance);
        }
        // keep track of previous node to eventually build shortest path
        if (node.getPrevNode() === null && node !== src)
          node.setPrevNode(minNode);

        if (!node.wasVisited()) {
          node.setVisited(true);
          this.pq.add(node);
        }
      });
    }
    // should not reach here
    // console.log("reached end");
    return {
      visitedNodes: [],
      shortestPath: [],
    };
  }
}
