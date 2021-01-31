import MinHeap from "../MinHeap";
import Node from "../Node";

describe("Tests for correct heap structure", () => {
  it("maintains correct structure after adding nodes", () => {
    const pq: MinHeap = new MinHeap();
    pq.add(new Node(2, 1, 1));
    pq.add(new Node(1, 1, 1));
    pq.add(new Node(3, 1, 1));
    pq.add(new Node(6, 1, 1));
    pq.add(new Node(4, 1, 1));
    pq.add(new Node(8, 1, 1));
    pq.add(new Node(7, 1, 1));

    const array = [1, 2, 3, 6, 4, 8, 7];
    expect(pq.getNodes()).toEqual(array);
  });

  it("maintains correct after poll extraction", () => {
    const pq: MinHeap = new MinHeap();
    pq.add(new Node(2, 1, 1));
    pq.add(new Node(1, 1, 1));
    pq.add(new Node(3, 1, 1));
    pq.add(new Node(6, 1, 1));
    pq.add(new Node(4, 1, 1));
    pq.add(new Node(8, 1, 1));
    pq.add(new Node(7, 1, 1));

    expect(pq.poll().distance).toBe(1);
    expect(pq.getNodes()).toEqual([2, 4, 3, 6, 7, 8]);

    expect(pq.poll().distance).toBe(2);
    expect(pq.getNodes()).toEqual([3, 4, 8, 6, 7]);

    expect(pq.poll().distance).toBe(3);
    expect(pq.getNodes()).toEqual([4, 6, 8, 7]);
  });

  it("maintains correct structure after updating key", () => {
    const pq: MinHeap = new MinHeap();
    const node = new Node(3, 1, 1);

    pq.add(new Node(2, 1, 1));
    pq.add(node);
    pq.add(new Node(6, 1, 1));
    pq.add(new Node(4, 1, 1));
    pq.add(new Node(8, 1, 1));
    pq.add(new Node(7, 1, 1));
    expect(pq.getNodes()).toEqual([2, 3, 6, 4, 8, 7]);

    pq.updateKey(node, 1);
    expect(pq.getNodes()).toEqual([1, 2, 6, 4, 8, 7]);
  });

  it("returns the top node on min extraction", () => {
    const pq: MinHeap = new MinHeap();
    const node = new Node(1, 1, 1);
    pq.add(new Node(2, 1, 1));
    pq.add(node);
    pq.add(new Node(3, 1, 1));
    pq.add(new Node(6, 1, 1));

    expect(pq.min()).toBe(node);
  });
});

describe("tests helper functions", () => {
  it("returns correct emtpy status", () => {
    const pq: MinHeap = new MinHeap();
    pq.add(new Node(2, 1, 1));
    pq.add(new Node(1, 1, 1));
    pq.add(new Node(3, 1, 1));

    expect(pq.isEmpty()).toBe(false);
    pq.poll();
    pq.poll();
    pq.poll();
    expect(pq.isEmpty()).toBe(true);
  });
});
