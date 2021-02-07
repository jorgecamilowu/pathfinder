import React from "react";
import "./NodeUI.css";
// import Node from "../../DataStructures/Node";
import { Node } from "../../models";
import History from "@material-ui/icons/History";
import Gamepad from "@material-ui/icons/Gamepad";
import Room from "@material-ui/icons/Room";
import { green, blueGrey } from "@material-ui/core/colors";

interface props {
  node: Node;
  onMouseDown(node: Node): void;
  onMouseEnter(node: Node): void;
  onMouseUp(): void;
}

class NodeUI extends React.Component<props, {}> {
  render() {
    let status =
      this.props.node.identity === "finish"
        ? "node-finish"
        : this.props.node.identity === "start"
        ? "node-start"
        : this.props.node.isWall
        ? "node-wall"
        : "";

    return (
      <div
        id={`node-${this.props.node.row}-${this.props.node.col}`}
        className={`node ${status} ${
          this.props.node.isWeighted() ? "weighted" : ""
        }`}
        onMouseDown={() => this.props.onMouseDown(this.props.node)}
        onMouseEnter={() => this.props.onMouseEnter(this.props.node)}
        onMouseUp={() => this.props.onMouseUp()}
      >
        <div className="icon-container">
          {this.props.node.identity === "start" ? (
            <Gamepad className="icon" style={{ color: green[500] }} />
          ) : this.props.node.identity === "finish" ? (
            <Room className="icon" color="secondary" />
          ) : this.props.node.isWeighted() ? (
            <History
              className="icon"
              fontSize="small"
              style={{ color: blueGrey[500] }}
            />
          ) : (
            <i />
          )}
        </div>
      </div>
    );
  }
}

export default NodeUI;
