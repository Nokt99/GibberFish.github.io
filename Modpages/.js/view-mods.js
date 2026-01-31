(function () {
  const container = document.getElementById("mods-container");

  function createModCard(mod) {
    const card = document.createElement("div");
    card.className = "mod-card";

    const title = document.createElement("h2");
    title.textContent = mod.name || "Unnamed Mod";

    const author = document.createElement("div");
    author.style.fontSize = "12px";
    author.style.opacity = "0.8";
    author.textContent = "By " + (mod.author || "Anonymous");

    const meta = document.createElement("div");
    meta.style.fontSize = "12px";
    meta.style.marginTop = "4px";
    if (mod.meta && mod.meta.description) {
      meta.textContent = mod.meta.description;
    } else {
      meta.textContent = "No description provided.";
    }

    const actions = document.createElement("div");
    actions.style.marginTop = "12px";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "btn";
    downloadBtn.textContent = "Download";
    downloadBtn.addEventListener("click", function () {
      ModStorage.saveDownloadedMod(mod.name, mod);
      alert("Downloaded mod: " + mod.name);
    });

    actions.appendChild(downloadBtn);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(meta);
    card.appendChild(actions);

    return card;
  }

  function renderMods() {
    const published = ModStorage.loadPublishedMods();
    const names = Object.keys(published);
    container.innerHTML = "";
    if (names.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "No mods published yet.";
      container.appendChild(empty);
      return;
    }
    for (let i = 0; i < names.length; i++) {
      const mod = published[names[i]];
      container.appendChild(createModCard(mod));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMods);
  } else {
    renderMods();
  }
})();
