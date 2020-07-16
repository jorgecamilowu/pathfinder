import React from "react";
import "./NodeUI.css";
import Node from "../../../DataStructures/Node";

interface props {
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

    return (
      <div
        id={`node-${this.props.node.getRow()}-${this.props.node.getCol()}`}
        className={`node ${status} ${
          this.props.node.weight > 1 ? "weighted" : ""
        }`}
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
