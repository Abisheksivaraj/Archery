const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Welcome" });
});

const adminRoute = require("./src/Route/AdminRoute");
app.use(adminRoute);

const partRoutes = require("./src/Route/PartRoute");
app.use(partRoutes);

const userRoutes = require("./src/Route/UserRoute");
app.use(userRoutes);

let counts = {
  totalPartCount: 0,
  totalPackageCount: 0,
};

app.get("/getCounts", (req, res) => {
  res.status(200).json(counts);
});

app.get("/getTotalPartCount", (req, res) => {
  res.status(200).json({ totalPartCount: counts.totalPartCount });
});

app.get("/getTotalPackageCount", (req, res) => {
  res.status(200).json({ totalPackageCount: counts.totalPackageCount });
});

app.post("/saveCounts", (req, res) => {
  const { totalPartCount, totalPackageCount } = req.body;

  if (
    typeof totalPartCount === "number" &&
    typeof totalPackageCount === "number"
  ) {
    counts.totalPartCount = totalPartCount;
    counts.totalPackageCount = totalPackageCount;
    res.status(200).json({ message: "Counts saved successfully", counts });
  } else {
    res.status(400).json({ message: "Invalid data provided" });
  }
});

module.exports = app;
