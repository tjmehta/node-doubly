# Name

Description

# Installation

```sh
npm i --save dualy
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import Doubly from 'doubly`
// commonjs
const Doubly = require('doubly').default
```

# Methods

#### at(index: number)

```ts
const list = new Doubly()
list.push(100)
list.at(0) // 100
list.at(-1) // LinklyError: At negative index not supported
```

#### concat(list: Doubly<T>)

```ts
// push
const list = new Linkly()
list.push(100)
list.push(200)
list.push(300)

const list2 = new Linkly()
list.push(400)
list.push(500)
list.push(600)

const list3 = list.concat()
```

... TODO

# License

MIT
