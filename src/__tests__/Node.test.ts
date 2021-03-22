import LinkedList from '..'
import { nodeTraverseNextNodes } from '../Node'

describe('Node', () => {
  describe('nodeTraverseNextNodes', () => {
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
})
