import MinHeap from "../MinHeap";
import Node from "../Node";

let pq: MinHeap = new MinHeap();
pq.add(new Node(2, 1, 1));
pq.add(new Node(1, 1, 1));
pq.add(new Node(3, 1, 1));
pq.add(new Node(6, 1, 1));
pq.add(new Node(4, 1, 1));
pq.add(new Node(8, 1, 1));
pq.add(new Node(7, 1, 1));

test("Test correct structure after adding nodes", () => {
  console.log(pq.getNodes);
  let array = [1, 2, 3, 6, 4, 8, 7];
  expect(pq.getNodes()).toEqual(array);
});

test("Test correct min extraction", () => {
  expect(pq.poll()).toBe(1);
  expect(pq.getNodes()).toEqual([2, 4, 3, 6, 7, 8]);

  expect(pq.poll()).toBe(2);
  expect(pq.getNodes()).toEqual([3, 4, 8, 6, 7]);

  expect(pq.poll()).toBe(3);
  expect(pq.getNodes()).toEqual([4, 6, 8, 7]);
});
