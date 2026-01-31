const ModLoader = (function () {
  function getDownloadedMods() {
    return ModStorage.loadDownloadedMods();
  }

  function getEnabledModName() {
    return ModStorage.getEnabledMod();
  }

  function buildModAPI() {
    if (!window.GFModRegistry) {
      window.GFModRegistry = {
        commands: {},
        renderers: {},
        hooks: {}
      };
    }
    function registerCommand(name, fn) {
      if (!name || typeof fn !== "function") return;
      window.GFModRegistry.commands[name] = fn;
    }
    function registerRenderer(name, fn) {
      if (!name || typeof fn !== "function") return;
      window.GFModRegistry.renderers[name] = fn;
    }
    function registerHook(name, fn) {
      if (!name || typeof fn !== "function") return;
      window.GFModRegistry.hooks[name] = window.GFModRegistry.hooks[name] || [];
      window.GFModRegistry.hooks[name].push(fn);
    }
    return {
      registerCommand,
      registerRenderer,
      registerHook
    };
  }

  function executeBundle(modName, bundle) {
    const api = buildModAPI();
    const gf = window.GibberFish || {};
    try {
      const fn = new Function("GibberFish", "ModAPI", bundle);
      fn(gf, api);
      console.log("GibberFish mod loaded:", modName);
    } catch (e) {
      console.error("GibberFish mod failed to execute:", modName, e);
    }
  }

  function loadEnabledMod() {
    const enabled = getEnabledModName();
    if (!enabled) return;
    const downloaded = getDownloadedMods();
    const mod = downloaded[enabled];
    if (!mod || !mod.files) return;
    const bundle = ModMerge.mergeModWithEngine(enabled, mod.files);
    executeBundle(enabled, bundle);
  }

  function init() {
    loadEnabledMod();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    loadEnabledMod
  };
})();
