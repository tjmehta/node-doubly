import LinkedList from '..'
import Node from '../Node'

describe('LinkedList', () => {
  describe('constructor', () => {
    it('should create a linkedlist', () => {
      const list = new LinkedList()
      expect(list).toBeInstanceOf(LinkedList)
    })

    it('should create a linkedlist w/ head', () => {
      const head = new Node(1)
      const list = new LinkedList({ head })
      expect(list).toBeInstanceOf(LinkedList)
      expect(list.head).toBe(list.tail)
      expect(list.head).toBe(head)
    })

    it('should create a linkedlist w/ head', () => {
      const sourceList = new LinkedList()
      sourceList.push(1)
      sourceList.push(2)
      sourceList.push(3)
      const head = sourceList.head
      const list = new LinkedList({ head })
      expect(list).toBeInstanceOf(LinkedList)
      expect(list.head).toBe(sourceList.head)
      expect(list.tail).toBe(sourceList.tail)
    })
  })

  describe('at', () => {
    it('should get value at index (empty list)', () => {
      const list = new LinkedList()
      expect(list.at(2)).toMatchInlineSnapshot(`undefined`)
    })

    it('should get value at index', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(list.at(2)).toMatchInlineSnapshot(`11`)
    })

    it('should get value at index (oob)', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(list.at(100)).toMatchInlineSnapshot(`undefined`)
    })
  })

  describe('concat', () => {
    it('should concat lists', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      const list2 = new LinkedList()
      list2.push(4)
      list2.push(5)
      list2.push(6)

      const list3 = list.concat(list2)

      const values = [...list3]
      expect(values).toMatchInlineSnapshot(`
        Array [
          1,
          2,
          3,
          4,
          5,
          6,
        ]
      `)
      expect(list3.size).toBe(values.length)
    })
  })

  describe('every', () => {
    it('should iterate through all items if all return truthy', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn(() => true)
      const result = list.every(cb)
      expect(result).toBe(true)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenCalledTimes(3)
    })

    it('should stop if returns falsy', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn((val, i) => {
        return i < 1
      })
      const result = list.every(cb)
      expect(result).toBe(false)
      expect(cb).toHaveBeenCalledTimes(2)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
    })
  })

  describe('forEach', () => {
    it('should iterate through all items', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn()
      list.forEach(cb)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenCalledTimes(3)
    })
  })

  describe('filter', () => {
    it('should iterate through all items and create filtered list', () => {
      const list = new LinkedList()
      list.push(10)
      list.push(20)
      list.push(30)
      list.push(40)
      const cb = jest.fn((val, i) => {
        return i % 2 === 0
      })
      const list2 = list.filter(cb)

      const values = [...list2]
      expect(values).toMatchInlineSnapshot(`
        Array [
          10,
          30,
        ]
      `)
      expect(list2.size).toBe(values.length)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenNthCalledWith(
        4,
        list.head.next.next.next.value,
        3,
        list,
      )
      expect(cb).toHaveBeenCalledTimes(4)
    })
  })

  describe('find', () => {
    it('should iterate through all items if no item found', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn()
      list.find(cb)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenCalledTimes(3)
    })

    it('should return node if item found', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn().mockReturnValueOnce(true)
      const result = list.find(cb)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(result).toBe(list.head.value)
      expect(cb).toHaveBeenCalledTimes(1)
    })
  })

  describe('findIndex', () => {
    it('should iterate through all items if no item found', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn()
      const result = list.findIndex(cb)
      expect(result).toEqual(-1)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenCalledTimes(3)
    })

    it('should return index if item found', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(
        list.findIndex((val) => val === list.head.value),
      ).toMatchInlineSnapshot(`0`)
      expect(
        list.findIndex((val) => val === list.head.next.value),
      ).toMatchInlineSnapshot(`1`)
      expect(
        list.findIndex((val) => val === list.head.next.next.value),
      ).toMatchInlineSnapshot(`2`)
      expect(
        list.findIndex((val) => val === list.tail.value),
      ).toMatchInlineSnapshot(`2`)
    })
  })

  describe('includes', () => {
    it('should return true if the list includes the value', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(list.includes(9)).toBe(true)
      expect(list.includes(10)).toBe(true)
      expect(list.includes(11)).toBe(true)
    })

    it('should return false if the list includes the value', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(list.includes(90)).toBe(false)
      expect(list.includes(3)).toBe(false)
    })
  })

  describe('indexOf', () => {
    it('should return true if the list includes the value', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      expect(list.indexOf(list.head.value)).toMatchInlineSnapshot(`0`)
      expect(list.indexOf(list.head.next.value)).toMatchInlineSnapshot(`1`)
      expect(list.indexOf(list.head.next.next.value)).toMatchInlineSnapshot(`2`)
      expect(list.indexOf(list.tail.value)).toMatchInlineSnapshot(`2`)
    })
  })

  describe('map', () => {
    it('should iterate through all items and create mapped list', () => {
      const list = new LinkedList()
      list.push(10)
      list.push(20)
      list.push(30)
      list.push(40)
      const cb = jest.fn((val, i) => {
        return val * 2
      })
      const list2 = list.map(cb)
      const values = [...list2]
      expect(values).toMatchInlineSnapshot(`
        Array [
          20,
          40,
          60,
          80,
        ]
      `)
      expect(list2.size).toBe(values.length)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenNthCalledWith(
        4,
        list.head.next.next.next.value,
        3,
        list,
      )
      expect(cb).toHaveBeenCalledTimes(4)
    })
  })

  describe('pop and push', () => {
    it('pop empty', () => {
      const list = new LinkedList()
      list.pop()
      expect(list.head).toMatchInlineSnapshot(`null`)
      expect(list.tail).toMatchInlineSnapshot(`null`)
    })

    it('push pop', () => {
      const list = new LinkedList()
      list.push(1)
      list.pop()
      expect(list.head).toMatchInlineSnapshot(`null`)
      expect(list.tail).toMatchInlineSnapshot(`null`)
    })

    it('push pop push', () => {
      const list = new LinkedList()
      list.push(1)
      list.pop()
      list.push(2)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": null,
          "value": 2,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": null,
          "value": 2,
        }
      `)
    })

    it('push pop push push', () => {
      const list = new LinkedList()
      // list.push(1)
      // list.pop()
      list.push(2)
      list.push(3)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": Node {
            "next": null,
            "prev": [Circular],
            "value": 3,
          },
          "prev": null,
          "value": 2,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": Node {
            "next": [Circular],
            "prev": null,
            "value": 2,
          },
          "value": 3,
        }
      `)
    })

    it('push push', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      const list2 = new LinkedList()
      list2.push(3)
      list2.push(4)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": Node {
            "next": null,
            "prev": [Circular],
            "value": 2,
          },
          "prev": null,
          "value": 1,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": Node {
            "next": [Circular],
            "prev": null,
            "value": 1,
          },
          "value": 2,
        }
      `)
      expect(list2.head).toMatchInlineSnapshot(`
        Node {
          "next": Node {
            "next": null,
            "prev": [Circular],
            "value": 4,
          },
          "prev": null,
          "value": 3,
        }
      `)
      expect(list2.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": Node {
            "next": [Circular],
            "prev": null,
            "value": 3,
          },
          "value": 4,
        }
      `)
    })
  })

  describe('unshift and shift', () => {
    it('shift empty', () => {
      const list = new LinkedList()
      list.shift()
      expect(list.head).toMatchInlineSnapshot(`null`)
      expect(list.tail).toMatchInlineSnapshot(`null`)
    })

    it('unshift shift', () => {
      const list = new LinkedList()
      list.unshift(1)
      list.shift()
      expect(list.head).toMatchInlineSnapshot(`null`)
      expect(list.tail).toMatchInlineSnapshot(`null`)
      const values = [...list]
      expect(values).toMatchInlineSnapshot(`Array []`)
      expect(list.size).toBe(values.length)
    })

    it('unshift shift unshift', () => {
      const list = new LinkedList()
      list.unshift(1)
      list.shift()
      list.unshift(2)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": null,
          "value": 2,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": null,
          "value": 2,
        }
      `)
      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          2,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('unshift shift unshift unshift', () => {
      const list = new LinkedList()
      list.unshift(1)
      list.shift()
      list.unshift(2)
      list.unshift(3)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": Node {
            "next": null,
            "prev": [Circular],
            "value": 2,
          },
          "prev": null,
          "value": 3,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": Node {
            "next": [Circular],
            "prev": null,
            "value": 3,
          },
          "value": 2,
        }
      `)
      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          3,
          2,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('unshift unshift', () => {
      const list = new LinkedList()
      list.unshift(1)
      list.unshift(2)
      expect(list.head).toMatchInlineSnapshot(`
        Node {
          "next": Node {
            "next": null,
            "prev": [Circular],
            "value": 1,
          },
          "prev": null,
          "value": 2,
        }
      `)
      expect(list.tail).toMatchInlineSnapshot(`
        Node {
          "next": null,
          "prev": Node {
            "next": [Circular],
            "prev": null,
            "value": 2,
          },
          "value": 1,
        }
      `)
      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          2,
          1,
        ]
      `)
      expect(list.size).toBe(values.length)
    })
  })

  describe('reduce', () => {
    it('should reduce with initial value', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      const cb = jest.fn((memo, num) => memo + num.toString())
      const result = list.reduce<string>(cb, '')
      expect(result).toBe('123')
      expect(cb).toHaveBeenNthCalledWith(1, '', list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, '1', list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(
        3,
        '12',
        list.head.next.next.value,
        2,
        list,
      )
      expect(cb).toHaveBeenCalledTimes(3)
    })

    it('should reduce without initial value', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      const cb = jest.fn((memo, num) => memo + num.toString())
      const result = list.reduce<string>(cb)
      expect(result).toBe('123')
      expect(cb).toHaveBeenCalledTimes(2)
      expect(cb).toHaveBeenNthCalledWith(1, 1, 2, 1, list)
      expect(cb).toHaveBeenNthCalledWith(2, '12', 3, 2, list)
    })
  })
  describe('some', () => {
    it('should iterate through all items if all return truthy', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn(() => false)
      const result = list.some(cb)
      expect(result).toBe(false)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
      expect(cb).toHaveBeenNthCalledWith(3, list.head.next.next.value, 2, list)
      expect(cb).toHaveBeenCalledTimes(3)
    })

    it('should stop if returns falsy', () => {
      const list = new LinkedList()
      list.push(9)
      list.push(10)
      list.push(11)
      const cb = jest.fn((val, i) => {
        return i > 0
      })
      const result = list.some(cb)
      expect(result).toBe(true)
      expect(cb).toHaveBeenCalledTimes(2)
      expect(cb).toHaveBeenNthCalledWith(1, list.head.value, 0, list)
      expect(cb).toHaveBeenNthCalledWith(2, list.head.next.value, 1, list)
    })
  })

  describe('splice', () => {
    it('splice start', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(5)
      list.push(6)
      const removed = list.splice(0, 3, 100, 200, 300)

      expect([...removed]).toMatchInlineSnapshot(`
        Array [
          1,
          2,
          3,
        ]
      `)

      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          100,
          200,
          300,
          4,
          5,
          6,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('splice end', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(5)
      list.push(6)
      const removed = list.splice(100, 3, 100, 200, 300)

      const removedItems = []
      for (let item of removed) removedItems.push(item)
      expect(removedItems).toMatchInlineSnapshot(`Array []`)

      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          1,
          2,
          3,
          4,
          5,
          6,
          100,
          200,
          300,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('should remove and push items', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(5)
      list.push(6)
      const removed = list.splice(1, 2, 100, 200, 300)

      expect([...removed]).toMatchInlineSnapshot(`
        Array [
          2,
          3,
        ]
      `)

      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          1,
          100,
          200,
          300,
          4,
          5,
          6,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('should push items', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(5)
      list.push(6)
      const removed = list.splice(2, 0, 100, 200, 300)

      expect([...removed]).toMatchInlineSnapshot(`Array []`)

      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          1,
          2,
          100,
          200,
          300,
          3,
          4,
          5,
          6,
        ]
      `)
      expect(list.size).toBe(values.length)
    })

    it('should push items at 0', () => {
      const list = new LinkedList()
      list.push(1)
      list.push(2)
      list.push(3)
      list.push(4)
      list.push(5)
      list.push(6)
      const removed = list.splice(0, 2, 100, 200, 300)

      const removedItems = []
      for (let item of removed) removedItems.push(item)
      expect(removedItems).toMatchInlineSnapshot(`
        Array [
          1,
          2,
        ]
      `)

      const values = [...list]
      expect(values).toMatchInlineSnapshot(`
        Array [
          100,
          200,
          300,
          3,
          4,
          5,
          6,
        ]
      `)
      expect(list.size).toBe(values.length)
    })
  })
})
