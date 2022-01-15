const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const Token = require("../../models/Token");
const User = require("../../models/User");

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get("/", (req, res) => res.send("Token route"));
router.post(
  "/",
  [
    body("image", "").not().isEmpty(),
    body("external_url", "").not().isEmpty(),
    body("description", "").not().isEmpty(),
    body("name", "").not().isEmpty(),
    body("attributes", "").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { image, external_url, description, name, attributes } = req.body;
    try {
      let token = await Token.findOne({ image });

      if (token) {
        res.status(400).json({ errors: [{ msg: "token already exists" }] });
      }

      let background_color = "c2c2c2";
      if (attributes[0].distance > 5000) {
        background_color = "f7693e";
      } else if (
        attributes[0].distance >= 2500 &&
        attributes[0].distance < 5000
      ) {
        background_color = "6078f0";
      } else if (
        attributes[0].distance >= 1000 &&
        attributes[0].distance < 2500
      ) {
        background_color = "94f7ab";
      }
      token = new Token({
        image,
        external_url,
        description,
        name,
        attributes,
        background_color,
      });

      await token.save();
      res.send("Token Added");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
