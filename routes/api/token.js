const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const { body, validationResult } = require("express-validator");

const Token = require("../../models/Token");
const User = require("../../models/User");

const { mintNFT } = require("../../contractUtils/transact");

// @route   GET api/token
// @desc    Test route
// @access  Public
router.get("/:index", async (req, res) => {
  const index = req.params.index;

  try {
    let token = await Token.findOne({ index: index });
    if (token) {
      return res.send({
        description: token.description,
        external_url: token.external_url,
        image: token.image,
        name: token.name,
        attributes: token.attributes.map((x) => {
          return {
            trait_type: x.trait_type,
            value: x.value,
          };
        }),
      });
    } else {
      return res.send({});
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("server error");
  }
});

// @route   POST api/token
// @desc    Add token metadata to MongoDB
// @access  Public
router.post(
  "/mint/:address/id",
  [body("accessToken", "").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const address = req.params.address;
    const id = req.params.id;

    try {
      let token = await Token.findOne({ id });

      if (token) {
        return res
          .status(400)
          .json({ errors: [{ msg: "token already exists" }] });
      }

      const { accessToken } = req.body;
      const runs = await stravaAPI(accessToken, "/activities?per_page=30");

      // const index = await mintNFT(address);
      // if (!index) {
      //   return res
      //     .status(400)
      //     .json({ errors: [{ msg: "unable able to mint" }] });
      // }

      let background_color = "c2c2c2";
      if (attributes[0].value > 5000) {
        background_color = "f7693e";
      } else if (attributes[0].value >= 2500 && attributes[0].value < 5000) {
        background_color = "6078f0";
      } else if (attributes[0].value >= 1000 && attributes[0].value < 2500) {
        background_color = "94f7ab";
      }
      token = new Token({
        index,
        image,
        external_url,
        description,
        name,
        attributes,
        background_color,
      });

      await token.save();
      return res.send("Token Added");
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  }
);

function stravaAPI(token, path, body = {}, method = "get") {
  return rp("https://www.strava.com/api/v3/athlete" + path, {
    headers: {
      Authorization: "Bearer " + token,
    },
    json: body,
    method: method,
  });
}

module.exports = router;
