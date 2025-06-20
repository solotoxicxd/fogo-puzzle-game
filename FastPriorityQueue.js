"use strict";

// Default comparator
const defaultComparator = (a, b) => a < b;

function FastPriorityQueue(comparator) {
  if (!(this instanceof FastPriorityQueue)) return new FastPriorityQueue(comparator);
  this.array = [];
  this.size = 0;
  this.compare = comparator || defaultComparator;
}

// Clone the queue
FastPriorityQueue.prototype.clone = function () {
  const fpq = new FastPriorityQueue(this.compare);
  fpq.size = this.size;
  fpq.array = this.array.slice(0, this.size);
  return fpq;
};

// Add an item
FastPriorityQueue.prototype.add = function (val) {
  let i = this.size++;
  let p, ap;

  while (i > 0) {
    p = (i - 1) >> 1;
    ap = this.array[p];
    if (!this.compare(val, ap)) break;
    this.array[i] = ap;
    i = p;
  }

  this.array[i] = val;
};

// Replace content with new array and heapify
FastPriorityQueue.prototype.heapify = function (arr) {
  this.array = arr;
  this.size = arr.length;
  for (let i = this.size >> 1; i >= 0; i--) {
    this._percolateDown(i);
  }
};

// Internal — percolate up
FastPriorityQueue.prototype._percolateUp = function (i, force) {
  const val = this.array[i];
  let p, ap;

  while (i > 0) {
    p = (i - 1) >> 1;
    ap = this.array[p];
    if (!force && !this.compare(val, ap)) break;
    this.array[i] = ap;
    i = p;
  }

  this.array[i] = val;
};

// Internal — percolate down
FastPriorityQueue.prototype._percolateDown = function (i) {
  const size = this.size;
  const half = size >>> 1;
  const ai = this.array[i];
  let l, r, best;

  while (i < half) {
    l = (i << 1) + 1;
    r = l + 1;
    best = this.array[l];

    if (r < size && this.compare(this.array[r], best)) {
      l = r;
      best = this.array[r];
    }

    if (!this.compare(best, ai)) break;

    this.array[i] = best;
    i = l;
  }

  this.array[i] = ai;
};

// Internal — remove by index
FastPriorityQueue.prototype._removeAt = function (index) {
  if (index < 0 || index >= this.size) return undefined;
  this._percolateUp(index, true);
  return this.poll();
};

// Remove specific value
FastPriorityQueue.prototype.remove = function (val) {
  for (let i = 0; i < this.size; i++) {
    if (!this.compare(this.array[i], val) && !this.compare(val, this.array[i])) {
      this._removeAt(i);
      return true;
    }
  }
  return false;
};

// Remove first matching value via callback
FastPriorityQueue.prototype.removeOne = function (callback) {
  if (typeof callback !== "function") return;
  for (let i = 0; i < this.size; i++) {
    if (callback(this.array[i])) return this._removeAt(i);
  }
};

// Remove many via callback
FastPriorityQueue.prototype.removeMany = function (callback, limit) {
  if (typeof callback !== "function" || this.size < 1) return [];

  const max = limit ? Math.min(limit, this.size) : this.size;
  const result = new Array(max);
  let resultSize = 0;
  const temp = [];

  while (resultSize < max && !this.isEmpty()) {
    const item = this.poll();
    if (callback(item)) {
      result[resultSize++] = item;
    } else {
      temp.push(item);
    }
  }

  result.length = resultSize;
  for (let i = 0; i < temp.length; i++) {
    this.add(temp[i]);
  }

  return result;
};

// Peek top
FastPriorityQueue.prototype.peek = function () {
  return this.size === 0 ? undefined : this.array[0];
};

// Poll (remove top)
FastPriorityQueue.prototype.poll = function () {
  if (this.size === 0) return undefined;

  const top = this.array[0];
  if (this.size > 1) {
    this.array[0] = this.array[--this.size];
    this._percolateDown(0);
  } else {
    this.size--;
  }

  return top;
};

// Replace top and return old
FastPriorityQueue.prototype.replaceTop = function (val) {
  if (this.size === 0) return undefined;
  const top = this.array[0];
  this.array[0] = val;
  this._percolateDown(0);
  return top;
};

// Trim memory
FastPriorityQueue.prototype.trim = function () {
  this.array = this.array.slice(0, this.size);
};

// Check if empty
FastPriorityQueue.prototype.isEmpty = function () {
  return this.size === 0;
};

// ForEach
FastPriorityQueue.prototype.forEach = function (callback) {
  if (this.isEmpty() || typeof callback !== "function") return;
  const clone = this.clone();
  let i = 0;
  while (!clone.isEmpty()) {
    callback(clone.poll(), i++);
  }
};

// Get k smallest
FastPriorityQueue.prototype.kSmallest = function (k) {
  if (this.size === 0 || k <= 0) return [];
  k = Math.min(this.size, k);

  const limit = Math.min(this.size, 2 ** (k - 1) + 1);
  if (limit < 2) return [this.peek()];

  const fpq = new FastPriorityQueue(this.compare);
  fpq.size = limit;
  fpq.array = this.array.slice(0, limit);

  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(fpq.poll());
  }

  return result;
};
