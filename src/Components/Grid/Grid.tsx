import React from "react";
import "./Grid.css";
import NodeUI from "../NodeUI/NodeUI";
// import Node from "../../DataStructures/Node";
import { Node } from "../../models";

interface props {
  grid: Node[][];
  onMouseDown(node: Node): void;
  onMouseEnter(node: Node): void;
  onMouseUp(): void;
}

class Grid extends React.Component<props, {}> {
  render() {
    return (
      <div className="grid">
        {this.props.grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((col, colIdx) => {
                return (
                  <NodeUI
                    key={colIdx}
                    node={col}
                    onMouseDown={this.props.onMouseDown}
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseUp={this.props.onMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Grid;
