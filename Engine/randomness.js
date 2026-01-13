// engine/randomness.js
window.GF = window.GF || {};

// Generate a unique ID
GF.uid = function (prefix) {
  prefix = prefix || '';
  return prefix + Math.random().toString(36).slice(2, 9);
};

// Weighted random selection
GF.pickWeighted = function (list, rng) {
  rng = rng || Math.random;

  const total = list.reduce((sum, item) => sum + (item.weight || 1), 0);
  let r = rng() * total;

  for (const item of list) {
    r -= (item.weight || 1);
    if (r <= 0) return item;
  }

  return list[list.length - 1];
};
