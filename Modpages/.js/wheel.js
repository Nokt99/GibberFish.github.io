const GFWheel = (function () {
  function buildGradient(items) {
    let totalWeight = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].enabled !== false) {
        totalWeight += items[i].weight;
      }
    }
    if (totalWeight <= 0) totalWeight = 1;
    let current = 0;
    const parts = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.enabled === false) continue;
      const start = (current / totalWeight) * 360;
      const end = ((current + item.weight) / totalWeight) * 360;
      const color = item.color || randomColor(i);
      parts.push(color + " " + start + "deg " + end + "deg");
      current += item.weight;
    }
    return "conic-gradient(" + parts.join(",") + ")";
  }

  function randomColor(seed) {
    const base = (seed * 73) % 360;
    return "hsl(" + base + ", 80%, 55%)";
  }

  function pickItem(items) {
    let total = 0;
    const enabled = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].enabled === false) continue;
      enabled.push(items[i]);
      total += items[i].weight;
    }
    if (enabled.length === 0) return null;
    let r = Math.random() * total;
    for (let j = 0; j < enabled.length; j++) {
      const it = enabled[j];
      if (r < it.weight) return it;
      r -= it.weight;
    }
    return enabled[enabled.length - 1];
  }

  function createWheel(container, items, onResult) {
    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "gf-wheel-wrapper";

    const wheel = document.createElement("div");
    wheel.className = "gf-wheel";
    wheel.style.backgroundImage = buildGradient(items);

    const pointer = document.createElement("div");
    pointer.className = "gf-wheel-pointer";

    const label = document.createElement("div");
    label.className = "gf-wheel-label";
    label.textContent = "Ready";

    const button = document.createElement("button");
    button.className = "gf-wheel-spin-btn";
    button.textContent = "SPIN";

    wrapper.appendChild(wheel);
    wrapper.appendChild(pointer);
    wrapper.appendChild(label);
    wrapper.appendChild(button);
    container.appendChild(wrapper);

    let spinning = false;
    let currentRotation = 0;

    button.addEventListener("click", function () {
      if (spinning) return;
      const chosen = pickItem(items);
      if (!chosen) return;
      spinning = true;
      button.disabled = true;
      label.textContent = "Spinning...";
      const spins = 5 + Math.floor(Math.random() * 4);
      const targetAngle = computeTargetAngle(items, chosen);
      const finalRotation = spins * 360 + targetAngle;
      const start = currentRotation;
      const delta = finalRotation - start;
      const duration = 3000;
      const startTime = performance.now();

      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeOutCubic(t);
        const angle = start + delta * eased;
        wheel.style.transform = "rotate(" + angle + "deg)";
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          currentRotation = angle % 360;
          spinning = false;
          button.disabled = false;
          label.textContent = chosen.label;
          if (typeof onResult === "function") {
            onResult(chosen);
          }
        }
      }

      requestAnimationFrame(step);
    });
  }

  function computeTargetAngle(items, chosen) {
    let totalWeight = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].enabled !== false) {
        totalWeight += items[i].weight;
      }
    }
    if (totalWeight <= 0) totalWeight = 1;
    let current = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.enabled === false) continue;
      const start = (current / totalWeight) * 360;
      const end = ((current + item.weight) / totalWeight) * 360;
      if (item === chosen) {
        const mid = (start + end) / 2;
        return 360 - mid;
      }
      current += item.weight;
    }
    return 0;
  }

  function easeOutCubic(t) {
    const inv = 1 - t;
    return 1 - inv * inv * inv;
  }

  return {
    createWheel
  };
})();
