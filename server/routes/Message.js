const express = require('express');
const router = express.Router();

const { sendMessage, getAllUsers, getMessages } = require("../controller/Message");

router.post("/sendMessage/:receiverId", sendMessage);
router.get("/getMessages/:receiverId",getMessages)
router.get("/getAllUser",getAllUsers);

module.exports = router;