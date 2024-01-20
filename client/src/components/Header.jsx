/* eslint-disable react-hooks/exhaustive-deps */
// import React from 'react'
import {FaSearch} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

export default function Header() {

    const {currentUser} = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        //this will make the url params as searched in the search-bar:
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`search?${searchQuery}`);
    }

    useEffect(() => {

        //this will make the search-bar word as changed in the url directly: 
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    }, [ location.search ])

  return (
    <header className="bg-slate-200 shadow-md ">

        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
            
            {/* LOGO */}

            <Link to="/">
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span  className="text-slate-500">Property</span>
                    <span  className="text-slate-700">Bazaar</span>
                </h1>
            </Link>
            
            
            {/* SearchBar */}
            <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent focus:outline-none w-24 sm:w-64"
                />
                <button>
                    <FaSearch className="text-slate-600" />
                </button>
            </form>

            <ul className="flex gap-10">

                <Link to="/">
                    <li className="hidden sm:inline text-slate-700 hover:underline">
                        Home
                    </li>                
                </Link>

                <Link to="/about">
                    <li className="hidden sm:inline text-slate-700 hover:underline">
                        About Us
                    </li>
                </Link>

                {currentUser ? (
                    <Link to="/profile">
                        <img 
                            src={currentUser.avatar} 
                            alt="profile" 
                            className="rounded-full h-7 w-7 object-cover"
                        />
                    </Link> 
                ) : (
                    <Link to="/sign-in">
                        <li className="text-slate-700 hover:underline">
                            Sign in
                        </li>
                    </Link>
                ) }        
                
            </ul>
        </div>
        
    </header>
  )
}
