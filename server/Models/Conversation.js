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

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const User = require('./User');
// const Message = require('./Message');

// const Conversation = sequelize.define('Conversation', {
//   senderId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: 'Users',
//       key: 'id'
//     }
//   },
//   receiverId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: 'Users',
//       key: 'id'
//     }
//   }
// }, {
//   tableName: 'conversations',
//   timestamps: true
// });

// // Define associations
// Conversation.hasMany(Message, { foreignKey: 'conversationId' });
// Conversation.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
// Conversation.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

// module.exports = Conversation;
