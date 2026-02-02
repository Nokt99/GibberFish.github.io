(function () {
  let roundOneWinners = [];
  let finalist = null;

  function initAdminButton() {
    const user = GFUserTracking.loadUser();
    if (!GFUserTracking.isAdmin(user)) return;
    const btn = document.getElementById("spin-that-wheel-btn");
    if (!btn) return;
    btn.style.display = "inline-block";
    btn.addEventListener("click", function () {
      window.location.href = "admin-event.html";
    });
  }

  function buildRoundOne() {
    const container = document.getElementById("round1-container");
    if (!container) return;
    const participants = GFUserTracking.getParticipantsForCurrentPeriod();
    const ids = Object.keys(participants);
    const items = [];
    for (let i = 0; i < ids.length; i++) {
      const p = participants[ids[i]];
      if (!p.username) continue;
      items.push({
        id: p.id,
        label: p.username,
        weight: 1,
        enabled: roundOneWinners.indexOf(p.id) === -1
      });
    }
    if (items.length === 0) {
      container.textContent = "No participants this month.";
      return;
    }
    GFWheel.createWheel(container, items, function (chosen) {
      if (roundOneWinners.indexOf(chosen.id) === -1) {
        roundOneWinners.push(chosen.id);
        renderRoundOneList();
        if (roundOneWinners.length >= 10) {
          const nextBtn = document.getElementById("to-round2-btn");
          if (nextBtn) nextBtn.disabled = false;
        }
      }
    });
  }

  function renderRoundOneList() {
    const list = document.getElementById("round1-winners");
    if (!list) return;
    const participants = GFUserTracking.getParticipantsForCurrentPeriod();
    list.innerHTML = "";
    for (let i = 0; i < roundOneWinners.length; i++) {
      const id = roundOneWinners[i];
      const p = participants[id];
      if (!p) continue;
      const li = document.createElement("li");
      li.textContent = p.username || "Unknown";
      list.appendChild(li);
    }
  }

  function buildRoundTwo() {
    const container = document.getElementById("round2-container");
    if (!container) return;
    const participants = GFUserTracking.getParticipantsForCurrentPeriod();
    const items = [];
    for (let i = 0; i < roundOneWinners.length; i++) {
      const id = roundOneWinners[i];
      const p = participants[id];
      if (!p || !p.username) continue;
      items.push({
        id: p.id,
        label: p.username,
        weight: 1,
        enabled: true
      });
    }
    if (items.length === 0) {
      container.textContent = "No finalists available.";
      return;
    }
    GFWheel.createWheel(container, items, function (chosen) {
      finalist = chosen.id;
      renderFinalist();
      const nextBtn = document.getElementById("to-final-btn");
      if (nextBtn) nextBtn.disabled = false;
    });
  }

  function renderFinalist() {
    const el = document.getElementById("finalist-display");
    if (!el) return;
    const participants = GFUserTracking.getParticipantsForCurrentPeriod();
    const p = participants[finalist];
    if (!p) {
      el.textContent = "No finalist selected.";
      return;
    }
    el.textContent = "Finalist: " + (p.username || "Unknown");
  }

  function buildFinalWheel() {
    const container = document.getElementById("final-container");
    if (!container) return;
    const participants = GFUserTracking.getParticipantsForCurrentPeriod();
    const p = participants[finalist];
    if (!p) {
      container.textContent = "No finalist.";
      return;
    }
    const userRecord = GFUserTracking.loadUser();
    const isFinalistPremium = !!(userRecord && userRecord.id === p.id && GFUserTracking.isPremium(userRecord));

    const items = [
      {
        key: "lifetime",
        label: "Free Premium for Life",
        weight: 3,
        enabled: true
      },
      {
        key: "custom_mod",
        label: "Custom Mod Option",
        weight: 15,
        enabled: isFinalistPremium
      },
      {
        key: "year",
        label: "Free Premium for a Year",
        weight: 10,
        enabled: true
      },
      {
        key: "mod_1",
        label: "Custom Mod 1",
        weight: 12,
        enabled: isFinalistPremium
      },
      {
        key: "mod_2",
        label: "Custom Mod 2",
        weight: 12,
        enabled: isFinalistPremium
      },
      {
        key: "mod_3",
        label: "Custom Mod 3",
        weight: 12,
        enabled: isFinalistPremium
      },
      {
        key: "mod_4",
        label: "Custom Mod 4",
        weight: 12,
        enabled: isFinalistPremium
      },
      {
        key: "mod_5",
        label: "Custom Mod 5",
        weight: 24,
        enabled: isFinalistPremium
      }
    ];

    GFWheel.createWheel(container, items, function (chosen) {
      handleFinalPrize(chosen, p);
    });
  }

  function handleFinalPrize(prize, finalistUser) {
    const out = document.getElementById("final-result");
    if (!out) return;
    if (!prize) {
      out.textContent = "No prize selected.";
      return;
    }
    if (prize.key === "lifetime") {
      out.textContent = "Winner " + (finalistUser.username || "Unknown") + " gets Free Premium for Life.";
    } else if (prize.key === "year") {
      out.textContent = "Winner " + (finalistUser.username || "Unknown") + " gets Free Premium for a Year.";
    } else if (prize.key === "custom_mod") {
      out.textContent = "Winner " + (finalistUser.username || "Unknown") + " gets a Custom Mod added to their downloads.";
    } else {
      out.textContent = "Winner " + (finalistUser.username || "Unknown") + " gets " + prize.label + ".";
    }
  }

  function initAdminEventPage() {
    const user = GFUserTracking.loadUser();
    if (!GFUserTracking.isAdmin(user)) {
      const root = document.getElementById("admin-event-root");
      if (root) {
        root.textContent = "Admin only.";
      }
      return;
    }

    const round1Btn = document.getElementById("start-round1-btn");
    const round2Btn = document.getElementById("to-round2-btn");
    const finalBtn = document.getElementById("to-final-btn");

    if (round1Btn) {
      round1Btn.addEventListener("click", function () {
        buildRoundOne();
        round1Btn.disabled = true;
      });
    }

    if (round2Btn) {
      round2Btn.disabled = true;
      round2Btn.addEventListener("click", function () {
        buildRoundTwo();
        round2Btn.disabled = true;
      });
    }

    if (finalBtn) {
      finalBtn.disabled = true;
      finalBtn.addEventListener("click", function () {
        buildFinalWheel();
        finalBtn.disabled = true;
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAdminButton();
      if (document.getElementById("admin-event-root")) {
        initAdminEventPage();
      }
    });
  } else {
    initAdminButton();
    if (document.getElementById("admin-event-root")) {
      initAdminEventPage();
    }
  }
})();
