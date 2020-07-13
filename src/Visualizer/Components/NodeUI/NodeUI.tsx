import React from "react";
import "./NodeUI.css";
import Node from "../../../DataStructures/Node";

interface props {
  // row: number;
  // col: number;
  // isFinish: boolean;
  // isStart: boolean;
  // isWall: boolean;
  node: Node;
  onMouseDown(col: number, row: number): void;
  onMouseEnter(col: number, row: number): void;
  onMouseUp(): void;
}

class NodeUI extends React.Component<props, {}> {
  render() {
    let status = this.props.node.nodeIsFinish()
      ? "node-finish"
      : this.props.node.nodeIsStart()
      ? "node-start"
      : this.props.node.nodeIsWall()
      ? "node-wall"
      : "";

    let visited =
      this.props.node.wasVisited() &&
      !this.props.node.nodeIsStart() &&
      !this.props.node.nodeIsFinish()
        ? "visited"
        : "";

    let path =
      this.props.node.isPath &&
      !this.props.node.nodeIsStart() &&
      !this.props.node.nodeIsFinish()
        ? "path"
        : "";
    return (
      <div
        id={`node-${this.props.node.getRow()}-${this.props.node.getCol()}`}
        className={`node ${status} ${visited} ${path}`}
        onMouseDown={() =>
          this.props.onMouseDown(
            this.props.node.getRow(),
            this.props.node.getCol()
          )
        }
        onMouseEnter={() =>
          this.props.onMouseEnter(
            this.props.node.getRow(),
            this.props.node.getCol()
          )
        }
        onMouseUp={() => this.props.onMouseUp()}
      />
    );
  }
}

export default NodeUI;
