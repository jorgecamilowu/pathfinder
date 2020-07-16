import MinHeap from "../DataStructures/MinHeap";
import Node from "../DataStructures/Node";

export default class DijkstraShortestPath {
  private pq = new MinHeap();
  private grid: Node[][] = [];

  constructor(grid: Node[][]) {
    this.grid = grid;
  }

  public runDijkstra(src: Node, end: Node) {
    let visitedNodes: Node[] = [];
    //source node has distance 0
    src.setDistance(0);
    src.setVisited(true);
    this.pq.add(src);
    console.log("running dijkstra");
    let i = 0;
    while (!this.pq.isEmpty()) {
      i++;
      let minNode: Node = this.pq.poll();
      visitedNodes.push(minNode);
      if (minNode.nodeIsWall()) continue; // skip walls
      // minNode.setVisited(true);
      if (minNode === end) {
        console.log("finished dijkstra");
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
        // let relaxed: boolean = false;

        //TO DO: handle weights on each node
        let tentativeDistance = minNode.getDistance() + node.weight;
        if (tentativeDistance < node.getDistance()) {
          // relaxed = true;
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
    return {
      visitedNodes: visitedNodes,
      shortestPath: this.buildShortestPath(end),
    };
  }

  private buildShortestPath(node: Node) {
    let output = [];
    let currentNode = node;
    while (currentNode !== null) {
      output.push(currentNode);
      currentNode = currentNode.getPrevNode();
    }
    return output;
  }

  private getNeighbors(row: number, col: number): Node[] {
    let output: Node[] = [];
    if (row > 0) output.push(this.grid[row - 1][col]);
    if (row < this.grid.length - 1) output.push(this.grid[row + 1][col]);
    if (col > 0) output.push(this.grid[row][col - 1]);
    if (col < this.grid[0].length - 1) output.push(this.grid[row][col + 1]);
    return output;
  }
}
