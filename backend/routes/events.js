const express = require("express");
const store = require("../lib/store");

const router = express.Router();

router.get("/participants/current", (req, res) => {
  const participants = store.getParticipantsForCurrentPeriod();
  res.json(participants);
});

router.get("/links/current", (req, res) => {
  const links = store.getPremiumLinksForCurrentPeriod();
  res.json(links);
});

router.post("/links/submit", (req, res) => {
  const body = req.body || {};
  if (!body.userId || !body.link) {
    res.status(400).json({ error: "userId and link are required" });
    return;
  }
  if (!store.isPremium(body.userId)) {
    res.status(403).json({ error: "Premium required" });
    return;
  }
  store.savePremiumLink(body.userId, body.link);
  res.json({ ok: true });
});

module.exports = router;
