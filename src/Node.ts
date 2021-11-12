export default class Node<T> {
  prev: Node<T> | null
  next: Node<T> | null
  value: T

  constructor(value: T, opts?: { prev?: Node<T>; next?: Node<T> }) {
    this.value = value
    this.prev = opts?.prev || null
    this.next = opts?.next || null
  }

  linkNext<N extends Node<T> | null>(next: N): N {
    this.next = next
    if (next) next.prev = this
    return next
  }

  linkPrev<N extends Node<T> | null>(prev: N): N {
    this.prev = prev
    if (prev) prev.next = this
    return prev
  }

  unlink() {
    if (this.prev) this.prev.next = this.next
    if (this.next) this.next.prev = this.prev
    this.prev = null
    this.next = null
  }
}

export function* nodeTraverseNextNodes<T>(node: Node<T> | null) {
  let cursor: Node<T> | null = node ?? null

  while (cursor) {
    const next = cursor.next
    yield cursor
    cursor = next
  }
}
export function* nodeTraversePrevNodes<T>(node: Node<T> | null) {
  let cursor: Node<T> | null = node ?? null

  while (cursor) {
    const prev = cursor.prev
    yield cursor
    cursor = prev
  }
}
export function* nodeTraverseNextValues<T>(node: Node<T> | null) {
  for (let n of nodeTraverseNextNodes(node)) {
    yield n.value
  }
}
export function* nodeTraversePrevValues<T>(node: Node<T> | null) {
  for (let n of nodeTraversePrevNodes(node)) {
    yield n.value
  }
}
