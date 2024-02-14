const express = require("express");
const router = express.Router();
const attendance=require("../models/attendance");




router.post("/attendance", async (req, res) => {
    try {
      
      var data = await attendance.create(req.body);
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



  router.get("/attendance",async (req, res) => {
    try{
      var data=await attendance.find();

      res.json({
        statusCode:200,
        data:data,
        message:"retrive succesfully",
      });
    }
    catch(error){
      res.json({
        statusCode:500,
        message:error.message,
      });
    }   
  });

  
  
module.exports = router;