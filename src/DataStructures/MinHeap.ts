import Node from "./Node";

/**
 * node at index k:
 *  left child is at index 2k + 1
 *  Right child is at index 2k + 2
 *  Its parent is at index (k-1)/2
 */
export default class MinHeap {
  private nodes: Node[] = [];
  private size: number = 0;
  // map keeps track of where a given node's location in the binary tree
  private map: Map<Node, number> = new Map<Node, number>();

  min(): Node {
    return this.nodes[0];
  }

  add(node: Node): void {
    this.map.set(node, this.size); // keep track of nodes for updateKey()
    this.nodes.push(node);
    this.percolateUp(this.size);
    this.size++;
  }

  poll(): Node {
    if (this.size === 0) return null!;
    let min: Node = this.nodes[0];
    this.nodes[0] = this.nodes[this.size - 1];
    this.nodes.pop();
    this.size--;
    this.percolateDown(0);
    this.map.delete(min); // keep track of nodes for updateKey()
    return min;
  }

  updateKey(node: Node, newDistance: number) {
    if (node === null) return;
    let index = this.map.get(node);
    if (index !== undefined) {
      this.nodes[index].setDistance(newDistance);
      this.percolateUp(index);
    }
  }

  /**Recursively swaps node with its parent
   * until min heap structure is satisfied.
   * takes into account the heuristics metrics of a node  */
  private percolateUp(index: number): void {
    if (index === 0) return;
    let parentIndex = Math.floor((index - 1) / 2);
    let childValue =
      this.nodes[index].getDistance() + this.nodes[index].getHeuristic();
    let parentValue =
      this.nodes[parentIndex].getDistance() +
      this.nodes[parentIndex].getHeuristic();
    if (childValue < parentValue) {
      this.swap(index, parentIndex);
      this.percolateUp(parentIndex);
    }
  }

  /**Recursively swaps node with the lesser of its child
   * until min heap structure is satisfied.
   * takes into account the heuristics metrics of a node  */
  private percolateDown(index: number): void {
    let lesserChildIndex: number; //holds the child node that has the smallest distance
    let leftIndex = 2 * index + 1;
    let rightIndex = 2 * index + 2;

    const rightValue = this.nodes[rightIndex]
      ? this.nodes[rightIndex].getDistance() +
        this.nodes[rightIndex].getHeuristic()
      : 0;
    const leftValue = this.nodes[leftIndex]
      ? this.nodes[leftIndex].getDistance() +
        this.nodes[leftIndex].getHeuristic()
      : 0;

    // find out the child with smallest distance
    if (rightIndex < this.size && rightValue < leftValue) {
      lesserChildIndex = rightIndex;
    } else if (leftIndex < this.size) {
      lesserChildIndex = leftIndex;
    } else return;

    // percolate down with lesser child
    if (
      this.nodes[index].getDistance() + this.nodes[index].getHeuristic() >
      this.nodes[lesserChildIndex].getDistance() +
        this.nodes[lesserChildIndex].getHeuristic()
    ) {
      this.swap(index, lesserChildIndex);
      this.percolateDown(lesserChildIndex);
    }
  }

  // swaps index positions of two nodes
  private swap(i: number, j: number): void {
    let temp = this.nodes[i];
    this.nodes[i] = this.nodes[j];
    this.nodes[j] = temp;

    // keep track of nodes for updateKey()
    this.map.set(this.nodes[i], j);
    this.map.set(this.nodes[j], i);
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  // for testing purposes
  getNodes(): number[] {
    return this.nodes.map((node) => {
      return node.getDistance();
    });
  }
}
