import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSignupData } from '../slices/authSlice';
import { sendotp } from '../services/operations/Auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : "",
  });

  const {name,email,password,confirmPassword} = formData;

  const changeHandler = (e) =>{
    setFormData((prevData) =>({
      ...prevData,
      [e.target.name] : e.target.value,
    }));
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = (e) =>{
    e.preventDefault();
    if(password!==confirmPassword){
      toast.error("Passwords are not matching");
      return ;
    }

    const signupData = {
      ...formData
    }

    dispatch(setSignupData(signupData));
    dispatch(sendotp(formData.email,navigate));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign Up</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name:</label>
            <input
              type="text"
              name='name'
              value={name}
              onChange={changeHandler}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={changeHandler}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={changeHandler}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
