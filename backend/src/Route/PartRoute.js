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


route.put("/editPart/:id", async (req, res) => {
  try {
    const { id } = req.params; // Use `id` here, not `_id`
    const { partName, quantity, partNo } = req.body;

    // Ensure that at least one field to update is provided
    if (!partName && quantity && partNo === undefined) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Find the part by its _id (or id)
    const part = await Part.findById(id); // Use findById here instead of findOne

    // If part is not found, return an error message
    if (!part) {
      return res.status(404).json({ message: "Part not found" });
    }

    // Update the part's information if fields are provided
    if (partName) {
      part.partName = partName;
    }
    if (partNo) {
      part.partNo = partNo;
    }
    if (quantity !== undefined) {
      part.quantity = quantity;
    }

    // Save the updated part
    await part.save();

    res.status(200).json({ message: "Part updated successfully", part });
  } catch (error) {
    console.error("Error editing part:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = route;
