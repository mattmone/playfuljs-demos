export function oneOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function removeFromArray(arr, value) {
  arr.splice(arr.indexOf(value), 1);
  return arr;
}

export function rollDice(sides = 2, times = 1) {
  let total = 0;
  while (times > 0) {
    total += Math.ceil(Math.random() * sides);
    times--;
  }
  if (!total) return 0;
  return total;
}

export const doubleRaf = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
