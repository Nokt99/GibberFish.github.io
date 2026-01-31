(function () {
  const fileListEl = document.getElementById("file-list");
  const createFileBtn = document.getElementById("create-file-btn");
  const editor = document.getElementById("editor");
  const modNameInput = document.querySelector(".mod-name-input");
  const publishBtn = document.querySelector(".topbar .btn");

  const PROJECTS_KEY = "gf_mod_projects";
  const DOWNLOADED_KEY = "gf_downloaded_mods";

  let currentModName = "";
  let currentFiles = {};
  let currentFile = null;
  let isLoading = false;

  function loadAllProjects() {
    try {
      return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveAllProjects(projects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  function loadDownloadedMods() {
    try {
      return JSON.parse(localStorage.getItem(DOWNLOADED_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveDownloadedMods(mods) {
    localStorage.setItem(DOWNLOADED_KEY, JSON.stringify(mods));
  }

  function ensureModName() {
    let name = modNameInput.value.trim();
    if (!name) {
      name = "Untitled Mod";
      modNameInput.value = name;
    }
    currentModName = name;
    return name;
  }

  function loadProjectForCurrentMod() {
    const projects = loadAllProjects();
    const name = ensureModName();
    const project = projects[name];

    if (project && project.files && Object.keys(project.files).length > 0) {
      currentFiles = project.files;
      currentFile = project.currentFile || Object.keys(currentFiles)[0];
    } else {
      currentFiles = { "main.js": "" };
      currentFile = "main.js";
    }

    renderFileList();
    loadCurrentFileIntoEditor();
  }

  function saveProject() {
    if (isLoading) return;
    const name = ensureModName();
    const projects = loadAllProjects();
    projects[name] = {
      files: currentFiles,
      currentFile: currentFile
    };
    saveAllProjects(projects);
  }

  function renderFileList() {
    fileListEl.innerHTML = "";
    Object.keys(currentFiles).forEach(function (filename) {
      const item = document.createElement("div");
      item.className = "file-item";
      item.textContent = filename;
      if (filename === currentFile) {
        item.style.background = "#1a2035";
      }
      item.addEventListener("click", function () {
        switchFile(filename);
      });
      fileListEl.appendChild(item);
    });
  }

  function switchFile(filename) {
    if (currentFile) {
      currentFiles[currentFile] = editor.value;
    }
    currentFile = filename;
    loadCurrentFileIntoEditor();
    renderFileList();
    saveProject();
  }

  function loadCurrentFileIntoEditor() {
    isLoading = true;
    editor.value = currentFiles[currentFile] || "";
    isLoading = false;
  }

  function createNewFile() {
    let baseName = "file";
    let index = 1;
    let candidate = baseName + index + ".js";
    while (currentFiles[candidate]) {
      index += 1;
      candidate = baseName + index + ".js";
    }
    currentFiles[candidate] = "";
    currentFile = candidate;
    renderFileList();
    loadCurrentFileIntoEditor();
    saveProject();
  }

  function publishMod() {
    if (currentFile) {
      currentFiles[currentFile] = editor.value;
    }
    const name = ensureModName();
    const downloaded = loadDownloadedMods();
    downloaded[name] = {
      name: name,
      files: currentFiles,
      createdAt: Date.now()
    };
    saveDownloadedMods(downloaded);
    saveProject();
    alert("Mod published: " + name);
  }

  createFileBtn.addEventListener("click", function () {
    createNewFile();
  });

  editor.addEventListener("input", function () {
    if (!currentFile || isLoading) return;
    currentFiles[currentFile] = editor.value;
    saveProject();
  });

  modNameInput.addEventListener("input", function () {
    saveProject();
  });

  publishBtn.addEventListener("click", function () {
    publishMod();
  });

  window.addEventListener("load", function () {
    loadProjectForCurrentMod();
  });
})();
