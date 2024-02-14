const express = require("express");
const router = express.Router();
const Document = require("../models/document");

router.post("/documents", async (req, res) => {
    try {
      // Create a new document based on the request body
      const newDocument = new Document({
        adddocument: req.body.adddocument, // Assuming the request has a "adddocument" field
      });
  
      // Save the document to the database
      const savedDocument = await newDocument.save();
  
      res.status(201).json(savedDocument);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while saving the document." });
    }
  });

  router.get("/documents", async (req, res) => {
    try {
      // Retrieve all documents from the database
      const documents = await Document.find(); // Assuming you have a "Document" model
  
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while retrieving documents." });
    }
  });

module.exports = router;
