class Node {
  private distance: number;
  private heuristic: number;
  private row: number;
  private col: number;
  private isStart: boolean;
  private isFinish: boolean;
  private isWall: boolean;
  private isVisited: boolean;
  private isWeighted: boolean;
  private prevNode: Node | any;
  private weight: number;

  constructor(distance: number, row: number, col: number) {
    this.distance = distance;
    this.row = row;
    this.col = col;
    this.isStart = false;
    this.isFinish = false;
    this.isWall = false;
    this.isVisited = false;
    this.isWeighted = false;
    this.prevNode = null;
    this.weight = 1;
    this.heuristic = 0;
  }

  public resetNode(): void {
    this.distance = Number.MAX_VALUE;
    this.isVisited = false;
    this.heuristic = 0;
  }

  public setStart(status: boolean): void {
    if (this.isFinish) return;
    this.isStart = status;
    this.isWall = false;
    this.weight = 1;
  }
  public setFinish(status: boolean): void {
    if (this.isStart) return;
    this.isFinish = status;
    this.isWall = false;
    this.weight = 1;
  }
  public setWall(status: boolean): void {
    if (this.isStart || this.isFinish || this.isWeighted) return;
    this.isWall = status;
  }
  public setDistance(distance: number): void {
    this.distance = distance;
  }
  public setWeight(weight: number): void {
    if (this.isWall || this.isStart || this.isFinish) return;
    this.weight = weight;
    this.isWeighted = weight > 1;
  }
  public setVisited(status: boolean): void {
    this.isVisited = status;
  }
  public wasVisited(): boolean {
    return this.isVisited;
  }
  public getDistance(): number {
    return this.distance;
  }
  public getRow(): number {
    return this.row;
  }
  public getCol(): number {
    return this.col;
  }
  public nodeIsStart(): boolean {
    return this.isStart;
  }
  public nodeIsFinish(): boolean {
    return this.isFinish;
  }
  public nodeIsWall(): boolean {
    return this.isWall;
  }
  public nodeIsWeighted(): boolean {
    return this.isWeighted;
  }
  public setPrevNode(node: Node) {
    this.prevNode = node;
  }
  public getPrevNode() {
    return this.prevNode;
  }
  public getWeight(): number {
    return this.weight;
  }
  public getHeuristic(): number {
    return this.heuristic;
  }
  public setHeuristic(value: number): void {
    this.heuristic = value;
  }
}

export default Node;
