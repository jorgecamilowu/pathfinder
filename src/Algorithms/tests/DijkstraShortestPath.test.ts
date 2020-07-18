import DijkstraShortestPath from "../DijkstraShortestPath";
import Node from "../../DataStructures/Node";

let newGrid: Node[][] = [];
for (let row = 0; row < 15; row++) {
  let currentRow: Node[] = [];
  for (let col = 0; col < 35; col++) {
    const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
    currentRow.push(currentNode);
  }
  newGrid.push(currentRow);
}

let dsp = new DijkstraShortestPath(newGrid);
test("Check runtime efficiency of algorithm", () => {
  expect(dsp.run(newGrid[0][0], newGrid[14][34]));
});
