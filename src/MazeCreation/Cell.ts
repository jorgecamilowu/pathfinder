export default class Cell {
  public isVisited: boolean;
  public up: boolean;
  public down: boolean;
  public left: boolean;
  public right: boolean;

  constructor() {
    this.isVisited = false;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
  }
}
