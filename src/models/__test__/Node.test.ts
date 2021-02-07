import Node from "../Node";

describe("tests Node accessors", () => {
  it("correctly restricts the weigtht setter when node is a wall", () => {
    const node = new Node(10, 1, 1);
    node.isWall = true;
    node.weight = 5;
    expect(node.weight).toEqual(1);

    node.isWall = false;
    node.weight = 5;
    expect(node.weight).toEqual(5);
  });

  it("correctly restricts the wall setter when already weighted", () => {
    const node = new Node(10, 1, 1);
    node.weight = 5;
    node.isWall = true;
    expect(node.isWall).toEqual(false);

    node.weight = 1;
    node.isWall = true;
    expect(node.isWall).toEqual(true);
  });

  it("correctly restricts wall setter when identity is not node", () => {
    const node = new Node(10, 1, 1);
    node.identity = "start";
    node.isWall = true;
    expect(node.isWall).toBe(false);
  });

  it("correctly restricts weight setter when identity is not node", () => {
    const node = new Node(10, 1, 1);
    node.identity = "start";
    node.weight = 5;
    expect(node.weight).toBe(1);
  });
});

describe("tests helper functions", () => {
  it("correctly resets the node", () => {
    const node = new Node(10, 1, 1);
    node.weight = 10;
    node.heuristic = 10;
    node.isVisited = true;
    node.resetNode();
    expect(node.distance).toEqual(Number.MAX_VALUE);
    expect(node.heuristic).toEqual(0);
    expect(node.isVisited).toEqual(false);
    expect(node.weight).toEqual(10);
  });

  it("returns the correct weighted status or a Node", () => {
    const node = new Node(10, 1, 1);
    expect(node.isWeighted()).toBe(false);
    node.weight = 10;
    expect(node.isWeighted()).toBe(true);
  });
});
