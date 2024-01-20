/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {app} from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {

  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {currentUser, loading, error} = useSelector((state) => state.user);
 
  const [file, setFile] = useState(undefined);

  const [filePerc, setFilePerc] = useState(0);

  const [fileUploadError, setFileUploadError] = useState(false);
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [formData, setFormData] = useState({});
  
  const [showListingsError, setShowListingsError] = useState(false);

  const [userListings, setUserListings] = useState([]);
  

  // firebase storage: 
  //     allow read;
  //     allow write : if
  //     request.resource.size <2*1024*1024 &&
  //     request.resource.contentType.matches("image/.*") 

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);


  //For handling the change in upload image
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name ;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }


  //for handling the change in the body :
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  //for handling the submit function and send data to backend for updation:
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, 
      {
        method: "POST",
        headers:{
          "Content-type": "application/json",
        },
        body : JSON.stringify(formData),
      });

      const data = await res.json();

      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return ;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  } 

  //for handling deleting the user:
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, 
      {
        method: "DELETE",
      });

      const data = await res.json();

      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return ;
      }

      dispatch(deleteUserSuccess(data));
      navigate('/sign-in');

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

    //for handling signing out the user:
    const handleSignOut = async () => {
      try {
        dispatch(signOutUserStart());
        const res = await fetch('/api/auth/signout');
        const data = await res.json();
        if(data.success === false){
          return;
        }
        dispatch(signOutUserSuccess(data));
        navigate('/sign-in');
      } catch (error) {
        dispatch(signOutUserFailure(error.message));
      }
    }

    //for handling the showing listings functionality: 
    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        console.log('Listings API Response:', data); 
        console.log('Length:', userListings.length); 
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        
        // Extract the array from the API response
        const listingsArray = data.listings;
        setUserListings(listingsArray);
      } catch (error) {
        setShowListingsError(true);
      }
    };

    const handleListingDelete = async(listingId) => {
      try {
        const res = await fetch(`api/listing/delete/${listingId}`, {
          method: "DELETE",
        });

        setUserListings((prev) => 
          prev.filter((listing) => listing._id !== listingId)
        );

      } catch (error) {
        console.log(error.message);
      }
    }

  return (
    <>
        
      <div className='p-3 max-w-lg mx-auto'>
        
        <h1 className='text-3xl font-bold text-center my-7'>
          Profile
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

          <input 
            type="file"  
            ref={fileRef} 
            className='hidden' 
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img 
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser?.avatar} 
            alt="profile" 
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' 
          />

          {/* for text or h1 tag we use text-centre and for image we use self-centre  */}

          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>

          <input 
            type="text" 
            placeholder='Username' 
            id='username' 
            className='border p-3 rounded-lg'
            defaultValue={currentUser?.username}  
            onChange={handleChange}
          />

          <input 
            type="email" 
            placeholder='Email' 
            id='email' 
            className='border p-3 rounded-lg'  
            defaultValue={currentUser?.email}  
            onChange={handleChange}
          />

          <input 
            type="password" 
            placeholder='Password' 
            id='password' 
            className='border p-3 rounded-lg'  
          />
          
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? "Loading..." : "Update" }
          </button>

          <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90'>
            Create Listing
          </Link>

        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
          
          <span onClick={handleSignOut}  className='text-red-700 cursor-pointer'>Sign out</span>
        </div>

        <p className='text-red-700 mt-5'>
          {error ? "ERROR: " + error : ""}
        </p>

        <p className='text-green-700 mt-5'>
            {updateSuccess ? "User is Updated Successfully!" : ""}
        </p>

        <button onClick={handleShowListings} className='text-green-700 w-full my-7'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {(userListings &&
        userListings.length > 0) ?
        (<div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-20 w-20 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center gap-2'>
               
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase border bg-slate-100 rounded-lg p-2 hover:underline'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase border bg-slate-100 rounded-lg p-2 hover:underline'>Edit</button>
                </Link>

              </div>
            </div>
          ))}
        </div>)
        :
        (
          console.log("USERLISTINGS: ", userListings.length)
        )}

      </div>
    </>
   
  );
}