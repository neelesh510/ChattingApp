const express = require('express');
const router = express.Router();

const { signup, sendOtp, login} = require('../controller/Auth');

router.post("/signup",signup);
router.post("/sendOtp",sendOtp);
router.post("/login",login);

module.exports = router;