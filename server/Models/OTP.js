const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const mailSender = require('../utils/mailSender');

const OTP = sequelize.define('OTP', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'otp',
    timestamps: true,
});

async function sendVerificationEmail(email, otp) {
    console.log(`Sending OTP to: ${email}`); // Debugging statement
    const emailContent = `
        <h1>OTP Verification</h1>
        <p>Dear User,</p>
        <p>Thank you for registering with MealExpanse And Resolution. To complete your registration, please use the following OTP
            (One-Time Password) to verify your account:</p>
        <h2 class="highlight">${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
    `;

    try {
        const mailResponse = await mailSender(email, "Verification Email", emailContent);
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}

OTP.addHook('afterCreate', async (otpInstance, options) => {
    console.log("New OTP document saved to database");
    console.log(`Sending OTP to: ${otpInstance.email}`); // Debugging statement
    await sendVerificationEmail(otpInstance.email, otpInstance.otp);
});

module.exports = OTP;
