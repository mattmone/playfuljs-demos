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

export const clamp = (value, min, max) => {
  value = Number(value);
  min = Number(min);
  max = Number(max);
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const dieDisplay = (sides = 2, times = 1) => {
  if (sides === 1) return times;
  return `${times}d${sides} (${times}-${times * sides})`;
};

export const equipmentSort = (a, b) => {
  if (!a.equipped && !b.equipped) return 0;
  if (b.equipped) return 1;
  if (a.equipped) return -1;
};
