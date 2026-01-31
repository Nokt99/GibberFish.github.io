const ModStorage = (function () {
  const PROJECTS_KEY = "gf_mod_projects";
  const PUBLISHED_KEY = "gf_published_mods";
  const DOWNLOADED_KEY = "gf_downloaded_mods";
  const ENABLED_KEY = "gf_enabled_mod";
  const USER_KEY = "gf_user";

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function loadAllProjects() {
    return safeParse(localStorage.getItem(PROJECTS_KEY), {});
  }

  function saveAllProjects(projects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  function saveProject(modName, files, meta) {
    const all = loadAllProjects();
    const existing = all[modName] || {};
    all[modName] = {
      files: files,
      meta: Object.assign({}, existing.meta || {}, meta || {}),
      updatedAt: Date.now()
    };
    saveAllProjects(all);
  }

  function loadProject(modName) {
    const all = loadAllProjects();
    return all[modName] || null;
  }

  function loadAllPublished() {
    return safeParse(localStorage.getItem(PUBLISHED_KEY), {});
  }

  function saveAllPublished(published) {
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
  }

  function savePublishedMod(modName, payload) {
    const all = loadAllPublished();
    all[modName] = Object.assign({}, payload, { publishedAt: Date.now() });
    saveAllPublished(all);
  }

  function loadPublishedMods() {
    return loadAllPublished();
  }

  function loadDownloadedMods() {
    return safeParse(localStorage.getItem(DOWNLOADED_KEY), {});
  }

  function saveDownloadedMods(mods) {
    localStorage.setItem(DOWNLOADED_KEY, JSON.stringify(mods));
  }

  function saveDownloadedMod(modName, payload) {
    const all = loadDownloadedMods();
    all[modName] = Object.assign({}, payload, { downloadedAt: Date.now() });
    saveDownloadedMods(all);
  }

  function setEnabledMod(modName) {
    if (modName === null || modName === undefined) {
      localStorage.removeItem(ENABLED_KEY);
    } else {
      localStorage.setItem(ENABLED_KEY, modName);
    }
  }

  function getEnabledMod() {
    return localStorage.getItem(ENABLED_KEY) || null;
  }

  function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function loadUser() {
    return safeParse(localStorage.getItem(USER_KEY), null);
  }

  return {
    saveProject,
    loadProject,
    loadPublishedMods,
    savePublishedMod,
    loadDownloadedMods,
    saveDownloadedMod,
    setEnabledMod,
    getEnabledMod,
    saveUser,
    loadUser
  };
})();
