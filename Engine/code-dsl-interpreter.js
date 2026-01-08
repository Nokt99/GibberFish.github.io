// engine/code-dsl-interpreter.js
// Implements the GibberFish Code Mode DSL you described.

export function interpretGibberfishCode(rawText) {
  const lines = (rawText || '').split('\n');

  // We'll parse into "blocks", separated by "Gibberfish Obey:"
  const blocks = [];
  let current = [];

  const pushBlock = () => {
    if (current.length > 0) {
      blocks.push(current);
      current = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const lineObj = { raw: line, trimmed, index: index+1 };

    if (/^Gibberfish\s*Obey:$/i.test(trimmed)) {
      pushBlock();
    } else {
      current.push(lineObj);
    }
  });
  pushBlock();

  // For each block, figure out what it does
  const actions = []; // list of { type, ... }

  for (const block of blocks) {
    if (block.length === 0) continue;

    // Look for core command at the top of block
    const first = block[0].trimmed;

    if (/^Gibberfish:\(random\.code\);$/i.test(first)) {
      actions.push({ type: 'random-code', block });
      continue;
    }

    let imageMatch = first.match(/^Gibberfish:\(image\.insert\)\/\((.+)\)\\$/i);
    let iframeMatch = first.match(/^Gibberfish:\(Iframe\.import\);\/\((.+)\)\\$/i);
    let codeMatch = first.match(/^Gibberfish:\(code\);\/\(([\s\S]+)\)\\$/i);

    if (imageMatch) {
      const url = imageMatch[1].trim();
      const meta = parseMeta(block.slice(1));
      actions.push({
        type: 'image',
        url,
        meta,
        block
      });
      continue;
    }

    if (iframeMatch) {
      const url = iframeMatch[1].trim();
      const meta = parseMeta(block.slice(1));
      actions.push({
        type: 'iframe',
        url,
        meta,
        block
      });
      continue;
    }

    if (codeMatch) {
      const codeContent = codeMatch[1];
      actions.push({
        type: 'raw-code',
        code: codeContent,
        block
      });
      continue;
    }
  }

  return actions;
}

// Parse Gibberfish.Says meta lines: set.rig.time, set.placement, etc.
function parseMeta(lines) {
  const meta = {
    rigSeconds: null,
    placement: null
  };

  let expectingPlacement = false;

  for (const line of lines) {
    const t = line.trimmed;
    if (/^Gibberfish\.Says$/i.test(t)) {
      expectingPlacement = false;
      continue;
    }

    // set rig time
    let rigMatch = t.match(/^Gibberfish:\(set\.rig\.time(?:\.(\d+))?\)=image;$/i);
    if (rigMatch) {
      const n = rigMatch[1];
      meta.rigSeconds = n ? parseInt(n, 10) : 0;
      continue;
    }

    if (/^Gibberfish:\(set\.placement\);$/i.test(t)) {
      expectingPlacement = true;
      continue;
    }

    if (expectingPlacement && t.length > 0) {
      meta.placement = t; // e.g. "middle left"
      expectingPlacement = false;
      continue;
    }
  }

  return meta;
}
