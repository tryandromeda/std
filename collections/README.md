# Collections

Collection data structures used across Andromeda projects.

This package exposes its public API through `mod.ts`.

See `mod.ts` for available types and functions.

## Examples

Import and use common data structures:

```ts
import {
  BinaryTree,
  LinkedList,
  LRUCache,
  Queue,
  Stack,
} from "https://tryandromeda.dev/std/collections/mod.ts";

const q = new Queue<string>();
q.enqueue("a");
q.enqueue("b");
console.log(q.dequeue()); // "a"

const s = new Stack<number>();
s.push(1);
s.push(2);
console.log(s.pop()); // 2

const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.prepend(0);
console.log(list.toArray()); // [0,1,2]

const tree = new BinaryTree<number>();
tree.insert(5);
tree.insert(3);
tree.insert(7);
console.log(tree.inOrder()); // [3,5,7]

const cache = new LRUCache<string, number>(2);
cache.set("a", 1);
cache.set("b", 2);
cache.set("c", 3);
console.log(cache.get("a")); // undefined
```
