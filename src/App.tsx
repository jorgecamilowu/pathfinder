import React from "react";
import "./App.css";
import Grid from "./Components/Grid/Grid";
import { Node } from "./models";
import DijkstraShortestPath from "./Algorithms/DijkstraShortestPath";
import AStarSearch from "./Algorithms/AStarSearch";
import PathFinder from "./Algorithms/PathFinder";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";

interface state {
  grid: Node[][];
  assignWall: boolean;
  assignStart: boolean;
  assignFinish: boolean;
  assignWeight: boolean;
  mouseIsPressed: boolean;
  blockClick: boolean;
  animating: boolean;
  prevStartNode: { row: number; col: number };
  prevFinishNode: { row: number; col: number };
}

export default class App extends React.Component<{}, state> {
  private STARTING_SRC = { row: 9, col: 10 };
  private STARTING_TARGET = { row: 9, col: 29 };
  private GRID_SIZE = { rows: 18, cols: 40 };
  private ANIMATION_SPEED = 10;

  constructor(props: any) {
    super(props);
    this.state = {
      grid: [],
      assignWall: false,
      assignStart: false,
      assignFinish: false,
      assignWeight: false,
      mouseIsPressed: false,
      blockClick: false,
      animating: false,
      prevStartNode: this.STARTING_SRC,
      prevFinishNode: this.STARTING_TARGET,
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.solveMaze = this.solveMaze.bind(this);
    this.generateRandomWalls = this.generateRandomWalls.bind(this);
    this.generateRandomWeights = this.generateRandomWeights.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
  }

  componentDidMount() {
    /** Create new grid of nodes */
    let newGrid = [];
    const { row: startRow, col: startCol } = this.STARTING_SRC;
    const { row: finishRow, col: finishCol } = this.STARTING_TARGET;
    for (let row = 0; row < this.GRID_SIZE.rows; row++) {
      let currentRow: Node[] = [];
      for (let col = 0; col < this.GRID_SIZE.cols; col++) {
        const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
        currentRow.push(currentNode);
      }
      newGrid.push(currentRow);
    }

    newGrid[startRow][startCol].identity = "start";
    newGrid[finishRow][finishCol].identity = "finish";
    this.setState({ grid: newGrid });
  }

  handleMouseDown(node: Node): void {
    if (this.state.blockClick) return;
    this.setState({ mouseIsPressed: true });
    this.setState({
      assignStart: node.identity === "start" && !node.isWall,
      assignFinish: node.identity === "finish" && !node.isWall,
      assignWall:
        node.identity === "node" &&
        !node.isWeighted() &&
        !this.state.assignWeight,
    });
    this.changeNodeState(node);
  }

  handleMouseEnter(node: Node): void {
    if (this.state.mouseIsPressed) {
      this.changeNodeState(node);
    }
  }

  handleMouseUp(): void {
    this.setState({
      mouseIsPressed: false,
      assignStart: false,
      assignFinish: false,
    });
  }

  changeNodeState(node: Node): void {
    const { row, col } = node;
    let grid = this.state.grid;

    // drag and drop starting node
    if (this.state.assignStart) {
      const { row: prevRow, col: prevCol } = this.state.prevStartNode;
      grid[prevRow][prevCol].identity = "node";
      grid[row][col].identity = "start";
      this.setState({ prevStartNode: { row, col } });
    }
    // drag and drop ending node
    else if (this.state.assignFinish) {
      const { row: prevRow, col: prevCol } = this.state.prevFinishNode;
      grid[prevRow][prevCol].identity = "node";
      grid[row][col].identity = "finish";
      this.setState({ prevFinishNode: { row, col } });
    }
    // assign node to be weighted
    else if (this.state.assignWeight) {
      grid[row][col].weight = grid[row][col].weight === 1 ? 5 : 1;
    } else {
      grid[row][col].isWall = !node.isWall;
    }
    this.setState({ grid: grid });
  }

  /**
   * D: Dijkstra's Shortest Path
   * A: A Star Search
   */
  solveMaze(algoType: "D" | "A") {
    let algorithm: PathFinder;
    const grid = this.clearVisitedNodesAndPath();
    if (algoType === "D") {
      algorithm = new DijkstraShortestPath(grid);
    } else {
      algorithm = new AStarSearch(grid);
    }
    const { row: startRow, col: startCol } = this.state.prevStartNode;
    const { row: finishRow, col: finishCol } = this.state.prevFinishNode;
    const { visitedNodes, shortestPath } = algorithm.solve(
      grid[startRow][startCol],
      grid[finishRow][finishCol]
    );
    this.animateSolution(visitedNodes, shortestPath);
    this.setState({ blockClick: true });
  }

  animateSolution(visitedNodes: Node[], shortestPath: Node[]) {
    this.setState({ animating: true });
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 10 * i);
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        if (node) {
          document
            .getElementById(`node-${node.row}-${node.col}`)!
            .classList.add(
              !node.isWall && node.identity === "node" ? "visited" : "nope"
            );
        }
      }, this.ANIMATION_SPEED * i);
    }
  }

  animateShortestPath(shortestPath: Node[]) {
    shortestPath.reverse();
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document
          .getElementById(`node-${node.row}-${node.col}`)!
          .classList.add(!node.isWall ? "path" : "nope");
      }, 30 * i);
    }
    setTimeout(() => {
      this.setState({ animating: false });
    }, 1000);
  }

  /** Clears previous maze solution */
  clearVisitedNodesAndPath() {
    const grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.resetNode();
        document
          .getElementById(`node-${node.row}-${node.col}`)!
          .classList.remove("visited", "path");
      });
    });

    return grid;
  }

  /** Resets the board obstacles */
  clearBoard() {
    const grid = [];
    for (let row = 0; row < this.GRID_SIZE.rows; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < this.GRID_SIZE.cols; col++) {
        const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

    this.state.grid.forEach((nodes) => {
      nodes.forEach((node) => {
        document.getElementById(`node-${node.row}-${node.col}`)!.className =
          node.identity === "start" ? "node node-start" : "node";
      });
    });

    grid[this.state.prevStartNode.row][this.state.prevStartNode.col].identity =
      "start";
    grid[this.state.prevFinishNode.row][
      this.state.prevFinishNode.col
    ].identity = "finish";

    this.setState({ grid: grid, blockClick: false });
  }

  generateRandomWalls(): void {
    const grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.isWall = false; // clear previously generated walls
        let random = Math.random();
        if (random <= 0.3) {
          node.isWall = true;
        }
      });
    });
    this.setState({ grid: grid });
  }

  generateRandomWeights(): void {
    const grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.weight = 1; // clear previously generated weights
        let random = Math.random();
        if (random <= 0.3) {
          node.weight = 5;
        }
      });
    });
    this.setState({ grid: grid });
  }

  render() {
    return (
      <div className="App">
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.assignWeight}
                onChange={() =>
                  this.setState({
                    assignWeight: !this.state.assignWeight,
                    assignStart: false,
                    assignFinish: false,
                    assignWall: false,
                  })
                }
                disabled={this.state.blockClick}
                color="primary"
              />
            }
            label="Add Weight"
          />
          <Button
            id="randomWalls"
            onClick={this.generateRandomWalls}
            disabled={this.state.blockClick}
            color="primary"
          >
            Generate random walls
          </Button>
          <Button
            id="randomWeights"
            onClick={this.generateRandomWeights}
            disabled={this.state.blockClick}
            color="primary"
          >
            Generate random weights
          </Button>
          <Button
            id="clearBoard"
            onClick={this.clearBoard}
            disabled={this.state.animating}
            color="secondary"
          >
            Clear Board
          </Button>
          <Button
            id="dijkstra"
            variant="contained"
            color="primary"
            disabled={this.state.animating}
            onClick={() => this.solveMaze("D")}
          >
            Run Dijkstra
          </Button>
          <Button
            id="astar"
            variant="contained"
            color="primary"
            disabled={this.state.animating}
            onClick={() => this.solveMaze("A")}
          >
            Run A* Search
          </Button>
        </Box>
        <div>
          <Grid
            grid={this.state.grid}
            onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter}
            onMouseUp={this.handleMouseUp}
          />
        </div>
      </div>
    );
  }
}
