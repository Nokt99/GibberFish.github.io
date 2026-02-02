const GFUserTracking = (function () {
  const USER_KEY = "gf_user";
  const PARTICIPANTS_PREFIX = "gf_event_participants_";
  const LINKS_PREFIX = "gf_premium_links_";
  const ADMIN_EMAIL = "zakariyah6204@mytusd.org";

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function getCurrentPeriodKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return year + "_" + (month < 10 ? "0" + month : month);
  }

  function loadUser() {
    return safeParse(localStorage.getItem(USER_KEY), null);
  }

  function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function ensureUserSession(user) {
    if (!user) return;
    const periodKey = getCurrentPeriodKey();
    const participantsKey = PARTICIPANTS_PREFIX + periodKey;
    const participants = safeParse(localStorage.getItem(participantsKey), {});
    if (!participants[user.id]) {
      participants[user.id] = {
        id: user.id,
        username: user.username || null,
        provider: user.provider || null,
        firstSeenAt: Date.now()
      };
      localStorage.setItem(participantsKey, JSON.stringify(participants));
    } else {
      participants[user.id].username = user.username || participants[user.id].username;
      participants[user.id].provider = user.provider || participants[user.id].provider;
      participants[user.id].lastSeenAt = Date.now();
      localStorage.setItem(participantsKey, JSON.stringify(participants));
    }
  }

  function markPremium(user) {
    if (!user) return;
    user.isPremium = true;
    saveUser(user);
  }

  function isPremium(user) {
    return !!(user && user.isPremium);
  }

  function isAdmin(user) {
    if (!user) return false;
    if (!user.email) return false;
    return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }

  function getParticipantsForCurrentPeriod() {
    const periodKey = getCurrentPeriodKey();
    const participantsKey = PARTICIPANTS_PREFIX + periodKey;
    return safeParse(localStorage.getItem(participantsKey), {});
  }

  function getPremiumLinksForCurrentPeriod() {
    const periodKey = getCurrentPeriodKey();
    const linksKey = LINKS_PREFIX + periodKey;
    return safeParse(localStorage.getItem(linksKey), {});
  }

  function savePremiumLinkForCurrentPeriod(user, link) {
    if (!user || !user.id) return;
    const periodKey = getCurrentPeriodKey();
    const linksKey = LINKS_PREFIX + periodKey;
    const links = safeParse(localStorage.getItem(linksKey), {});
    links[user.id] = {
      id: user.id,
      username: user.username || null,
      link: link,
      submittedAt: Date.now()
    };
    localStorage.setItem(linksKey, JSON.stringify(links));
  }

  function initSession() {
    const user = loadUser();
    if (user) {
      ensureUserSession(user);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSession);
  } else {
    initSession();
  }

  return {
    loadUser,
    saveUser,
    markPremium,
    isPremium,
    isAdmin,
    getParticipantsForCurrentPeriod,
    getPremiumLinksForCurrentPeriod,
    savePremiumLinkForCurrentPeriod
  };
})();
