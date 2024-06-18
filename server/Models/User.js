const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id : {
    type : DataTypes.STRING,
    primaryKey : true,
    allowNull : false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING
  }
}, {
  tableName : 'users',
  timestamps: true
});

module.exports = User;
