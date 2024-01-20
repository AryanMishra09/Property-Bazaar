// import React from 'react'

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {

  const [formData, setFormData] = useState({});

  const {loading, error} = useSelector((state) => state.user)

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    });
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", 
      {
        method: "POST",
        headers:{
          "Content-type": "application/json",
        },
        body : JSON.stringify(formData),
      });

      const data = await res.json();

      // console.log(data);

      if(data.success === false){
        dispatch(signInFailure(data.message));
        return ;
      }
      dispatch(signInSuccess(data));
      navigate("/")
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message));
    }

    
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      
      <h1 className="text-4xl text-center font-bold my-10">
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <input 
          type="email" 
          id="email" 
          placeholder="Email"
          className="border p-4 rounded-lg" 
          onChange={handleChange}
        />

        <input 
          type="password" 
          id="password" 
          placeholder="Password"
          className="border p-4 rounded-lg" 
          onChange={handleChange}
        />   

        <button disabled={loading} className="bg-slate-700 text-white p-4 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? "loading..." : "Login"}
        </button>    

        <OAuth />
      
      </form>

      <div className="flex gap-3 mt-5">
        <p>Do not have an account?</p>
          
        <Link to="/sign-up">
          <span className="text-blue-700">
            Signup
          </span> 
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 flex flex-col">Error: {error}</p>}
    </div>
  )
}

export default SignIn
