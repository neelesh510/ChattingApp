const BASE_URL = 'http://localhost:4000/api/v1';

export const registrationEndPoints = {
    SENDOTP_API: BASE_URL + "/sendOtp",
    SIGNUP_API: BASE_URL + "/signup",
    LOGIN_API: BASE_URL + "/login",
}

export const MessagesEndPoints = {
    GET_ALL_CONTACT_API : BASE_URL + "/getAllUser",
    GET_ALL_MESSAGE_API : BASE_URL + "/getMessages"
}