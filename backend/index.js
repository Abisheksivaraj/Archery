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

module.exports = app;
