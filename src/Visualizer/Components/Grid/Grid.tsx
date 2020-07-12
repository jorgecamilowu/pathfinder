import React from "react";
import "./Grid.css";
import NodeUI from "../Node/NodeUI";
import { node } from "../../Model";

interface props {
  grid: node[][];
  onMouseDown(row: number, col: number): void;
  onMouseEnter(row: number, col: number): void;
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
                const { isStart, isFinish, isWall } = col;
                return (
                  <NodeUI
                    key={colIdx}
                    row={rowIdx}
                    col={colIdx}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
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
