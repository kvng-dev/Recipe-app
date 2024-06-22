const { signup, login } = require("../controllers/user.controller");
const express = require("express");
const { validateLogin, validateSignup } = require("../validators/auth");
const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

module.exports = router;
