const express = require("express");
const router = express.Router();
const Latecount = require("../models/latecount");
const punching = require("../models/punching");
const Employee = require('../models/employee');

// Create a new note
// Create a new note
router.post('/latecounts', async (req, res) => {
    try {
      const { punchintime, punchouttime ,mobileNo} = req.body;
  
      const latecount = new Latecount({
        punchintime,
        punchouttime,
        mobileNo,
      });
  
      await latecount.save();
  
      res.status(201).json({
        statusCode: 201,
        message: 'Latecount saved successfully',
        latecount,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
  
  
  router.put('/latecounts/:mobileNo', async (req, res) => {
    const mobileNo = req.params.mobileNo;
  
    try {
      const { punchintime, punchouttime } = req.body;
  
      // Find the latecount document by mobileNo
      const latecount = await Latecount.findOne({ mobileNo });
  
      if (!latecount) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Latecount not found',
        });
      }
  
      // Update the latecount properties
      latecount.punchintime = punchintime;
      latecount.punchouttime = punchouttime;
  
      // Save the updated latecount
      await latecount.save();
  
      res.status(200).json({
        statusCode: 200,
        message: 'Latecount updated successfully',
        latecount,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
  


  
  router.get('/latecoun/:date', async (req, res) => {
    try {
        const targetDate = new Date(req.params.date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(targetDate.getDate() + 1); // Get records until the next day

        // Get all "Punch In" records for the specified date
        const punchingRecords = await punching.find({
            status: "Punch in",
            attendandanceDate: {
                $gte: targetDate,
                $lt: nextDate,
            },
        });

        console.log("punchingRecords", punchingRecords);

        // Filter "Punch In" records with punch in time after 9 AM
        const latePunchInRecords = punchingRecords.filter((record) => {
            const punchInDateTime = new Date(record.attendandanceDate);
            punchInDateTime.setHours(...record.attendandanceTime.split(':').map(Number));

            return punchInDateTime > new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 9, 0, 0, 0);
        });

        // Fetch employee names from the "Employee" collection
        const employeeNames = await Employee.find({
            mobileNo: { $in: latePunchInRecords.map((record) => record.mobileNo) },
        });

        // Create a mapping of mobile numbers to employee names
        const mobileToNameMap = {};
        employeeNames.forEach((employee) => {
            mobileToNameMap[employee.mobileNo] = employee.name;
        });

        // Combine the "Punch In" records with employee names
        const combinedRecords = latePunchInRecords.map((attendanceRecord) => {
            return {
                status: attendanceRecord.status,
                attendandanceTime: attendanceRecord.attendandanceTime,
                name: mobileToNameMap[attendanceRecord.mobileNo] || "N/A",
            };
        });

        // Count of late entries for the specific date
        const lateCount = combinedRecords.length;

        res.status(200).json({
            statusCode: 200,
            message: 'Punch In records retrieved successfully',
            attendanceRecords: combinedRecords,
            lateCount: lateCount,
        });
    } catch (error) {
        // Log the error for debugging
        console.error(error);

        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
});




router.get('/compareLateCount', async (req, res) => {
  try {
    // Retrieve punch-in records from the punching collection
    const punchInRecords = await punching.find({ status: 'Punch In' });
    
    // Retrieve punch-in time limit from the latecount collection
    const lateCount = await Latecount.findOne({});
    const punchInTimeLimit = lateCount.punchintime;

    // Debug log to check the retrieved values
    console.log('Punch In Records:', punchInRecords);
    console.log('Punch In Time Limit:', punchInTimeLimit);

    // Filter late punch-in records
    const latePunchInRecords = punchInRecords.filter((record) => {
      const punchInTime = record.attendandanceTime;
      console.log('Comparing Punch In Time:', punchInTime, 'with Limit:', punchInTimeLimit);
      return punchInTime < punchInTimeLimit;
    });

    console.log('Late Punch In Records:', latePunchInRecords);

    const totalLatePunchIns = latePunchInRecords.length;

    res.status(200).json({
      statusCode: 200,
      message: 'Comparison of late punch-ins based on latecount punchintime',
      data: {
        totalLatePunchIns,
        latePunchInRecords,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

   

  
module.exports = router;