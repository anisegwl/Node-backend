const express = require("express");
const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/Fetchuser");
const Product = require("../model/Product");

const secret = process.env.SECRET;

router.get("/users", (req, res) => {
  res.send("all user from database");
});

router.post(
  "/createuser",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("name must be atleast 3 character"),
    body("email").isEmail().withMessage("invalid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("passsword must be atleast 5 character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send({ message: "user already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);
      // console.log(authToken);

      res.json({ user, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error");
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("passsword must be atleast 5 character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ message: "email not register" });
      }
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        return res.status(400).send({ message: "invalid password" });
      }
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, secret);
      res.json({ user, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("internal server error");
    }
  }
);

//user detail
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
});

module.exports = router;