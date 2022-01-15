const express = require("express");
const router = express.Router();

const Token = require("../../models/Token");

router.get("/global", async (req, res) => {
  const tokens = await helper(365 * 100);
  res.send(tokens);
});

router.get("/weekly", async (req, res) => {
  const tokens = await helper(7);
  res.send(tokens);
});

router.get("/daily", async (req, res) => {
  const tokens = await helper(1);
  res.send(tokens);
});

async function helper(offset) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - offset);

  const tokens = await Token.find({});

  const filtered = tokens.filter(
    (x) => new Date(x.attributes[2].value) >= minDate
  );

  const sorted = filtered
    .sort((a, b) => a.attributes[0].value - b.attributes[0].value)
    .reverse();

  return sorted;
}

module.exports = router;
