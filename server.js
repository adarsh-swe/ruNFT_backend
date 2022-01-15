const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

//init middleware
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

//routes
app.use("/api/token", require("./routes/api/token"));
app.use("/api/leaders", require("./routes/api/leaders"));
app.use("/api/strava", require("./routes/api/strava"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on PORT=${PORT}`);
});
