import toast from "react-hot-toast";
import { backendConnector } from "../backendConnector";
import { MessagesEndPoints } from "../backendRoutes";

const {
    GET_ALL_CONTACT_API,
    GET_ALL_MESSAGE_API,
    SEND_MESSAGE_API
} = MessagesEndPoints;

export const showContacts = async (token) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await backendConnector(
            "GET",
            GET_ALL_CONTACT_API,
            {
                token,
            },
            {
                Authorization: `Bearer ${token}`
            }
        );
        console.log(response);
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Item")
        }
        result = response?.data.data;
    } catch (error) {
        console.log("show contacts api error...", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const getMessages = async (token, receiverId) => {
    const toastId = toast.loading("Loading...");
    // console.log("Receiver id is ",receiverId);
    let result = [];
    try {
        const response = await backendConnector(
            "GET",
            `http://localhost:4000/api/v1/getMessages/${receiverId}`,
            {
                token,
            },
            {
                Authorization: `Bearer ${token}`
            }
        );
        console.log(response);
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Item")
        }
        result = response?.data.data;
    } catch (error) {
        console.log("show contacts api error...", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const sendMessageToDb = async (token, message, receiverId) => {
    console.log(message);
        const toastId = toast.loading("Loading...");
        try {
            // console.log("Data coming in authApi",email);
            //   console.log(SENDOTP_API);
            const response = await backendConnector(
                "POST", 
                `http://localhost:4000/api/v1/sendMessage/${receiverId}`, 
                {
                    token,
                    message
                },
                {

                },
                {
                    receiverId
                }
            );
            console.log("SEND_MESSAGE_API response.. ", response);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            //   toast.success("OTP Sent Successfully");
            //   navigate("/verifyEmail");
        } catch (error) {
            console.log("Error in sendMessage API", error);
            toast.error("Could not send Message");
        }
        toast.dismiss(toastId);
}