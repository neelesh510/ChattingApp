const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { setupSocket } = require("./socket/socket");
const sequelize = require('./config/database');
const userRoutes = require('./routes/User');
const MessageRoutes = require("./routes/Message");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = setupSocket(server);
module.exports = {server,io};

// Use user routes
app.use("/api/v1", userRoutes);
app.use("/api/v1",MessageRoutes);
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is running...'
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all defined models to the DB
    await sequelize.sync({ alter: true }); // Use { alter: true } in production to update the table structure without dropping it
    console.log("All models were synchronized successfully.");

    // Start the server
    server.listen(PORT, () => {
      console.log(`App is running at ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing the database connection:', error);
    process.exit(1);
  }
});
