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

  min(): Node {
    return this.nodes[0];
  }

  add(node: Node): void {
    // this.values[this.size] = node;
    this.nodes.push(node);
    this.percolateUp(this.size);
    this.size++;
  }

  poll(): number {
    if (this.size === 0) return 0;
    let min: number = this.nodes[0].getDistance();
    this.nodes[0] = this.nodes[this.size - 1];
    this.nodes.pop();
    this.size--;
    this.percolateDown(0);
    return min;
  }

  private percolateUp(index: number): void {
    if (index === 0) return;
    let parentIndex = Math.floor((index - 1) / 2);
    if (
      this.nodes[index].getDistance() < this.nodes[parentIndex].getDistance()
    ) {
      this.swap(index, parentIndex);
      this.percolateUp(parentIndex);
    }
  }

  private percolateDown(index: number): void {
    let lesserChildIndex: number; //holds the child node that has the smallest distance
    let leftIndex = 2 * index + 1;
    let rightIndex = 2 * index + 2;

    // find out the child with smallest distance
    if (
      rightIndex < this.size &&
      this.nodes[rightIndex].getDistance() < this.nodes[leftIndex].getDistance()
    ) {
      lesserChildIndex = rightIndex;
    } else if (leftIndex < this.size) {
      lesserChildIndex = leftIndex;
    } else return;

    // percolate down with lesser child
    if (
      this.nodes[index].getDistance() >
      this.nodes[lesserChildIndex].getDistance()
    ) {
      this.swap(index, lesserChildIndex);
      this.percolateDown(lesserChildIndex);
    }
  }

  private swap(i: number, j: number): void {
    let temp = this.nodes[i];
    this.nodes[i] = this.nodes[j];
    this.nodes[j] = temp;
  }

  // for testing purposes
  getNodes(): number[] {
    return this.nodes.map((node) => {
      return node.getDistance();
    });
  }
}
