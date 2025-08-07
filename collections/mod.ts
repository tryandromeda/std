/**
 * @fileoverview Advanced data structures and collection utilities
 * @module collections
 */

/**
 * A generic queue implementation with FIFO semantics.
 *
 * @example
 * ```ts
 * const queue = new Queue<string>();
 * queue.enqueue('first');
 * queue.enqueue('second');
 * console.log(queue.dequeue()); // 'first'
 * console.log(queue.size); // 1
 * ```
 */
export class Queue<T> {
  #items: T[] = [];

  /**
   * Adds an item to the back of the queue.
   */
  enqueue(item: T): void {
    this.#items.push(item);
  }

  /**
   * Removes and returns the item from the front of the queue.
   */
  dequeue(): T | undefined {
    return this.#items.shift();
  }

  /**
   * Returns the item at the front of the queue without removing it.
   */
  peek(): T | undefined {
    return this.#items[0];
  }

  /**
   * Returns the number of items in the queue.
   */
  get size(): number {
    return this.#items.length;
  }

  /**
   * Returns true if the queue is empty.
   */
  get isEmpty(): boolean {
    return this.#items.length === 0;
  }

  /**
   * Removes all items from the queue.
   */
  clear(): void {
    this.#items = [];
  }

  /**
   * Returns an array containing all items in the queue.
   */
  toArray(): T[] {
    return [...this.#items];
  }

  /**
   * Makes the queue iterable.
   */
  *[Symbol.iterator](): Iterator<T> {
    for (const item of this.#items) {
      yield item;
    }
  }
}

/**
 * A generic stack implementation with LIFO semantics.
 *
 * @example
 * ```ts
 * const stack = new Stack<number>();
 * stack.push(1);
 * stack.push(2);
 * console.log(stack.pop()); // 2
 * console.log(stack.size); // 1
 * ```
 */
export class Stack<T> {
  #items: T[] = [];

  /**
   * Adds an item to the top of the stack.
   */
  push(item: T): void {
    this.#items.push(item);
  }

  /**
   * Removes and returns the item from the top of the stack.
   */
  pop(): T | undefined {
    return this.#items.pop();
  }

  /**
   * Returns the item at the top of the stack without removing it.
   */
  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  /**
   * Returns the number of items in the stack.
   */
  get size(): number {
    return this.#items.length;
  }

  /**
   * Returns true if the stack is empty.
   */
  get isEmpty(): boolean {
    return this.#items.length === 0;
  }

  /**
   * Removes all items from the stack.
   */
  clear(): void {
    this.#items = [];
  }

  /**
   * Returns an array containing all items in the stack.
   */
  toArray(): T[] {
    return [...this.#items];
  }

  /**
   * Makes the stack iterable.
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.#items.length - 1; i >= 0; i--) {
      yield this.#items[i]!;
    }
  }
}

/**
 * Node for linked list implementation.
 */
class ListNode<T> {
  value: T;
  next: ListNode<T> | null;

  constructor(
    value: T,
    next: ListNode<T> | null = null,
  ) {
    this.value = value;
    this.next = next;
  }
}

/**
 * A generic linked list implementation.
 *
 * @example
 * ```ts
 * const list = new LinkedList<string>();
 * list.append('first');
 * list.append('second');
 * list.prepend('zero');
 * console.log(list.toArray()); // ['zero', 'first', 'second']
 * ```
 */
export class LinkedList<T> {
  #head: ListNode<T> | null = null;
  #tail: ListNode<T> | null = null;
  #length = 0;

  /**
   * Adds an item to the end of the list.
   */
  append(value: T): void {
    const node = new ListNode(value);

    if (!this.#head) {
      this.#head = node;
      this.#tail = node;
    } else {
      this.#tail!.next = node;
      this.#tail = node;
    }

    this.#length++;
  }

  /**
   * Adds an item to the beginning of the list.
   */
  prepend(value: T): void {
    const node = new ListNode(value, this.#head);
    this.#head = node;

    if (!this.#tail) {
      this.#tail = node;
    }

    this.#length++;
  }

  /**
   * Inserts an item at the specified index.
   */
  insertAt(index: number, value: T): void {
    if (index < 0 || index > this.#length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      this.prepend(value);
      return;
    }

    if (index === this.#length) {
      this.append(value);
      return;
    }

    const node = new ListNode(value);
    let current = this.#head!;

    for (let i = 0; i < index - 1; i++) {
      current = current.next!;
    }

    node.next = current.next;
    current.next = node;
    this.#length++;
  }

  /**
   * Removes the first occurrence of the specified value.
   */
  remove(value: T): boolean {
    if (!this.#head) return false;

    if (this.#head.value === value) {
      this.#head = this.#head.next;
      if (!this.#head) this.#tail = null;
      this.#length--;
      return true;
    }

    let current = this.#head;
    while (current.next) {
      if (current.next.value === value) {
        if (current.next === this.#tail) {
          this.#tail = current;
        }
        current.next = current.next.next;
        this.#length--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Removes the item at the specified index.
   */
  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.#length) return undefined;

    if (index === 0) {
      const value = this.#head!.value;
      this.#head = this.#head!.next;
      if (!this.#head) this.#tail = null;
      this.#length--;
      return value;
    }

    let current = this.#head!;
    for (let i = 0; i < index - 1; i++) {
      current = current.next!;
    }

    const value = current.next!.value;
    if (current.next === this.#tail) {
      this.#tail = current;
    }
    current.next = current.next!.next;
    this.#length--;

    return value;
  }

  /**
   * Returns the item at the specified index.
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.#length) return undefined;

    let current = this.#head!;
    for (let i = 0; i < index; i++) {
      current = current.next!;
    }

    return current.value;
  }

  /**
   * Returns the index of the first occurrence of the specified value.
   */
  indexOf(value: T): number {
    let current = this.#head;
    let index = 0;

    while (current) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * Returns true if the list contains the specified value.
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Returns the number of items in the list.
   */
  get size(): number {
    return this.#length;
  }

  /**
   * Returns true if the list is empty.
   */
  get isEmpty(): boolean {
    return this.#length === 0;
  }

  /**
   * Removes all items from the list.
   */
  clear(): void {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }

  /**
   * Returns an array containing all items in the list.
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.#head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * Makes the list iterable.
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

/**
 * Node for binary tree implementation.
 */
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;
  constructor(
    value: T,
    left: TreeNode<T> | null = null,
    right: TreeNode<T> | null = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * A generic binary search tree implementation.
 *
 * @example
 * ```ts
 * const tree = new BinaryTree<number>();
 * tree.insert(5);
 * tree.insert(3);
 * tree.insert(7);
 * console.log(tree.contains(3)); // true
 * console.log(tree.inOrder()); // [3, 5, 7]
 * ```
 */
export class BinaryTree<T> {
  #root: TreeNode<T> | null = null;
  #compareFunction: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.#compareFunction = compareFn || ((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /**
   * Inserts a value into the tree.
   */
  insert(value: T): void {
    this.#root = this.#insertNode(this.#root, value);
  }

  #insertNode(node: TreeNode<T> | null, value: T): TreeNode<T> {
    if (!node) {
      return new TreeNode(value);
    }

    const comparison = this.#compareFunction(value, node.value);

    if (comparison < 0) {
      node.left = this.#insertNode(node.left, value);
    } else if (comparison > 0) {
      node.right = this.#insertNode(node.right, value);
    }

    return node;
  }

  /**
   * Removes a value from the tree.
   */
  remove(value: T): boolean {
    const originalSize = this.size;
    this.#root = this.#removeNode(this.#root, value);
    return this.size < originalSize;
  }

  #removeNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;

    const comparison = this.#compareFunction(value, node.value);

    if (comparison < 0) {
      node.left = this.#removeNode(node.left, value);
    } else if (comparison > 0) {
      node.right = this.#removeNode(node.right, value);
    } else {
      // Node to be removed found
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Node has two children
      const minRight = this.#findMin(node.right);
      node.value = minRight.value;
      node.right = this.#removeNode(node.right, minRight.value);
    }

    return node;
  }

  #findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  /**
   * Returns true if the tree contains the specified value.
   */
  contains(value: T): boolean {
    return this.#search(this.#root, value) !== null;
  }

  #search(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;

    const comparison = this.#compareFunction(value, node.value);

    if (comparison === 0) return node;
    if (comparison < 0) return this.#search(node.left, value);
    return this.#search(node.right, value);
  }

  /**
   * Returns the number of nodes in the tree.
   */
  get size(): number {
    return this.#getSize(this.#root);
  }

  #getSize(node: TreeNode<T> | null): number {
    if (!node) return 0;
    return 1 + this.#getSize(node.left) + this.#getSize(node.right);
  }

  /**
   * Returns true if the tree is empty.
   */
  get isEmpty(): boolean {
    return this.#root === null;
  }

  /**
   * Removes all nodes from the tree.
   */
  clear(): void {
    this.#root = null;
  }

  /**
   * Returns an array of values in in-order traversal.
   */
  inOrder(): T[] {
    const result: T[] = [];
    this.#inOrderTraversal(this.#root, result);
    return result;
  }

  #inOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.#inOrderTraversal(node.left, result);
      result.push(node.value);
      this.#inOrderTraversal(node.right, result);
    }
  }

  /**
   * Returns an array of values in pre-order traversal.
   */
  preOrder(): T[] {
    const result: T[] = [];
    this.#preOrderTraversal(this.#root, result);
    return result;
  }

  #preOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.value);
      this.#preOrderTraversal(node.left, result);
      this.#preOrderTraversal(node.right, result);
    }
  }

  /**
   * Returns an array of values in post-order traversal.
   */
  postOrder(): T[] {
    const result: T[] = [];
    this.#postOrderTraversal(this.#root, result);
    return result;
  }

  #postOrderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.#postOrderTraversal(node.left, result);
      this.#postOrderTraversal(node.right, result);
      result.push(node.value);
    }
  }
}

/**
 * A generic min-heap implementation.
 *
 * @example
 * ```ts
 * const heap = new Heap<number>();
 * heap.insert(5);
 * heap.insert(3);
 * heap.insert(7);
 * console.log(heap.extractMin()); // 3
 * console.log(heap.peek()); // 5
 * ```
 */
export class Heap<T> {
  #items: T[] = [];
  #compareFunction: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.#compareFunction = compareFn || ((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /**
   * Inserts a value into the heap.
   */
  insert(value: T): void {
    this.#items.push(value);
    this.#heapifyUp(this.#items.length - 1);
  }

  /**
   * Removes and returns the minimum (or maximum) value from the heap.
   */
  extractMin(): T | undefined {
    if (this.#items.length === 0) return undefined;
    if (this.#items.length === 1) return this.#items.pop();

    const min = this.#items[0];
    this.#items[0] = this.#items.pop()!;
    this.#heapifyDown(0);

    return min;
  }

  /**
   * Returns the minimum (or maximum) value without removing it.
   */
  peek(): T | undefined {
    return this.#items[0];
  }

  /**
   * Returns the number of items in the heap.
   */
  get size(): number {
    return this.#items.length;
  }

  /**
   * Returns true if the heap is empty.
   */
  get isEmpty(): boolean {
    return this.#items.length === 0;
  }

  /**
   * Removes all items from the heap.
   */
  clear(): void {
    this.#items = [];
  }

  /**
   * Returns an array containing all items in the heap.
   */
  toArray(): T[] {
    return [...this.#items];
  }

  #heapifyUp(index: number): void {
    if (index === 0) return;

    const parentIndex = Math.floor((index - 1) / 2);

    if (
      this.#compareFunction(this.#items[index]!, this.#items[parentIndex]!) <
        0
    ) {
      [this.#items[index], this.#items[parentIndex]] = [
        this.#items[parentIndex]!,
        this.#items[index]!,
      ];
      this.#heapifyUp(parentIndex);
    }
  }

  #heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (
      leftChild < this.#items.length &&
      this.#compareFunction(
          this.#items[leftChild]!,
          this.#items[smallest]!,
        ) < 0
    ) {
      smallest = leftChild;
    }

    if (
      rightChild < this.#items.length &&
      this.#compareFunction(
          this.#items[rightChild]!,
          this.#items[smallest]!,
        ) < 0
    ) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.#items[index], this.#items[smallest]] = [
        this.#items[smallest]!,
        this.#items[index]!,
      ];
      this.#heapifyDown(smallest);
    }
  }
}

/**
 * A Least Recently Used (LRU) cache implementation.
 *
 * @example
 * ```ts
 * const cache = new LRUCache<string, number>(2);
 * cache.set('a', 1);
 * cache.set('b', 2);
 * cache.set('c', 3); // 'a' is evicted
 * console.log(cache.get('a')); // undefined
 * console.log(cache.get('b')); // 2
 * ```
 */
export class LRUCache<K, V> {
  #capacity: number;
  #cache = new Map<K, V>();

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Capacity must be greater than 0");
    }
    this.#capacity = capacity;
  }

  /**
   * Gets a value from the cache.
   */
  get(key: K): V | undefined {
    if (this.#cache.has(key)) {
      const value = this.#cache.get(key)!;
      // Move to end (most recently used)
      this.#cache.delete(key);
      this.#cache.set(key, value);
      return value;
    }
    return undefined;
  }

  /**
   * Sets a value in the cache.
   */
  set(key: K, value: V): void {
    if (this.#cache.has(key)) {
      // Update existing key
      this.#cache.delete(key);
    } else if (this.#cache.size >= this.#capacity) {
      // Remove least recently used (first item)
      const firstKey = this.#cache.keys().next().value as K;
      if (firstKey !== undefined) {
        this.#cache.delete(firstKey);
      }
    }

    this.#cache.set(key, value);
  }

  /**
   * Removes a key from the cache.
   */
  delete(key: K): boolean {
    return this.#cache.delete(key);
  }

  /**
   * Returns true if the cache contains the key.
   */
  has(key: K): boolean {
    return this.#cache.has(key);
  }

  /**
   * Returns the number of items in the cache.
   */
  get size(): number {
    return this.#cache.size;
  }

  /**
   * Removes all items from the cache.
   */
  clear(): void {
    this.#cache.clear();
  }

  /**
   * Returns an array of all keys in the cache.
   */
  keys(): K[] {
    return Array.from(this.#cache.keys());
  }

  /**
   * Returns an array of all values in the cache.
   */
  values(): V[] {
    return Array.from(this.#cache.values());
  }
}
