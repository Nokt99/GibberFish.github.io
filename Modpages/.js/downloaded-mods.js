(function () {
  const container = document.getElementById("downloaded-mods-container");

  function createModCard(mod, enabledName) {
    const card = document.createElement("div");
    card.className = "mod-card";

    const title = document.createElement("h2");
    title.textContent = mod.name || "Unnamed Mod";

    const author = document.createElement("div");
    author.style.fontSize = "12px";
    author.style.opacity = "0.8";
    author.textContent = "By " + (mod.author || "Anonymous");

    const status = document.createElement("div");
    status.style.fontSize = "12px";
    status.style.marginTop = "4px";
    if (enabledName === mod.name) {
      status.textContent = "Status: Enabled";
    } else {
      status.textContent = "Status: Disabled";
    }

    const actions = document.createElement("div");
    actions.style.marginTop = "12px";

    const enableBtn = document.createElement("button");
    enableBtn.className = "btn";
    enableBtn.textContent = "Enable";
    enableBtn.addEventListener("click", function () {
      ModStorage.setEnabledMod(mod.name);
      renderMods();
    });

    const disableBtn = document.createElement("button");
    disableBtn.className = "btn";
    disableBtn.style.marginLeft = "8px";
    disableBtn.textContent = "Disable";
    disableBtn.addEventListener("click", function () {
      const current = ModStorage.getEnabledMod();
      if (current === mod.name) {
        ModStorage.setEnabledMod(null);
      }
      renderMods();
    });

    actions.appendChild(enableBtn);
    actions.appendChild(disableBtn);

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(status);
    card.appendChild(actions);

    return card;
  }

  function renderMods() {
    const downloaded = ModStorage.loadDownloadedMods();
    const names = Object.keys(downloaded);
    const enabled = ModStorage.getEnabledMod();
    container.innerHTML = "";
    if (names.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "No mods downloaded yet.";
      container.appendChild(empty);
      return;
    }
    for (let i = 0; i < names.length; i++) {
      const mod = downloaded[names[i]];
      container.appendChild(createModCard(mod, enabled));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMods);
  } else {
    renderMods();
  }
})();
