import MinHeap from "../DataStructures/MinHeap";
import Node from "../DataStructures/Node";

export default class DijkstraShortestPath {
  private pq = new MinHeap();
  private grid: Node[][] = [];

  constructor(grid: Node[][]) {
    this.grid = grid;
  }

  public dijkstra(src: Node, end: Node) {
    // let path: Node[] = [];
    //source node has distance 0
    src.setDistance(0);
    this.pq.add(src);
    console.log("running dijkstra");

    while (!this.pq.isEmpty()) {
      let minNode: Node = this.pq.poll();
      if (minNode.nodeIsWall()) continue; // skip walls

      minNode.setVisited(true);
      if (minNode === end) {
        console.log("finished dijkstra");
        return this.buildShortestPath(end);
      }
      let neighbors: Node[] = this.getUnvisitedNeighbors(
        minNode.getRow(),
        minNode.getCol()
      );
      // relax nodes
      neighbors.forEach((node) => {
        //TO DO: handle weights on each node
        let tentativeDistance = 1 + minNode.getDistance();
        if (tentativeDistance < node.getDistance()) {
          node.setDistance(tentativeDistance);
        }
        // keep track of previous node to eventually build shortest path
        node.setPrevNode(minNode);

        if (!node.wasVisited()) {
          this.pq.add(node);
        }
      });
    }
    console.log("finished dijkstra");
    return this.buildShortestPath(end);
  }

  private buildShortestPath(node: Node) {
    let output = [];
    let currentNode = node;
    while (currentNode !== null) {
      output.push(currentNode);
      currentNode.isPath = true;
      currentNode = currentNode.getPrevNode();
    }
    return output;
  }

  private getUnvisitedNeighbors(row: number, col: number): Node[] {
    if (
      row < 0 ||
      row >= this.grid.length ||
      col < 0 ||
      col >= this.grid[0].length
    )
      return [];

    let output: Node[] = [];
    if (row > 0) output.push(this.grid[row - 1][col]);
    if (row < this.grid.length - 1) output.push(this.grid[row + 1][col]);
    if (col > 0) output.push(this.grid[row][col - 1]);
    if (col < this.grid[0].length - 1) output.push(this.grid[row][col + 1]);

    return output.filter((neighbor) => !neighbor.wasVisited());
  }
}
