// engine/chaos-engine.js
window.GF = window.GF || {};

GF.ChaosEngine = function () {
  this.letters = '';
  this.artifacts = [];
};

GF.ChaosEngine.prototype.setLetters = function (str) {
  this.letters = str || '';
};

GF.ChaosEngine.prototype.clear = function () {
  this.letters = '';
  this.artifacts = [];
};

GF.ChaosEngine.prototype.generateDrops = function () {
  const letters = this.letters || '';
  const drops = [];
  for (const ch of letters) {
    const poolKey = this._pickPool();
    const pool = this._getPool(poolKey);
    if (!pool || pool.length === 0) continue;
    const item = GF.pickWeighted(pool);
    const art = this._wrapArtifact(ch, item);
    this.artifacts.push(art);
    drops.push(art);
  }
  return drops;
};

GF.ChaosEngine.prototype._pickPool = function () {
  const options = [
    { key: 'memes', weight: 35 },
    { key: 'codeFragments', weight: 30 },
    { key: 'printerMessages', weight: 15 },
    { key: 'fakeCalls', weight: 10 },
    { key: 'glitches', weight: 8 },
    { key: 'rarePrograms', weight: 2 }
  ];
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.key;
  }
  return 'memes';
};

GF.ChaosEngine.prototype._getPool = function (key) {
  return GF.pools[key] || GF.pools.memes;
};

GF.ChaosEngine.prototype._wrapArtifact = function (letter, item) {
  return {
    id: GF.uid('a-'),
    letter,
    type: item.type,
    rarity: item.rarity || 'common',
    title: item.title || item.id,
    payload: item.payload || {},
    sourceId: item.id,
    createdAt: Date.now()
  };
};

GF.ChaosEngine.prototype.exportState = function () {
  return {
    letters: this.letters,
    artifacts: this.artifacts
  };
};

GF.ChaosEngine.prototype.importState = function (state) {
  this.letters = state.letters || '';
  this.artifacts = state.artifacts || [];
};
