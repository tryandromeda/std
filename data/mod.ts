function swap<T>(array: T[], a: number, b: number) {
  const temp = array[a];
  array[a] = array[b]!;
  array[b] = temp!;
}

// test
const array = [1, 2, 3, 4, 5];
swap(array, 1, 3);