import React from "react";
import "./Node.css";

interface props {
  row: number;
  col: number;
  isFinish: boolean;
  isStart: boolean;
  isWall: boolean;
  onMouseDown(col: number, row: number): void;
  onMouseEnter(col: number, row: number): void;
  onMouseUp(): void;
}

class NodeUI extends React.Component<props, {}> {
  render() {
    let status = this.props.isFinish
      ? "node-finish"
      : this.props.isStart
      ? "node-start"
      : this.props.isWall
      ? "node-wall"
      : "";
    return (
      <div
        id={`node-${this.props.row}-${this.props.col}`}
        className={`node ${status}`}
        onMouseDown={() =>
          this.props.onMouseDown(this.props.row, this.props.col)
        }
        onMouseEnter={() =>
          this.props.onMouseEnter(this.props.row, this.props.col)
        }
        onMouseUp={() => this.props.onMouseUp()}
      />
    );
  }
}

export default NodeUI;
