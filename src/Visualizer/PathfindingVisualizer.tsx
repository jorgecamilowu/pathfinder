import React from "react";
import Grid from "./Components/Grid/Grid";
import Node from "../DataStructures/Node";
import DijkstraShortestPath from "../Algorithms/DijkstraShortestPath";
import Button from "react-bootstrap/Button";

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
  constructor(props: any) {
    super(props);
    this.state = {
      grid: [],
      assignWall: false,
      assignStart: false,
      assignFinish: false,
      assignWeight: false,
      mouseIsPressed: false,
      prevStartNode: {
        row: 0,
        col: 0,
      },
      prevFinishNode: {
        row: 0,
        col: 0,
      },
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.runDijkstra = this.runDijkstra.bind(this);
    this.animateDijkstra = this.animateDijkstra.bind(this);
    this.animateShortestPath = this.animateShortestPath.bind(this);
    this.handleButtonActions = this.handleButtonActions.bind(this);
  }

  componentDidMount() {
    /** Create new grid of nodes */
    let newGrid = [];
    for (let row = 0; row < 15; row++) {
      let currentRow: Node[] = [];
      for (let col = 0; col < 35; col++) {
        const currentNode: Node = new Node(Number.MAX_VALUE, row, col);
        // let random = Math.random();
        // if (random < 0.3) currentNode.weight = 5;
        currentRow.push(currentNode);
      }
      newGrid.push(currentRow);
    }
    this.setState({ grid: newGrid });
  }

  handleButtonActions(array: any) {
    switch (array[0]) {
      case 1:
        console.log(array[0]);
        this.setState({ assignStart: !this.state.assignStart });
        break;
      case 2:
        console.log(array[0]);
        this.setState({ assignFinish: !this.state.assignFinish });
        break;
      case 3:
        console.log(array[0]);
        this.setState({ assignWall: !this.state.assignWall });
        break;
      case 4:
        console.log(array[0]);
        this.setState({ assignWeight: !this.state.assignWeight });
        break;
    }
  }

  handleMouseDown(row: number, col: number): void {
    this.setState({ mouseIsPressed: true });

    let currentGrid: Node[][] = this.state.grid;
    const isStart = currentGrid[row][col].nodeIsStart();
    const isFinish = currentGrid[row][col].nodeIsFinish();
    const isWall = currentGrid[row][col].nodeIsWall();

    if (
      this.state.assignWall &&
      !this.state.assignStart &&
      !this.state.assignFinish &&
      !this.state.assignWeight &&
      !isStart && // make sure current node is neither start nor finish node
      !isFinish
    ) {
      currentGrid[row][col].setWall(!isWall);
    }

    if (
      this.state.assignWeight &&
      !this.state.assignFinish &&
      !this.state.assignWall &&
      !this.state.assignStart &&
      !isStart && // make sure current node is neither start node nor wall
      !isWall
    ) {
      currentGrid[row][col].weight = currentGrid[row][col].weight === 1 ? 5 : 1;
    }

    if (
      this.state.assignStart &&
      !this.state.assignWall &&
      !this.state.assignFinish &&
      !this.state.assignWeight &&
      !isFinish && // make sure current node is neither finish node nor wall
      !isWall
    ) {
      const { row: prevRow, col: prevCol } = this.state.prevStartNode;
      let prevStartNode: Node = currentGrid[prevRow][prevCol];
      prevStartNode.setStart(false); // reset previous start node
      currentGrid[row][col].setStart(true); // set new start node

      this.setState({
        // save current row and col
        prevStartNode: {
          row: row,
          col: col,
        },
      });
    }

    if (
      this.state.assignFinish &&
      !this.state.assignWall &&
      !this.state.assignStart &&
      !this.state.assignWeight &&
      !isStart && // make sure current node is neither start node nor wall
      !isWall
    ) {
      const { row: prevRow, col: prevCol } = this.state.prevFinishNode;
      let prevStartNode: Node = currentGrid[prevRow][prevCol];
      prevStartNode.setFinish(false); // reset previous start node
      currentGrid[row][col].setFinish(true); // set new start node

      this.setState({
        // save current row and col
        prevFinishNode: {
          row: row,
          col: col,
        },
      });
    }

    this.setState({ grid: currentGrid });
  }

  handleMouseEnter(row: number, col: number): void {
    if (this.state.mouseIsPressed) {
      this.handleMouseDown(row, col);
    }
  }

  handleMouseUp(): void {
    this.setState({ mouseIsPressed: false });
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

  render() {
    return (
      <div>
        <div>
          <Button
            onClick={() =>
              this.setState({ assignStart: !this.state.assignStart })
            }
            disabled={this.state.assignWall || this.state.assignFinish}
          >
            {this.state.assignStart ? "Done!" : "Set Start Node"}
          </Button>
          <Button
            onClick={() =>
              this.setState({ assignFinish: !this.state.assignFinish })
            }
            disabled={this.state.assignWall || this.state.assignStart}
          >
            {this.state.assignFinish ? "Done!" : "Set Finish Node"}
          </Button>
          <Button
            onClick={() =>
              this.setState({ assignWall: !this.state.assignWall })
            }
            disabled={this.state.assignStart || this.state.assignFinish}
          >
            {this.state.assignWall ? "Done!" : "Set Wall"}
          </Button>
          <Button onClick={this.runDijkstra}>Start Dijkstra</Button>
          <Button
            onClick={() =>
              this.setState({ assignWeight: !this.state.assignWeight })
            }
          >
            Set weight
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
