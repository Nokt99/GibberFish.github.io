// engine/code-dsl-interpreter.js
window.GF = window.GF || {};

GF.interpretGibberfishCode = function (rawText) {
  const lines = (rawText || '').split('\n');
  const blocks = [];
  let current = [];

  // Push current block into blocks
  function pushBlock() {
    if (current.length > 0) {
      blocks.push(current);
      current = [];
    }
  }

  // Split into blocks using "Gibberfish Obey:"
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineObj = { raw: line, trimmed, index: index + 1 };

    if (/^Gibberfish\s*Obey:$/i.test(trimmed)) {
      pushBlock();
    } else {
      current.push(lineObj);
    }
  });

  pushBlock();

  const actions = [];

  // Parse each block
  for (const block of blocks) {
    if (block.length === 0) continue;

    const first = block[0].trimmed;

    // Random code block
    if (/^Gibberfish:\(random\.code\);$/i.test(first)) {
      actions.push({ type: 'random-code', block });
      continue;
    }

    // Image insert
    let imageMatch = first.match(/^Gibberfish:\(image\.insert\)\/\((.+)\)\\$/i);
    if (imageMatch) {
      const url = imageMatch[1].trim();
      const meta = parseMeta(block.slice(1));
      actions.push({ type: 'image', url, meta, block });
      continue;
    }

    // Iframe import
    let iframeMatch = first.match(/^Gibberfish:\(Iframe\.import\);\/\((.+)\)\\$/i);
    if (iframeMatch) {
      const url = iframeMatch[1].trim();
      const meta = parseMeta(block.slice(1));
      actions.push({ type: 'iframe', url, meta, block });
      continue;
    }

    // Raw code block
    let codeMatch = first.match(/^Gibberfish:\(code\);\/\(([\s\S]+)\)\\$/i);
    if (codeMatch) {
      const codeContent = codeMatch[1];
      actions.push({ type: 'raw-code', code: codeContent, block });
      continue;
    }
  }

  return actions;
};

// Parse metadata inside a block
function parseMeta(lines) {
  const meta = {
    rigSeconds: null,
    placement: null
  };

  let expectingPlacement = false;

  for (const line of lines) {
    const t = line.trimmed;

    // Rig time
    let rigMatch = t.match(/^Gibberfish:\(set\.rig\.time(?:\.(\d+))?\)=image;$/i);
    if (rigMatch) {
      const n = rigMatch[1];
      meta.rigSeconds = n ? parseInt(n, 10) : 0;
      continue;
    }

    // Placement start
    if (/^Gibberfish:\(set\.placement\);$/i.test(t)) {
      expectingPlacement = true;
      continue;
    }

    // Placement value
    if (expectingPlacement && t.length > 0) {
      meta.placement = t;
      expectingPlacement = false;
      continue;
    }
  }

  return meta;
}
