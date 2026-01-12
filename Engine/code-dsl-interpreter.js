// engine/code-dsl-interpreter.js
window.GF = window.GF || {};

(function () {
  function interpretGibberfishCode(rawText) {
    var lines = (rawText || '').split('\n');

    var blocks = [];
    var current = [];

    function pushBlock() {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
    }

    lines.forEach(function (line, index) {
      var trimmed = line.trim();
      var lineObj = { raw: line, trimmed: trimmed, index: index+1 };

      if (/^Gibberfish\s*Obey:$/i.test(trimmed)) {
        pushBlock();
      } else {
        current.push(lineObj);
      }
    });
    pushBlock();

    var actions = [];

    blocks.forEach(function (block) {
      if (block.length === 0) return;
      var first = block[0].trimmed;

      if (/^Gibberfish:\(random\.code\);$/i.test(first)) {
        actions.push({ type: 'random-code', block: block });
        return;
      }

      var imageMatch = first.match(/^Gibberfish:\(image\.insert\)\/\((.+)\)\\$/i);
      var iframeMatch = first.match(/^Gibberfish:\(Iframe\.import\);\/\((.+)\)\\$/i);
      var codeMatch = first.match(/^Gibberfish:\(code\);\/\(([\s\S]+)\)\\$/i);

      if (imageMatch) {
        var url = imageMatch[1].trim();
        var meta = parseMeta(block.slice(1));
        actions.push({
          type: 'image',
          url: url,
          meta: meta,
          block: block
        });
        return;
      }

      if (iframeMatch) {
        var url2 = iframeMatch[1].trim();
        var meta2 = parseMeta(block.slice(1));
        actions.push({
          type: 'iframe',
          url: url2,
          meta: meta2,
          block: block
        });
        return;
      }

      if (codeMatch) {
        var codeContent = codeMatch[1];
        actions.push({
          type: 'raw-code',
          code: codeContent,
          block: block
        });
        return;
      }
    });

    return actions;
  }

  function parseMeta(lines) {
    var meta = {
      rigSeconds: null,
      placement: null
    };

    var expectingPlacement = false;

    lines.forEach(function (line) {
      var t = line.trimmed;
      if (/^Gibberfish\.Says$/i.test(t)) {
        expectingPlacement = false;
        return;
      }

      var rigMatch = t.match(/^Gibberfish:\(set\.rig\.time(?:\.(\d+))?\)=image;$/i);
      if (rigMatch) {
        var n = rigMatch[1];
        meta.rigSeconds = n ? parseInt(n, 10) : 0;
        return;
      }

      if (/^Gibberfish:\(set\.placement\);$/i.test(t)) {
        expectingPlacement = true;
        return;
      }

      if (expectingPlacement && t.length > 0) {
        meta.placement = t;
        expectingPlacement = false;
        return;
      }
    });

    return meta;
  }

  window.GF.interpretGibberfishCode = interpretGibberfishCode;
})();
