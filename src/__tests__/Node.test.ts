import { nodeTraverseNextNodes, nodeTraversePrevNodes } from '../Node'

import LinkedList from '..'
import Node from '../Node'

describe('Node', () => {
  describe('linkPrev', () => {
    it('should link null', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      const node = list.tail
      expect(node.prev).toBe(list.head)
      node.linkPrev(null)
      expect(node.prev).toBeNull()
    })
  })
  describe('linkNext', () => {
    it('should link null', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      const node = list.head
      expect(node.next).toBe(list.tail)
      node.linkNext(null)
      expect(node.next).toBeNull()
    })
  })
  describe('nodeTraverseNextNodes', () => {
    it('should not traverse nothing', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)

      const nil = null
      const nodes = []

      for (let node of nodeTraverseNextNodes(nil)) {
        nodes.push(node)
      }

      expect(nodes).toMatchInlineSnapshot(`Array []`)
    })

    it('should traverse nodes', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)

      const head = list.head
      const nodes = []

      for (let node of nodeTraverseNextNodes(head)) {
        nodes.push(node)
      }

      expect(nodes).toMatchInlineSnapshot(`
        Array [
          Node {
            "next": Node {
              "next": Node {
                "next": Node {
                  "next": null,
                  "prev": [Circular],
                  "value": 4,
                },
                "prev": [Circular],
                "value": 3,
              },
              "prev": [Circular],
              "value": 2,
            },
            "prev": null,
            "value": 1,
          },
          Node {
            "next": Node {
              "next": Node {
                "next": null,
                "prev": [Circular],
                "value": 4,
              },
              "prev": [Circular],
              "value": 3,
            },
            "prev": Node {
              "next": [Circular],
              "prev": null,
              "value": 1,
            },
            "value": 2,
          },
          Node {
            "next": Node {
              "next": null,
              "prev": [Circular],
              "value": 4,
            },
            "prev": Node {
              "next": [Circular],
              "prev": Node {
                "next": [Circular],
                "prev": null,
                "value": 1,
              },
              "value": 2,
            },
            "value": 3,
          },
          Node {
            "next": null,
            "prev": Node {
              "next": [Circular],
              "prev": Node {
                "next": [Circular],
                "prev": Node {
                  "next": [Circular],
                  "prev": null,
                  "value": 1,
                },
                "value": 2,
              },
              "value": 3,
            },
            "value": 4,
          },
        ]
      `)
    })
  })

  describe('nodeTraversePrevNodes', () => {
    it('should not traverse nothing', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)

      const nil = null
      const nodes = []

      for (let node of nodeTraversePrevNodes(nil)) {
        nodes.push(node)
      }

      expect(nodes).toMatchInlineSnapshot(`Array []`)
    })

    it('should traverse nodes', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)

      const tail = list.tail
      const nodes = []

      for (let node of nodeTraversePrevNodes(tail)) {
        nodes.push(node)
      }

      expect(nodes).toMatchInlineSnapshot(`
        Array [
          Node {
            "next": null,
            "prev": Node {
              "next": [Circular],
              "prev": Node {
                "next": [Circular],
                "prev": Node {
                  "next": [Circular],
                  "prev": null,
                  "value": 1,
                },
                "value": 2,
              },
              "value": 3,
            },
            "value": 4,
          },
          Node {
            "next": Node {
              "next": null,
              "prev": [Circular],
              "value": 4,
            },
            "prev": Node {
              "next": [Circular],
              "prev": Node {
                "next": [Circular],
                "prev": null,
                "value": 1,
              },
              "value": 2,
            },
            "value": 3,
          },
          Node {
            "next": Node {
              "next": Node {
                "next": null,
                "prev": [Circular],
                "value": 4,
              },
              "prev": [Circular],
              "value": 3,
            },
            "prev": Node {
              "next": [Circular],
              "prev": null,
              "value": 1,
            },
            "value": 2,
          },
          Node {
            "next": Node {
              "next": Node {
                "next": Node {
                  "next": null,
                  "prev": [Circular],
                  "value": 4,
                },
                "prev": [Circular],
                "value": 3,
              },
              "prev": [Circular],
              "value": 2,
            },
            "prev": null,
            "value": 1,
          },
        ]
      `)
    })
  })
})
