const bcrypt = require("bcryptjs");
const validator = require("express-validator");
const User = require("../model/user.model");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// @desc register new user controller logic
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if the email is unique
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exist!" });
    }

    // 2. Create new user
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hash,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User registration successfull",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    logger.error("Error Occured in signup controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

// @desc login user controller logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Invalid Email or Password`,
      });
    }

    // check if password is correct with the one in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Email or Password" });
    }

    // generate token as cookie
    const accessToken = await jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 600 * 5,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      },
    });
  } catch (error) {
    logger.error("Error occured in login controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
};
