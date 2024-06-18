const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Message = sequelize.define('Message', {
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', // Assuming your User model is named 'Users' in MySQL
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', // Assuming your User model is named 'Users' in MySQL
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

// Define associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = Message;
