import React from "react";
import Grid from "./Components/Grid/Grid";
import Node from "../DataStructures/Node";
import DijkstraShortestPath from "../Algorithms/DijkstraShortestPath";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface state {
  grid: Node[][];
  assignWall: boolean;
  assignStart: boolean;
  assignFinish: boolean;
  assignWeight: boolean;
  mouseIsPressed: boolean;
  prevStartNode: { row: number; col: number };
  prevFinishNode: { row: number; col: number };
}

class PathfindingVisualizer extends React.Component<{}, state> {
  private STARTING_NODE = { row: 7, col: 9 };
  private FINISH_NODE = { row: 7, col: 25 };

  constructor(props: any) {
    super(props);
    this.state = {
      grid: [],
      assignWall: false,
      assignStart: false,
      assignFinish: false,
      assignWeight: false,
      mouseIsPressed: false,
      prevStartNode: this.STARTING_NODE,
      prevFinishNode: this.FINISH_NODE,
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.runDijkstra = this.runDijkstra.bind(this);
    // this.animateDijkstra = this.animateDijkstra.bind(this);
    // this.animateShortestPath = this.animateShortestPath.bind(this);
    // this.changeNodeState = this.changeNodeState.bind(this);
  }

  componentDidMount() {
    /** Create new grid of nodes */
    let newGrid = [];
    const { row: startRow, col: startCol } = this.STARTING_NODE;
    const { row: finishRow, col: finishCol } = this.FINISH_NODE;
    for (let row = 0; row < 15; row++) {
      let currentRow: Node[] = [];
      for (let col = 0; col < 35; col++) {
        const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
        // let random = Math.random();
        // if (random < 0.3) {
        //   currentNode.setWeight(5);
        // }
        if (row === startRow && col === startCol) {
          currentNode.setStart(true);
        } else if (row === finishRow && col === finishCol) {
          currentNode.setFinish(true);
        }
        currentRow.push(currentNode);
      }
      newGrid.push(currentRow);
    }
    this.setState({ grid: newGrid });
  }

  handleMouseDown(node: Node): void {
    this.setState({ mouseIsPressed: true });
    this.setState({
      assignStart:
        node.nodeIsStart() && !node.nodeIsWall() && !node.nodeIsFinish(),
      assignFinish:
        node.nodeIsFinish() && !node.nodeIsWall() && !node.nodeIsStart(),
    });
  }

  handleMouseEnter(node: Node): void {
    if (this.state.mouseIsPressed) {
      // this.handleMouseDown(node);
      this.changeNodeState(node);
    }
  }

  handleMouseUp(): void {
    this.setState({
      mouseIsPressed: false,
      assignStart: false,
      assignFinish: false,
      assignWall: false,
    });
  }

  changeNodeState(node: Node): void {
    const row = node.getRow();
    const col = node.getCol();
    let grid = this.state.grid;
    // drag and drop starting node
    if (this.state.assignStart && !node.nodeIsWall()) {
      let { row: prevRow, col: prevCol } = this.state.prevStartNode;
      grid[prevRow][prevCol].setStart(false);
      grid[row][col].setStart(true);
      this.setState({ prevStartNode: { row, col } });
    }
    // drag and drop ending node
    else if (this.state.assignFinish && !node.nodeIsWall()) {
      let { row: prevRow, col: prevCol } = this.state.prevFinishNode;
      grid[prevRow][prevCol].setFinish(false);
      grid[row][col].setFinish(true);
      this.setState({ prevFinishNode: { row, col } });
    }
    // assign node to be weighted
    else if (this.state.assignWeight) {
      grid[row][col].weight = grid[row][col].weight === 1 ? 5 : 1;
    } else {
      grid[row][col].setWall(!grid[row][col].nodeIsWall());
    }
    this.setState({ grid: grid });
  }

  runDijkstra(): void {
    let dsp = new DijkstraShortestPath(this.state.grid);
    const { row: startRow, col: startCol } = this.state.prevStartNode;
    const { row: finishRow, col: finishCol } = this.state.prevFinishNode;

    const { visitedNodes, shortestPath } = dsp.runDijkstra(
      this.state.grid[startRow][startCol],
      this.state.grid[finishRow][finishCol]
    );
    this.animateDijkstra(visitedNodes, shortestPath);
  }

  animateDijkstra(visitedNodes: Node[], shortestPath: Node[]) {
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
      }, 10 * i);
    }
  }

  animateShortestPath(shortestPath: Node[]) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document
          .getElementById(`node-${node.getRow()}-${node.getCol()}`)!
          .classList.add(
            !node.nodeIsWall() && !node.nodeIsStart() && !node.nodeIsFinish()
              ? "path"
              : "nope"
          );
      }, 15 * i);
    }
  }

  handleToggle(ele: any) {
    console.log(ele);
  }

  render() {
    return (
      <div>
        <div>
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
                color="primary"
              />
            }
            label="Add Weight"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={this.runDijkstra}
          >
            Start Dijkstra
          </Button>
        </div>
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

export default PathfindingVisualizer;
