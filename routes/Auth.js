const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchuser");
const Product = require("../model/Product");

const secret = process.env.SECRET;


// Dummy route (can be improved to return real users)
router.get("/users", (req, res) => {
  res.send("all user from database");
});


// User registration route
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // JWT token
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);

      // Respond with token and success message
      res.json({ user, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return validation errors
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
      const passwordCompare = await bcrypt.compare(req.body.password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);
      res.json({ user, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  });

  //user detail
  router.get("/getuser", fetchUser, async (req, res) => {
    try {
      userId = req.user.id //middleware variable
      const user = await User.findById(userId).select("-password");
      if(!user){
        return res.status(404).json({msg:"User not found"})
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error" });
    }

  })

module.exports = router;
