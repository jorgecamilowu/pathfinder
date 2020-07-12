class Node {
  private distance: number;
  private row: number;
  private col: number;
  private isStart: boolean;
  private isFinish: boolean;
  private isWall: boolean;

  constructor(distance: number, row: number, col: number) {
    this.distance = distance;
    this.row = row;
    this.col = col;
    this.isStart = false;
    this.isFinish = false;
    this.isWall = false;
  }

  public setStart(status: boolean): void {
    this.isStart = status;
    this.isFinish = false;
    this.isWall = false;
  }
  public setFinish(status: boolean): void {
    this.isFinish = status;
    this.isStart = false;
    this.isWall = false;
  }
  public setWall(status: boolean): void {
    this.isWall = status;
    this.isStart = false;
    this.isFinish = false;
  }
  public setDistance(distance: number): void {
    this.distance = distance;
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
}

export default Node;
