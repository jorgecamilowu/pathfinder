import MinHeap from "../DataStructures/MinHeap";
import Node from "../DataStructures/Node";

export default class DijkstraShortestPath {
  protected pq = new MinHeap();
  protected grid: Node[][] = [];

  constructor(grid: Node[][]) {
    this.grid = grid;
  }

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
        // console.log("finished dijkstra");
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
        if (tentativeDistance < node.getDistance()) {
          node.setDistance(tentativeDistance);
          this.pq.updateKey(node, tentativeDistance); // maintain heap structure in the priority queue
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

  protected buildShortestPath(node: Node) {
    let output = [];
    let currentNode = node;
    while (currentNode !== null) {
      output.push(currentNode);
      currentNode = currentNode.getPrevNode();
    }
    return output;
  }

  protected getNeighbors(row: number, col: number): Node[] {
    let output: Node[] = [];
    if (row > 0) output.push(this.grid[row - 1][col]);
    if (row < this.grid.length - 1) output.push(this.grid[row + 1][col]);
    if (col > 0) output.push(this.grid[row][col - 1]);
    if (col < this.grid[0].length - 1) output.push(this.grid[row][col + 1]);
    return output;
  }
}
