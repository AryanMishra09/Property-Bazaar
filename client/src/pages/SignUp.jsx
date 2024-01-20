// import React from 'react'
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import OAuth from "../components/OAuth";

function SignUp() {

  const [formData, setFormData] = useState({});

  const [error ,setError] = useState(null);

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await fetch("/api/auth/signup", 
      {
        method: "POST",
        headers:{
          "Content-type": "application/json",
        },
        body : JSON.stringify(formData),
      });

      const data = await res.json();

      console.log(data);

      if(data.success === false){
        setLoading(false);
        setError(data.message);
        return ;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in")
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }

    
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      
      <h1 className="text-4xl text-center font-bold my-10">
        SignUp
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <input 
          type="text" 
          id="username" 
          placeholder="Username"
          className="border p-4 rounded-lg" 
          onChange={handleChange}
        />

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
          {loading ? "loading..." : "Sign Up"}
        </button>    

        <button>
          <OAuth />
        </button>
      
      </form>

      <div className="flex gap-3 mt-5">
        <p>Have an account?</p>
          
        <Link to="/sign-in">
          <span className="text-blue-700">
            Sign in
          </span> 
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 flex flex-col">Error: {error}</p>}
    </div>
  )
}

export default SignUp;
