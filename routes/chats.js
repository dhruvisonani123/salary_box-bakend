const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");

// Create a new chat message
router.post("/adminchat", async (req, res) => {
  try {
    // Extract the chat message text frosm the request body
    const { addchat, date, empid } = req.body;

    // Create a new chat message using the Chat model
    const newChatMessage = new Chat({
      addchat,
      date,
      empid,
    });

    // Save the new chat message to the database
    await newChatMessage.save();

    res.status(201).json({
      statusCode: 201,
      message: "Chat message created successfully",
      chatMessage: newChatMessage,
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


router.get("/adminchat", async (req, res) => {
  try {
    // Retrieve all chat messages from the database
    const chatMessages = await Chat.find();

    res.status(200).json({
      statusCode: 200,
      message: "Chat messages retrieved successfully",
      chatMessages,
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
