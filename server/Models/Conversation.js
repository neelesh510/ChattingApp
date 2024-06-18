const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Message = require('./Message');
const User = require('./User');

const Conversation = sequelize.define('Conversation', {}, {
  tableName: 'conversations',
  timestamps: true
});

// Define associations
Conversation.belongsToMany(User, {
  through: 'UserConversations',
  as: 'participants',
  foreignKey: 'conversationId'
});
Conversation.belongsToMany(Message, {
  through: 'ConversationMessages',
  as: 'messages',
  foreignKey: 'conversationId'
});

module.exports = Conversation;
