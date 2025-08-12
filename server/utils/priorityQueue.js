class PriorityQueue {
  constructor(compare) {
    this.heap = [];
    this.compare = compare || ((a,b) => a - b);
  }
  enqueue(item) {
    this.heap.push(item);
    this._siftUp(this.heap.length-1);
  }
  dequeue() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  _siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1)/2);
      if (this.compare(this.heap[idx], this.heap[parent]) < 0) {
        [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
        idx = parent;
      } else break;
    }
  }
  _siftDown(idx) {
    while (true) {
      let left = idx*2+1, right = idx*2+2, smallest = idx;
      if (left < this.heap.length && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest !== idx) {
        [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
        idx = smallest;
      } else break;
    }
  }
  size() { return this.heap.length; }
}

module.exports = PriorityQueue;
