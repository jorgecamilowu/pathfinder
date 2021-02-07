import NodeIdentity from "./NodeIdentity";

export default class Node {
  private _identity: NodeIdentity; // either starting node, finish node, or normal node
  public get identity(): NodeIdentity {
    return this._identity;
  }
  public set identity(value: NodeIdentity) {
    this._identity = value;
  }

  private _prevNode: Node | null;
  public get prevNode(): Node | null {
    return this._prevNode;
  }
  public set prevNode(value: Node | null) {
    this._prevNode = value;
  }

  private _distance: number;
  public get distance(): number {
    return this._distance;
  }
  public set distance(value: number) {
    this._distance = value;
  }

  private _heuristic: number;
  public get heuristic(): number {
    return this._heuristic;
  }
  public set heuristic(value: number) {
    this._heuristic = value;
  }

  private _row: number;
  public get row(): number {
    return this._row;
  }
  public set row(value: number) {
    this._row = value;
  }

  private _col: number;
  public get col(): number {
    return this._col;
  }
  public set col(value: number) {
    this._col = value;
  }

  private _isVisited: boolean;
  public get isVisited(): boolean {
    return this._isVisited;
  }
  public set isVisited(value: boolean) {
    this._isVisited = value;
  }

  private _isWall: boolean;
  public get isWall(): boolean {
    return this._isWall;
  }
  public set isWall(value: boolean) {
    if (!this.isWeighted() && this._identity === "node") {
      this._isWall = value;
    }
  }

  private _weight: number;
  public get weight(): number {
    return this._weight;
  }
  public set weight(value: number) {
    if (!this._isWall && this._identity === "node") {
      this._weight = value;
    }
  }

  constructor(distance: number, row: number, col: number) {
    this._distance = distance;
    this._row = row;
    this._col = col;

    this._identity = "node";
    this._isVisited = false;
    this._isWall = false;
    this._weight = 1;
    this._heuristic = 0;
    this._prevNode = null;
  }

  // Reset's previous path solutions. Note that the weight and wall state are maintained.
  public resetNode(): void {
    this._distance = Number.MAX_VALUE;
    this.isVisited = false;
    this._heuristic = 0;
  }

  // helper method to see if node is weighted
  public isWeighted(): boolean {
    return this._weight > 1;
  }
}
