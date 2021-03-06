const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const rp = require("request-promise");

const Token = require("../../models/Token");

router.post(
  "/activities",
  [body("accessToken", "").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accessToken } = req.body;

    try {
      const runs = await stravaAPI(accessToken, "/activities?per_page=30");
      const user = await stravaAPI(accessToken, "");
      const clean = runs.map((x) => {
        return {
          id: x.id,
          image:
            "https://www.mapquestapi.com/staticmap/v5/map?key=5CwVm7auP5lj4DAbzS2AVhyAFtM3vevI&shape=cmp%7Cenc:" +
            x.map.summary_polyline,
          external_url: "idk",
          description: x.name,
          name: x.distance + "m run",
          attributes: [
            {
              trait_type: "distance",
              value: x.distance,
            },
            {
              trait_type: "duration",
              value: x.elapsed_time,
            },
            {
              trait_type: "date",
              value: x.start_date,
            },
            {
              trait_type: "firstname",
              value: user.firstname,
            },
            {
              trait_type: "lastname",
              value: user.lastname,
            },
          ],
        };
      });

      const tokens = await Token.find({});
      const urls = new Set(tokens.map((x) => x.image));

      const mark = clean.map((x) => ({
        isMinted: urls.has(x.image),
        runMetaData: x,
      }));

      return res.send(mark);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error");
    }
  }
);

router.post("/useractivity", async (req, res) => {
  const { accessToken } = req.body;
  try {
    const user = await stravaAPI(accessToken, "");
    const runs = await stravaAPI(accessToken, "/activities?per_page=30");
    let response = {
      firstname: user.firstname,
      lastname: user.lastname,
      weight: user.weight,
      city: user.city,
      state: user.state,
      country: user.country,
      gender: user.sex,
      activities: runs,
    };

    return res.send(response);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});


router.post("/useractivitylist", async (req, res) => {
  const { accessToken } = req.body;
  try {
    const runs = await stravaAPI(accessToken, "/activities?per_page=30");
    let response = runs;

    return res.send(response);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
});

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
