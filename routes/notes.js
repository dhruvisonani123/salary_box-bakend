const express = require("express");
const router = express.Router();
const Notes = require("../models/notes");

// Create a new note
// Create a new note
router.post("/notes", async (req, res) => {
    try {
      // Extract the note text from the request body
      const { addnote } = req.body;
  
      // Create a new note using the Notes model
      const newNote = new Notes({
        addnote,
      });
  
      // Save the new note to the database
      await newNote.save();
  
      res.status(201).json({
        statusCode: 201,
        message: "Note created successfully",
        note: newNote,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  });




  
  

module.exports = router;