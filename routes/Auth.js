const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/users", (req, res) => {
  res.send("all user from database");
});

router.post("/createuser", async (req,res)=>{
  // const {name, email, password} = req.body;  //destructturing
  try {
    let user = await User.findOne({email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
      }
    user = await User.create({
      name: req.body.name, 
      email: req.body.email,
      password: req.body.password,
    });
    res.json({user});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error creating user" });
  }
})

module.exports = router;