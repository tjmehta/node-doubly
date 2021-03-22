import Node, {
  nodeTraverseNextNodes,
  nodeTraverseNextValues,
  nodeTraversePrevValues,
} from './Node'

import BaseError from 'baseerr'

class DualyError extends BaseError<{}> {}

export default class Dualy<T> {
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
    DualyError.assert(index >= 0, '"at" negative index not supported', {
      index,
    })

    return this.node(index)?.value
  }

  node(index: number) {
    DualyError.assert(index >= 0, '"node" negative index not supported', {
      index,
    })

    let i = 0

    for (let node of this.nodes()) {
      if (i === index) return node
      i++
    }
  }

  concat(list: Iterable<T>) {
    const result = new Dualy<T>()

    for (let value of this) {
      result.push(value)
    }
    for (let value of list) {
      result.push(value)
    }

    return result
  }

  delete(index: number): boolean {
    DualyError.assert(index >= 0, '"delete" negative index not supported', {
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

  every(cb: (value: T, i: number, list: Dualy<T>) => unknown): boolean {
    let i = 0

    for (let value of this) {
      if (!cb(value, i, this)) return false
      i++
    }

    return true
  }

  forEach(cb: (value: T, i: number, list: Dualy<T>) => void) {
    let i = 0

    for (let value of this) {
      cb(value, i, this)
      i++
    }
  }

  forEachRight(cb: (value: T, i: number, list: Dualy<T>) => void) {
    let i = 0

    for (let value of nodeTraversePrevValues(this.tail)) {
      cb(value, i, this)
      i++
    }
  }

  filter(cb: (value: T, i: number, list: Dualy<T>) => unknown): Dualy<T> {
    const result = new Dualy<T>()
    let i = 0

    for (let value of this) {
      const keep = cb(value, i, this)
      if (keep) result.push(value)
      i++
    }

    return result
  }

  find(cb: (value: T, i: number, list: Dualy<T>) => unknown): T | void {
    let i = 0

    for (let value of this) {
      const found = cb(value, i, this)
      if (found) return value
      i++
    }
  }

  findIndex(cb: (value: T, i: number, list: Dualy<T>) => unknown): number {
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

  map<R>(cb: (value: T, i: number, list: Dualy<T>) => R): Dualy<R> {
    const mapped = new Dualy<R>()
    let i = 0

    for (let value of this) {
      mapped.push(cb(value, i, this))
      i++
    }

    return mapped
  }

  pop() {
    const prevTail = this.tail

    if (prevTail == null) return

    const nextTail = this.tail?.prev ?? null

    this.tail = nextTail
    if (this.tail == null) this.head = nextTail

    prevTail.remove()
    return prevTail
  }

  push(val: T) {
    const node = new Node(val)

    this.pushNode(node)
  }

  pushNode(node: Node<T>) {
    if (this.tail == null) {
      // this.head == null
      this.head = node
      this.tail = node
      return
    }

    this.tail.next = node
    node.prev = this.tail
    node.next = null
    this.tail = node
  }

  reduce<M>(cb: (memo: M | T, value: T, i: number, list: Dualy<T>) => M): M
  reduce<M>(
    cb: (memo: M, value: T, i: number, list: Dualy<T>) => M,
    initialValue: M,
  ): M
  reduce<M>(
    cb: (memo: M | T, value: T, i: number, list: Dualy<T>) => M,
    initialValue?: M,
  ): M {
    let node = this.head
    let i = 0
    let memo

    if (arguments.length === 1) {
      DualyError.assert(
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
    const prevHead = this.head

    if (prevHead == null) return

    const nextHead = this.head?.next ?? null

    this.head = nextHead
    if (this.head == null) this.tail = nextHead

    prevHead.remove()

    return prevHead
  }

  unshift(val: T) {
    const node = new Node(val)

    this.unshiftNode(node)
  }

  unshiftNode(node: Node<T>) {
    if (this.head == null) {
      // this.head == null
      this.head = node
      this.tail = node
      return
    }

    this.head.prev = node
    node.next = this.head
    this.head = node
  }

  some(cb: (value: T, i: number, list: Dualy<T>) => unknown): boolean {
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
    if (node === this.tail) this.pop()
    node.remove()
  }

  splice(index: number, removeCount: number, ...items: Array<T>): Dualy<T> {
    const removed = new Dualy<T>()
    const start = this.node(index)
    const prev = start?.prev ?? null

    if (start == null) {
      items.forEach((item) => this.push(item))
      return removed
    }

    // remove items
    let count = 0
    let restStart = prev?.next ?? null
    for (let next of nodeTraverseNextNodes(start)) {
      if (count >= removeCount) break
      count++
      restStart = next?.next
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
      const inserted = new Dualy<T>()
      items.forEach((item) => inserted.push(item))
      if (prev) {
        prev.next = inserted.head
      }
      if (inserted.tail) {
        inserted.tail.next = restStart
        if (restStart) {
          restStart.prev = inserted.tail
        }
      }
    }

    return removed
  }
}
