(function () {
  function initPremiumButton() {
    const btn = document.getElementById("premium-mode-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.location.href = "premium.html";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPremiumButton);
  } else {
    initPremiumButton();
  }
})();
