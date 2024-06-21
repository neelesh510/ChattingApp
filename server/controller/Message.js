const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const User = require("../Models/User");
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const { io } = require("../index");
require("dotenv").config();


// exports.sendMessage = async (req, res) => {
//   try {
//     const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token is missing",
//       });
//     }

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     const senderId = decode.id;
//     const senderUser = await User.findByPk(senderId);
//     if (!senderUser) {
//       return res.status(404).json({
//         success: false,
//         message: "SenderId not found"
//       });
//     }

//     const receiverId = req.params.receiverId;
//     const { message } = req.body;

//     // Check if conversation already exists between sender and receiver
//     let conversation = await Conversation.findOne({
//       where: {
//         [Op.or]: [
//           {
//             participants: {
//               [Op.like]: `%${senderId}%`
//             },
//             participants: {
//               [Op.like]: `%${receiverId}%`
//             }
//           },
//           {
//             participants: {
//               [Op.like]: `%${receiverId}%`
//             },
//             participants: {
//               [Op.like]: `%${senderId}%`
//             }
//           }
//         ]
//       }
//     });

//     // If conversation doesn't exist, create a new one
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId]
//       });
//     }

//     // Create the new message
//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       message
//     });

//     // Associate the message with the conversation
//     await conversation.addMessage(newMessage);

//     // Emit the message to the receiver
//     io.to(conversation.id).emit('receiveMessage', newMessage);

//     return res.status(201).json({
//       success: true,
//       message: newMessage
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



exports.sendMessage = async (req, res) => {
  try {
    // Retrieve the token and decode it to get the sender ID
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decode.id;

    // Find the sender user to ensure it exists
    const senderUser = await User.findByPk(senderId);
    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: "SenderId not found"
      });
    }

    // Extract receiverId from request params
    const receiverId = req.params.receiverId; // Assuming receiverId is correctly provided in the URL as /sendMessage/:id

    // Ensure receiver exists (optional check)
    const receiverUser = await User.findByPk(receiverId);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "ReceiverId not found"
      });
    }

    // Find or create a conversation between sender and receiver
    let chat = await Conversation.findOne({
      include: [
        {
          model: User,
          as: 'participants',
          where: {
            id: senderId
          }
        },
        {
          model: User,
          as: 'participants',
          where: {
            id: receiverId // Ensure receiverId is defined and valid
          }
        }
      ]
    });

    if (!chat) {
      chat = await Conversation.create();
      await chat.addParticipants([senderUser, receiverId]); // Add participants to the conversation
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: req.body.message // Assuming message is sent in the request body
    });

    // Add the message to the conversation
    await chat.addMessage(newMessage);

    // // Emit the message to the receiver?
    // io.to(chat.id).emit('receiveMessage', newMessage);

    return res.status(201).json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decode.id;

    // Query messages where senderId or receiverId matches
    const receiverId = req.params.receiverId;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }, // To fetch both sides of the conversation
        ],
      },
      order: [['createdAt', 'ASC']], // Order messages by createdAt
    });

    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Cannot fetch messages',
      error: error.message,
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    return res.status(200).json({
      success: true,
      message: "Fetched users successfully",
      data: allUsers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch Users",
      error: error.message
    });
  }
};