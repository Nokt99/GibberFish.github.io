const express = require("express");
const store = require("../lib/store");

const router = express.Router();

router.post("/activate", (req, res) => {
  const body = req.body || {};
  if (!body.userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }
  const user = store.getUser(body.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  store.markPremium(body.userId);
  res.json({ ok: true, userId: body.userId });
});

router.get("/status/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = store.getUser(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    userId,
    isPremium: store.isPremium(userId)
  });
});

module.exports = router;
