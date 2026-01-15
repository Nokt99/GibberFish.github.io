// content/pools.js
window.GF = window.GF || {};

(function () {
  const pools = {
    memes: [
      {
        id: 'meme-1',
        type: 'meme',
        rarity: 'common',
        weight: 40,
        title: 'Fishy Smile',
        payload: { caption: 'When your code compiles... kind of' }
      },
      {
        id: 'meme-2',
        type: 'meme',
        rarity: 'common',
        weight: 30,
        title: 'Wet Stack',
        payload: { caption: 'Stack overflowed with water' }
      },
      {
        id: 'meme-rare-1',
        type: 'meme',
        rarity: 'rare',
        weight: 5,
        title: 'Legendary Glub',
        payload: { caption: 'You rolled the mythical fish.' }
      }
    ],

    codeFragments: [
      {
        id: 'code-1',
        type: 'code',
        rarity: 'common',
        weight: 40,
        title: 'console blub',
        payload: { code: 'console.log("blub");' }
      },
      {
        id: 'code-2',
        type: 'code',
        rarity: 'uncommon',
        weight: 20,
        title: 'color wiggle',
        payload: { code: 'GF.emit("colorShift", {hue: Math.random()*360});' }
      }
    ],

    fakeCalls: [
      {
        id: 'call-1',
        type: 'call',
        rarity: 'common',
        weight: 30,
        title: 'Unknown Fish',
        payload: { name: 'Unknown Fish' }
      }
    ],

    printerMessages: [
      {
        id: 'print-1',
        type: 'printer',
        rarity: 'common',
        weight: 40,
        title: 'Receipt',
        payload: { text: 'Receipt: 1x Fish Snack — $0.00' }
      },
      {
        id: 'print-2',
        type: 'printer',
        rarity: 'uncommon',
        weight: 15,
        title: 'Diagnostic',
        payload: { text: 'BlubJet 3000: All fins operational.' }
      }
    ],

    glitches: [
      {
        id: 'glitch-1',
        type: 'glitch',
        rarity: 'uncommon',
        weight: 10,
        title: 'Pixel Drift',
        payload: { intensity: 0.4 }
      }
    ],

    rarePrograms: [
      {
        id: 'prog-1',
        type: 'rareProgram',
        rarity: 'legendary',
        weight: 2,
        title: 'BouncyFish',
        payload: { description: 'A tiny bouncing fish animation.' }
      }
    ]
  };

  function getPoolSummary() {
    return {
      memes: pools.memes.length,
      codeFragments: pools.codeFragments.length,
      fakeCalls: pools.fakeCalls.length,
      printerMessages: pools.printerMessages.length
    };
  }

  window.GF.pools = pools;
  window.GF.getPoolSummary = getPoolSummary;
})();
