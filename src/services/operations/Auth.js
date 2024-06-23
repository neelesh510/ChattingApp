import { backendConnector } from "../backendConnector";
import { registrationEndPoints } from "../backendRoutes";
import { setToken, setUser } from "../../slices/authSlice" 
import toast from "react-hot-toast";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API
} = registrationEndPoints;

export function sendotp(email, navigate) {
  return async () => {
    const toastId = toast.loading("Loading...");
    try {
      // console.log("Data coming in authApi",email);
      console.log(SENDOTP_API);
      const response = await backendConnector(
        "POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      }
      );
      console.log("SendOTP API response.. ", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP Sent Successfully");
      navigate("/verifyEmail");
    } catch (error) {
      console.log("Error in sendOtp API", error);
      toast.error("Could not send OTP");
    }
    toast.dismiss(toastId);
  }
}

export function signup(
  name,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async () => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await backendConnector("POST", SIGNUP_API, {

        name,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    toast.dismiss(toastId)
  }
}


export function login(email, password, navigate){
  return async(dispatch) =>{
    const toastId = toast.loading("Loading...")
    try {
      const response = await backendConnector("POST", LOGIN_API, {
        email,
        password
      });

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Login Successful")
      dispatch(setToken(response.data.token));
      localStorage.setItem("token",JSON.stringify(response.data.token));
      localStorage.setItem("user",JSON.stringify(response.data.user));
      navigate("/");

    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    toast.dismiss(toastId)
  }
}