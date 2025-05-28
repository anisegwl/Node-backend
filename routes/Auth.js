const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("all user from database");
});

module.exports = router;