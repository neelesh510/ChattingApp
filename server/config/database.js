const { Sequelize } = require('sequelize');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize('chat_app_db', 'Neelesh', '12345', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
