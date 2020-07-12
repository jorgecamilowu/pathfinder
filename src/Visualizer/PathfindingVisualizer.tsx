import React from "react";
import Grid from "./Components/Grid/Grid";
import { node } from "./Model";

interface props {}

interface state {
  grid: node[][];
  assignWall: boolean;
  assignStart: boolean;
  assignFinish: boolean;
  mouseIsPressed: boolean;
  prevStartNode: { row: number; col: number };
  prevFinishNode: { row: number; col: number };
}

class PathfindingVisualizer extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      grid: [],
      assignWall: false,
      assignStart: false,
      assignFinish: false,
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
  }

  componentDidMount() {
    /** Create new grid of nodes */
    let newGrid = [];
    for (let row = 0; row < 15; row++) {
      let currentRow: node[] = [];
      for (let col = 0; col < 35; col++) {
        const currentNode: node = {
          isStart: false,
          isFinish: false,
          isWall: false,
        };
        currentRow.push(currentNode);
      }
      newGrid.push(currentRow);
    }
    this.setState({ grid: newGrid });
  }

  /**
   *
   * @param row
   * @param col
   */
  handleMouseDown(row: number, col: number): void {
    this.setState({ mouseIsPressed: true });

    let currentGrid: node[][] = this.state.grid;
    const { isStart, isFinish, isWall } = currentGrid[row][col];

    if (
      this.state.assignWall &&
      !this.state.assignStart &&
      !this.state.assignFinish &&
      !isStart && // make sure current node is neither start nor finish node
      !isFinish
    ) {
      currentGrid[row][col].isWall = !isWall;
    }

    if (
      this.state.assignStart &&
      !this.state.assignWall &&
      !this.state.assignFinish &&
      !isFinish && // make sure current node is neither finish node nor wall
      !isWall
    ) {
      const { row: prevRow, col: prevCol } = this.state.prevStartNode;
      let prevStartNode: node = currentGrid[prevRow][prevCol];
      prevStartNode.isStart = false; // reset previous start node
      currentGrid[row][col].isStart = true; // set new start node

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
      !isStart && // make sure current node is neither start node nor wall
      !isWall
    ) {
      const { row: prevRow, col: prevCol } = this.state.prevFinishNode;
      let prevStartNode: node = currentGrid[prevRow][prevCol];
      prevStartNode.isFinish = false; // reset previous start node
      currentGrid[row][col].isFinish = true; // set new start node

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

  render() {
    return (
      <div>
        <div>
          <button
            onClick={() =>
              this.setState({ assignStart: !this.state.assignStart })
            }
            disabled={this.state.assignWall || this.state.assignFinish}
          >
            {this.state.assignStart ? "Done!" : "Set Start Node"}
          </button>
          <button
            onClick={() =>
              this.setState({ assignFinish: !this.state.assignFinish })
            }
            disabled={this.state.assignWall || this.state.assignStart}
          >
            {this.state.assignFinish ? "Done!" : "Set Finish Node"}
          </button>
          <button
            onClick={() =>
              this.setState({ assignWall: !this.state.assignWall })
            }
            disabled={this.state.assignStart || this.state.assignFinish}
          >
            {this.state.assignWall ? "Done!" : "Set Wall"}
          </button>
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
