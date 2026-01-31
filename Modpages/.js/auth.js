(function () {
  const USER_KEY = "gf_user";

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function loadUser() {
    return safeParse(localStorage.getItem(USER_KEY), null);
  }

  function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (window.ModStorage && typeof ModStorage.saveUser === "function") {
      ModStorage.saveUser(user);
    }
  }

  function createUser(provider) {
    const id = "user_" + provider + "_" + Date.now();
    return {
      id: id,
      provider: provider,
      username: null
    };
  }

  function handleProviderClick(provider) {
    const user = createUser(provider);
    saveUser(user);
    window.location.href = "username.html";
  }

  function initSignInPage() {
    const buttons = document.querySelectorAll(".shell .btn");
    if (!buttons || buttons.length === 0) return;
    if (buttons[0]) {
      buttons[0].addEventListener("click", function () {
        handleProviderClick("google");
      });
    }
    if (buttons[1]) {
      buttons[1].addEventListener("click", function () {
        handleProviderClick("apple");
      });
    }
    if (buttons[2]) {
      buttons[2].addEventListener("click", function () {
        handleProviderClick("microsoft");
      });
    }
  }

  function initUsernamePage() {
    const input = document.querySelector(".shell input");
    const btn = document.querySelector(".shell .btn");
    if (!input || !btn) return;
    const user = loadUser();
    if (!user) {
      window.location.href = "sign-in.html";
      return;
    }
    btn.addEventListener("click", function () {
      const name = input.value.trim();
      if (!name) {
        alert("Please enter a username.");
        return;
      }
      user.username = name;
      saveUser(user);
      window.location.href = "mods.html";
    });
  }

  function detectPage() {
    const path = window.location.pathname;
    if (path.indexOf("sign-in.html") !== -1) {
      initSignInPage();
    } else if (path.indexOf("username.html") !== -1) {
      initUsernamePage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", detectPage);
  } else {
    detectPage();
  }
})();
