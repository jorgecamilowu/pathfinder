import DijkstraShortestPath from "./DijkstraShortestPath";
import Node from "../DataStructures/Node";

export default class AStarSearch extends DijkstraShortestPath {
  // OVERRIDE run method
  public run(src: Node, end: Node) {
    let visitedNodes: Node[] = [];
    //source node has distance 0
    console.log(src.wasVisited(), end.wasVisited());
    src.setDistance(0);
    src.setVisited(true);
    this.pq.add(src);
    let i = 0;
    while (!this.pq.isEmpty()) {
      i++;
      let minNode: Node = this.pq.poll();
      visitedNodes.push(minNode);
      if (minNode.nodeIsWall()) continue; // skip walls
      if (minNode === end) {
        console.log("finished A*");
        console.log(`visited: ${i}`);
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
      // relax explored nodes
      neighbors.forEach((node) => {
        let tentativeDistance = minNode.getDistance() + node.getWeight();
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
    console.log("reached end");
    return {
      visitedNodes: [],
      shortestPath: [],
    };
  }
}
