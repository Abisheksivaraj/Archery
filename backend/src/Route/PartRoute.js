const express = require("express");
const route = express.Router();
const Part = require("../models/PartModels");

route.post("/addPart", async (req, res) => {
  try {
    const { partName, partNo, quantity } = req.body;

    if (!partName || !partNo || !quantity) {
      return res.status(400).json({ message: "Enter the missing fields" });
    }

    const existingPart = await Part.findOne({ partNo });
    if (existingPart) {
      return res.status(400).json({ message: "Part number already exists" });
    }

    const newPart = new Part({
      partName,
      partNo,
      quantity,
    });

    await newPart.save();

    res.status(201).json({ message: "Part added successfully", part: newPart });
  } catch (error) {
    console.error("Error adding part:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



route.get("/getAllParts", async (req, res) => {
  try {
    // Retrieve all parts from the database
    const parts = await Part.find();

    // If no parts are found, return an appropriate message
    if (parts.length === 0) {
      return res.status(404).json({ message: "No parts found" });
    }

    // Return the list of parts
    res.status(200).json({ message: "Parts retrieved successfully", parts });
  } catch (error) {
    console.error("Error retrieving parts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = route;
