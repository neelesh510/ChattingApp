const User = require('../Models/User');
const bcrypt = require("bcrypt");
const OTP = require("../Models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.signup = async(req,res) =>{
    try{
        const {
            id,name,email,password,confirmPassword,otp
        } = req.body;
        if(!id || !name || !email || !password || !confirmPassword || !otp){
            return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
        };
        if(password!==confirmPassword){
            return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
        };
        const existingUser = await User.findOne({ where: { email } });
        if(existingUser){
            return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
        };
        //Find the most recent OTP for the email
        // Find the most recent OTP for the email
        const latestOTP = await OTP.findOne({ where: { email }, order: [['createdAt', 'DESC']] });
        if (!latestOTP || otp !== latestOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            id,
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
			success: true,
			newUser,
			message: "User registered successfully",
		});

    }catch(error){
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
    };
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user is already registered
        const isUserPresent = await User.findOne({ where: { email } });
        if (isUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Ensure OTP is unique
        let existingOtp = await OTP.findOne({ where: { otp } });
        while (existingOtp) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            existingOtp = await OTP.findOne({ where: { otp } });
        }

        // Store OTP in database
        await OTP.create({ email, otp });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please fill up all the required fields`,
            });
        }

        // Find user with provided email
        const user = await User.findOne({ where: { email } });

        // If user not found with provided email
        if (!user) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is not registered with us. Please sign up to continue.`,
            });
        }

        // Generate JWT token and compare password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user.id, UserType: user.UserType },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            // Save token to user document in database
            await User.update({ token }, { where: { email } });

            // Remove password from user object before sending response
            user.password = undefined;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token : token,
                user,
                message: `User login success`,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        console.error(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login failure. Please try again.`,
        });
    }
};