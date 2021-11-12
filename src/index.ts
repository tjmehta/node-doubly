import Node, {
  nodeTraverseNextNodes,
  nodeTraverseNextValues,
  nodeTraversePrevValues,
} from './Node'

import BaseError from 'baseerr'

class DoublyError extends BaseError<{}> {}

export default class Doubly<T> {
  head: Node<T> | null = null
  tail: Node<T> | null = null
  size: number = 0

  constructor(opts?: { head?: Node<T> }) {
    if (opts?.head == null) return
    this.head = opts.head

    let cursor: Node<T> | null = opts.head
    let tail: Node<T> | null = null

    while (cursor) {
      tail = cursor
      cursor = cursor.next
    }

    this.tail = tail
  }

  [Symbol.iterator](): Iterator<T> {
    return nodeTraverseNextValues<T>(this.head)
  }

  nodes(): IterableIterator<Node<T>> {
    return nodeTraverseNextNodes<T>(this.head)
  }

  at(index: number) {
    DoublyError.assert(index >= 0, '"at" negative index not supported', {
      index,
    })

    return this.node(index)?.value
  }

  node(index: number) {
    DoublyError.assert(index >= 0, '"node" negative index not supported', {
      index,
    })

    let i = 0

    for (let node of this.nodes()) {
      if (i === index) return node
      i++
    }
  }

  concat(list: Iterable<T>) {
    const result = new Doubly<T>()

    for (let value of this) {
      result.push(value)
    }
    for (let value of list) {
      result.push(value)
    }

    return result
  }

  delete(index: number): boolean {
    DoublyError.assert(index >= 0, '"delete" negative index not supported', {
      index,
    })

    const node = this.node(index - 1)

    if (node == null) return false

    if (this.head === node) {
      this.shift()
      return true
    }
    if (this.tail === node) {
      this.pop()
      return true
    }

    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev

    return true
  }

  every(cb: (value: T, i: number, list: Doubly<T>) => unknown): boolean {
    let i = 0

    for (let value of this) {
      if (!cb(value, i, this)) return false
      i++
    }

    return true
  }

  forEach(cb: (value: T, i: number, list: Doubly<T>) => void) {
    let i = 0

    for (let value of this) {
      cb(value, i, this)
      i++
    }
  }

  forEachRight(cb: (value: T, i: number, list: Doubly<T>) => void) {
    let i = 0

    for (let value of nodeTraversePrevValues(this.tail)) {
      cb(value, i, this)
      i++
    }
  }

  filter(cb: (value: T, i: number, list: Doubly<T>) => unknown): Doubly<T> {
    const result = new Doubly<T>()
    let i = 0

    for (let value of this) {
      const keep = cb(value, i, this)
      if (keep) result.push(value)
      i++
    }

    return result
  }

  find(cb: (value: T, i: number, list: Doubly<T>) => unknown): T | void {
    let i = 0

    for (let value of this) {
      const found = cb(value, i, this)
      if (found) return value
      i++
    }
  }

  findIndex(cb: (value: T, i: number, list: Doubly<T>) => unknown): number {
    let i = 0

    for (let value of this) {
      const found = cb(value, i, this)
      if (found) return i
      i++
    }

    return -1
  }

  includes(compare: T): boolean {
    if (this.head != null && compare === this.head.value) return true
    if (this.tail != null && compare === this.tail.value) return true
    return this.some((value, i, list) => compare === value)
  }

  indexOf(compare: T): number {
    return this.findIndex((value, i, list) => compare === value)
  }

  map<R>(cb: (value: T, i: number, list: Doubly<T>) => R): Doubly<R> {
    const mapped = new Doubly<R>()
    let i = 0

    for (let value of this) {
      mapped.push(cb(value, i, this))
      i++
    }

    return mapped
  }

  pop() {
    const node = this.popNode()
    return node?.value
  }

  popNode() {
    const prevTail = this.tail

    if (prevTail == null) return

    this.size--

    const nextTail = this.tail?.prev ?? null

    this.tail = nextTail
    if (this.tail == null) this.head = nextTail

    prevTail.unlink()
    return prevTail
  }

  push(val: T) {
    const node = new Node(val)

    this.pushNode(node)
  }

  pushNode(node: Node<T>) {
    this.size++

    if (this.tail == null) {
      // this.head == null
      this.head = node
      this.tail = node
      return
    }

    this.tail = this.tail.linkNext(node)
    this.tail.next = null
  }

  reduce<M>(cb: (memo: M | T, value: T, i: number, list: Doubly<T>) => M): M
  reduce<M>(
    cb: (memo: M, value: T, i: number, list: Doubly<T>) => M,
    initialValue: M,
  ): M
  reduce<M>(
    cb: (memo: M | T, value: T, i: number, list: Doubly<T>) => M,
    initialValue?: M,
  ): M {
    let node = this.head
    let i = 0
    let memo

    if (arguments.length === 1) {
      DoublyError.assert(
        node != null,
        'cannot "reduce" empty list with no initial value',
      )
      memo = node.value
      node = node.next
      i = 1
    } else {
      memo = initialValue as M
    }

    while (node) {
      memo = cb(memo, node.value, i, this)
      node = node.next
      i++
    }

    return memo as M
  }

  shift() {
    const node = this.shiftNode()
    return node?.value
  }

  shiftNode() {
    const prevHead = this.head

    if (prevHead == null) return

    this.size--

    const nextHead = this.head?.next ?? null

    this.head = nextHead
    if (this.head == null) this.tail = nextHead

    prevHead.unlink()

    return prevHead
  }

  unshift(val: T) {
    const node = new Node(val)

    this.unshiftNode(node)
  }

  unshiftNode(node: Node<T>) {
    this.size++

    if (this.head == null) {
      // this.head == null
      this.head = node
      this.tail = node
      return
    }

    node.linkNext(this.head)
    this.head = node
    this.head.prev = null
  }

  some(cb: (value: T, i: number, list: Doubly<T>) => unknown): boolean {
    let node = this.head
    let i = 0

    while (node) {
      const result = cb(node.value, i, this)
      if (Boolean(result)) return true
      node = node.next
      i++
    }

    return false
  }

  remove(node: Node<T>) {
    if (node === this.head) this.shift()
    else if (node === this.tail) this.pop()
    else this.size--

    node.unlink()
  }

  splice(index: number, removeCount: number, ...items: Array<T>): Doubly<T> {
    const removed = new Doubly<T>()
    const start = this.node(index)
    const prev = start?.prev ?? null

    if (start == null) {
      items.forEach((item) => this.push(item))
      return removed
    }

    // remove items
    let count = 0
    let restHead = prev?.next ?? null
    for (let next of nodeTraverseNextNodes(start)) {
      if (count >= removeCount) break
      count++
      restHead = next?.next
      this.remove(next)
      removed.pushNode(next)
    }

    // insert items
    if (index === 0) {
      // insert items at the head
      items.reverse().forEach((item) => this.unshift(item))
    } else if (start === this.tail) {
      // insert items at the tail
      items.forEach((item) => this.push(item))
    } else {
      // insert items in the middle
      // this.head ... prev ... inserted ... this.tail
      const inserted = new Doubly<T>()
      items.forEach((item) => inserted.push(item))
      if (inserted.head) inserted.head.linkPrev(prev)
      if (inserted.tail) inserted.tail.linkNext(restHead)

      this.size += inserted.size
    }

    return removed
  }
}
