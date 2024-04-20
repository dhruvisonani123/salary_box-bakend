const express = require("express");
const router = express.Router();
const Punching = require("../models/punching");
const punching = require("../models/punching");
const Employee = require('../models/employee');
const leave = require("../models/leave");
const Latecount = require("../models/latecount");






router.get("/punching/:mobileNo", async (req, res) => {
  try {
    const mobileNo = req.params.mobileNo;

    const results = await punching.find({ mobileNo: mobileNo });

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});


router.post("/attandance", async (req, res) => {
  try {
    
    var data = await punching.create(req.body);
    console.log("data kdslda",data)
    res.json({
      statusCode: 200,
      data: data,
      message: "Add  Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get api for






router.get("/leavestats/:empid", async (req, res) => {
  try {
    // Extract the empid from the request parameters
    const { empid } = req.params;
    // Count the number of leave requests for each leave type
    const privilegeLeaveCount = await leave.countDocuments({
      empid,
      leavetype: "Privileged leave",
    });
    const sickLeaveCount = await leave.countDocuments({
      empid,
      leavetype: "Sick Leave",
    });
    const casualLeaveCount = await leave.countDocuments({
      empid,
      leavetype: "casual",
    });
    // Return the leave statistics in the response
    res.status(200).json({
      statusCode: 200,
      privilegeLeaveCount,
      sickLeaveCount,
      casualLeaveCount,
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




router.get("/attandance/:mobileNumber/:fromDate/:toDate", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const fromDate = new Date(req.params.fromDate);
    const toDate = new Date(req.params.toDate);
    console.log("mobileNumber", mobileNumber);
    // Use Mongoose to find "Punch in" and "Punch out" records within the date range
    const punchInRecords = await punching.find({
      mobileNo: mobileNumber,
      attendandanceDate: {
        $gte: fromDate,
        $lte: toDate,
      },
      status: "Punch in",
    });
    console.log("punchInRecords", punchInRecords);
    const punchOutRecords = await punching.find({
      mobileNo: mobileNumber,
      attendandanceDate: {
        $gte: fromDate,
        $lte: toDate,
      },
      status: "Punch out",
    });
    console.log("punchOutRecords", punchOutRecords);
    // Create an object to store total times for each day
    const totalTimes = {};
    // Iterate through "Punch in" records and calculate total times
    for (const punchIn of punchInRecords) {
      const punchOut = punchOutRecords.find(
        (punchOut) =>
          punchOut.mobileNo === punchIn.mobileNo &&
          punchOut.attendandanceDate.toISOString() === punchIn.attendandanceDate.toISOString()
      );
      if (punchOut) {
        const punchInTime = new Date(punchIn.attendandanceDate);
        punchInTime.setHours(...punchIn.attendandanceTime.split(':'));
        const punchOutTime = new Date(punchOut.attendandanceDate);
        punchOutTime.setHours(...punchOut.attendandanceTime.split(':'));
        // Calculate the time difference for the day in milliseconds
        const timeDifference = punchOutTime - punchInTime;
        // Add the time difference to the corresponding day's total
        if (totalTimes[punchIn.attendandanceDate.toISOString()]) {
          totalTimes[punchIn.attendandanceDate.toISOString()] += timeDifference;
        } else {
          totalTimes[punchIn.attendandanceDate.toISOString()] = timeDifference;
        }
      }
    }
    // Convert total times to hours, minutes, and seconds
    const formattedTotalTimes = {};
    let totalMillisecondsSum = 0;
    for (const [date, timeDifference] of Object.entries(totalTimes)) {
      const totalMilliseconds = timeDifference;
      totalMillisecondsSum += totalMilliseconds;
      const totalSeconds = Math.floor(totalMilliseconds / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      formattedTotalTimes[date] = `${totalHours}:${totalMinutes % 60}:${totalSeconds % 60}`;
    }
    // Calculate the sum of all total times
    const totalSecondsSum = Math.floor(totalMillisecondsSum / 1000);
    const totalMinutesSum = Math.floor(totalSecondsSum / 60);
    const totalHoursSum = Math.floor(totalMinutesSum / 60);
    const totalHours = `${totalHoursSum}:${totalMinutesSum % 60}:${totalSecondsSum % 60}`;
    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(Math.abs((toDate - fromDate) / oneDay)) + 1;
    
    res.status(200).json({
      statusCode: 200,
      message: "Total times between selected dates",
      data: {
        individualTotals: formattedTotalTimes,
        totalHours: totalHours,
        totalDays:totalDays,
        
      },
    });
  } catch (error) {
    console.error("Error:", error); // Log the error
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});



    



router.get('/matching-mobiles/:date', async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);
    // Find mobile numbers and names in the 'employee' collection
    const employees = await Employee.find({}, 'mobileNo fname');
    // Find mobile numbers in the 'punching' collection for the selected date
    const punchMobiles = await Punching.distinct('mobileNo', {
      attendandanceDate: selectedDate,
    });
    console.log
    // Find mobile numbers that are present in both collections
    const matchingEmployees = employees.filter((employee) => punchMobiles.includes(employee.mobileNo));
    const mismatchedEmployees = employees.filter((employee) => !punchMobiles.includes(employee.mobileNo));
    const presentData = matchingEmployees.map((employee) => ({
      fname: employee.fname,
      mobileNo: employee.mobileNo,
    }));
    const absentData = mismatchedEmployees.map((employee) => ({
      fname: employee.fname,
      mobileNo: employee.mobileNo,
    }));
    // Extract punch in and punch out times for present employees
    const punchData = await Punching.find({
      attendandanceDate: selectedDate,
      mobileNo: { $in: matchingEmployees.map((employee) => employee.mobileNo) },
    });
    const presentWithAttendance = matchingEmployees.map((employee) => {
      const employeePunchData = punchData.find((punch) => punch.mobileNo === employee.mobileNo);
      if (employeePunchData) {
        return {
          fname: employee.fname,
          mobileNo: employee.mobileNo,
          punchIn: employeePunchData.attendandanceTime,
          punchOut: punchData.find((punch) => punch.mobileNo === employee.mobileNo && punch.status === 'Punch Out')
            ?.attendandanceTime,
        };
      }
      return null;
    });
    const presentWithPunchTimes = presentWithAttendance.filter((employee) => employee !== null);
    const present = presentWithPunchTimes.length;
    const absent = absentData.length;
    res.status(200).json({
      statusCode: 200,
      message: `Mobile numbers, names, and attendance times present in both "employee" and "punching" collections for the date ${selectedDate.toISOString()}`,
      data: {
        present: {
          count: present,
          employees: presentWithPunchTimes,
          presentData:presentData,
        },
        absent: {
          count: absent,
          employees: absentData,
       
        },
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



router.get('/employee-punch-records/:mobileNo/:year/:month', async (req, res) => {
  try {
    const { mobileNo, year, month } = req.params;
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const currentDate = new Date();
    const lastDayOfMonth = new Date(year, month - 1, currentDate.getDate(), 23, 59, 59);
    const presentDays = await Punching.distinct('attendandanceDate', {
      mobileNo,
      attendandanceDate: { $gte: firstDayOfMonth, $lte: currentDate }, // Updated condition
      status: 'Punch in',
    });
    const totalDaysInMonth = currentDate.getDate(); // Use the current date
    const absentDays = totalDaysInMonth - presentDays.length;
    res.status(200).json({
      statusCode: 200,
      message: `Punch in records for ${mobileNo} in ${year}-${month}`,
      data: {
        presentDays: presentDays.length,
        absentDays: absentDays,
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




