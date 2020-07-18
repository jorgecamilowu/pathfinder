import React from "react";
import "./App.css";
import Grid from "./Components/Grid/Grid";
import Node from "./DataStructures/Node";
import DijkstraShortestPath from "./Algorithms/DijkstraShortestPath";
import AStarSearch from "./Algorithms/AStarSearch";
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
    this.runDijkstra = this.runDijkstra.bind(this);
    this.runAStarSearch = this.runAStarSearch.bind(this);
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

    newGrid[startRow][startCol].setStart(true);
    newGrid[finishRow][finishCol].setFinish(true);
    this.setState({ grid: newGrid });
  }

  handleMouseDown(node: Node): void {
    if (this.state.blockClick) return;
    this.setState({ mouseIsPressed: true });
    this.setState({
      assignStart:
        node.nodeIsStart() && !node.nodeIsWall() && !node.nodeIsFinish(),
      assignFinish:
        node.nodeIsFinish() && !node.nodeIsWall() && !node.nodeIsStart(),
      assignWall:
        !node.nodeIsStart() &&
        !node.nodeIsFinish() &&
        !node.nodeIsWeighted() &&
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
    const row = node.getRow();
    const col = node.getCol();
    let grid = this.state.grid;

    // drag and drop starting node
    if (this.state.assignStart) {
      let { row: prevRow, col: prevCol } = this.state.prevStartNode;
      grid[prevRow][prevCol].setStart(false);
      grid[row][col].setStart(true);
      this.setState({ prevStartNode: { row, col } });
    }
    // drag and drop ending node
    else if (this.state.assignFinish) {
      let { row: prevRow, col: prevCol } = this.state.prevFinishNode;
      grid[prevRow][prevCol].setFinish(false);
      grid[row][col].setFinish(true);
      this.setState({ prevFinishNode: { row, col } });
    }
    // assign node to be weighted
    else if (this.state.assignWeight) {
      grid[row][col].setWeight(grid[row][col].getWeight() === 1 ? 5 : 1);
    } else {
      grid[row][col].setWall(!node.nodeIsWall());
    }
    this.setState({ grid: grid });
  }

  runDijkstra(): void {
    let grid = this.clearVisitedNodesAndPath();

    let dsp = new DijkstraShortestPath(grid);
    const { row: startRow, col: startCol } = this.state.prevStartNode;
    const { row: finishRow, col: finishCol } = this.state.prevFinishNode;

    const { visitedNodes, shortestPath } = dsp.run(
      grid[startRow][startCol],
      grid[finishRow][finishCol]
    );
    this.animateDijkstra(visitedNodes, shortestPath);
    this.setState({ blockClick: true });
  }

  runAStarSearch(): void {
    let grid = this.clearVisitedNodesAndPath();

    let dsp = new AStarSearch(grid);
    const { row: startRow, col: startCol } = this.state.prevStartNode;
    const { row: finishRow, col: finishCol } = this.state.prevFinishNode;

    const { visitedNodes, shortestPath } = dsp.run(
      grid[startRow][startCol],
      grid[finishRow][finishCol]
    );
    this.animateDijkstra(visitedNodes, shortestPath);
    this.setState({ blockClick: true });
  }

  animateDijkstra(visitedNodes: Node[], shortestPath: Node[]) {
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
          let row = node.getRow();
          let col = node.getCol();
          document
            .getElementById(`node-${row}-${col}`)!
            .classList.add(
              !node.nodeIsWall() && !node.nodeIsStart() && !node.nodeIsFinish()
                ? "visited"
                : "nope"
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
          .getElementById(`node-${node.getRow()}-${node.getCol()}`)!
          .classList.add(!node.nodeIsWall() ? "path" : "nope");
      }, 30 * i);
    }
    setTimeout(() => {
      this.setState({ animating: false });
    }, 1000);
  }

  clearVisitedNodesAndPath() {
    let grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.resetNode();
        document
          .getElementById(`node-${node.getRow()}-${node.getCol()}`)!
          .classList.remove("visited", "path");
      });
    });

    return grid;
  }

  clearBoard() {
    let grid = [];
    for (let row = 0; row < this.GRID_SIZE.rows; row++) {
      let currentRow: Node[] = [];
      for (let col = 0; col < this.GRID_SIZE.cols; col++) {
        const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
        currentRow.push(currentNode);
      }
      grid.push(currentRow);
    }

    this.state.grid.forEach((nodes) => {
      nodes.forEach((node) => {
        document.getElementById(
          `node-${node.getRow()}-${node.getCol()}`
        )!.className = node.nodeIsStart() ? "node node-start" : "node";
      });
    });

    grid[this.state.prevStartNode.row][this.state.prevStartNode.col].setStart(
      true
    );
    grid[this.state.prevFinishNode.row][
      this.state.prevFinishNode.col
    ].setFinish(true);

    this.setState({ grid: grid, blockClick: false });
  }

  generateRandomWalls(): void {
    let grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.setWall(false); // clear previously generated walls
        let random = Math.random();
        if (random <= 0.3) {
          node.setWall(true);
        }
      });
    });
    this.setState({ grid: grid });
  }

  generateRandomWeights(): void {
    let grid = this.state.grid;
    grid.forEach((nodes) => {
      nodes.forEach((node) => {
        node.setWeight(1); // clear previously generated weights
        let random = Math.random();
        if (random <= 0.3) {
          node.setWeight(5);
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
            onClick={this.runDijkstra}
          >
            Run Dijkstra
          </Button>
          <Button
            id="astar"
            variant="contained"
            color="primary"
            disabled={this.state.animating}
            onClick={this.runAStarSearch}
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
