
// Define the POST route to create a new holiday
const express = require("express");
const router = express.Router();
const Holiday = require("../models/holiday");

router.post("/holidays", async (req, res) => {
  try {
    // Create a new holiday record using the data from the request body
    const newHoliday = new Holiday({
      holidaytype: req.body.holidaytype,
      date: req.body.date,
    });

    // Save the new holiday record to the database
    await newHoliday.save();

    // Respond with a success message and the created holiday object
    res.status(201).json(newHoliday);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the holiday record." });
  }
});



router.get("/holidays", async (req, res) => {
  try {
    // Fetch all holiday records from the database
    const holidays = await Holiday.find();

    // Respond with the array of holiday records
    res.status(200).json({
      statusCode: 200,
      message: "Holiday records retrieved successfully",
      holidays: holidays,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching holiday records." });
  }
});

router.get('/holidays/:year/:month', async (req, res) => {
  const { year, month } = req.params;

  try {
    const totalHolidays = await Holiday.countDocuments({
      date: {
        $regex: new RegExp(`^${year}-${month}-`),
      },
    });

    const filteredHolidays = await Holiday.find({
      date: {
        $regex: new RegExp(`^${year}-${month}-`),
      },
    });

    res.json({ year, month, totalHolidays, holidays: filteredHolidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





module.exports = router;
