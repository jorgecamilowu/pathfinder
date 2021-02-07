import { Node } from "../../models";
import AStarSearch from "../AStarSearch";

let newGrid: Node[][] = [];
for (let row = 0; row < 15; row++) {
  let currentRow: Node[] = [];
  for (let col = 0; col < 35; col++) {
    const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
    currentRow.push(currentNode);
  }
  newGrid.push(currentRow);
}

let asp = new AStarSearch(newGrid);
test("Check runtime efficiency of algorithm", () => {
  expect(asp.solve(newGrid[0][0], newGrid[14][34]));
});
