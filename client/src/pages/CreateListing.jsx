
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


export default function CreateListing() {

    const {currentUser} = useSelector((state) => state.user);

    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

    const params = useParams();

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 500,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    useEffect(() => {
      const fetchListing = async() => {
        const listingId = params.listingId;
      }

      fetchListing();
    });

    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(false);

    const [imageUplaodError, setImageUploadError] = useState(false);

    const [uploading, setUploading] = useState(false);
    
    const handleImageSubmit = (e) => {
        e.preventDefault();

        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError("Image uplaod failed (2mb max per image) ");
                setUploading(false);
            })
        }else{
            setImageUploadError("You can uplaod min 1 image and max 6 images per listing");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        })
    };

    const handleRemoveImage = (index) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
      };

    const handleChange = (e) => {
        if(e.target.id === 'sale'|| e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }
        if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }
        if(e.target.type ==='number' || e.target.type ==='text' || e.target.type==='textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if(formData.imageUrls.length < 1) { 
                return setError('You must upload atleast 1 property image')
            }

            if(+formData.regularPrice < +formData.discountPrice) { 
                return setError('Discount Price must be lower than Regular Price');
            }
            // '+' is added in order to convert the formdata into number

            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...formData,
                  userRef: currentUser._id,
                }),
              });

            const data = await res.json();
            console.log('DATA: ',data)
            setLoading(false);
            if(data.success === false){
                setError(data.message);
            }
            navigate(`/listing/${data.listing._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
      
      <main className='p-3 max-w-4xl mx-auto'>
        
        <h1 className='text-3xl font-semibold text-center mt-5 mb-10'>
          Create a Listing
        </h1>
        
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
          
          <div className='flex flex-col gap-4 flex-1'>
            
            <input
              type='text'
              placeholder='Name'
              className='border border-slate-400 p-3 rounded-lg'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
            
            <textarea
              type='text'
              placeholder='Description'
              className='border border-slate-400 p-3 rounded-lg'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
            
            <input
              type='text'
              placeholder='Address'
              className='border border-slate-400 p-3 rounded-lg'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
            
            <div className='flex gap-6 flex-wrap'>
              
              <div className='flex gap-2'>
                
                <input type='checkbox' id='sale' className='w-5 border-slate-300' onChange={handleChange} checked={formData.type==='sale'}  />
                
                <span>Sell</span>
              
              </div>
              
              <div className='flex gap-2'>
                
                <input type='checkbox' id='rent' className='w-5 border-slate-300' onChange={handleChange} checked={formData.type==='rent'} />
                
                <span>Rent</span>
              
              </div>
              
              <div className='flex gap-2'>
                
                <input type='checkbox' id='parking' className='w-5 border-slate-300' onChange={handleChange} checked={formData.parking} />
                
                <span>Parking spot</span>
              
              </div>
              
              <div className='flex gap-2'>
               
                <input type='checkbox' id='furnished' className='w-5 border-slate-300' onChange={handleChange} checked={formData.furnished} />
                
                <span>Furnished</span>
             
              </div>
              
              <div className='flex gap-2'>
              
                <input type='checkbox' id='offer' className='w-5 border-slate-300' onChange={handleChange} checked={formData.offer} />
              
                <span>Offer</span>
              
              </div>
            
            </div>
           
            <div className='flex flex-wrap gap-6'>
              
              <div className='flex items-center gap-2'>
               
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-400 rounded-lg'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
               
                <p>Beds</p>
              
              </div>
             
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-400 rounded-lg'
                  onChange={handleChange}
                  value={formData.bathrooms}
              />
              
                <p>Baths</p>
             
              </div>
            
              <div className='flex items-center gap-2'>
              
                <input
                  type='number'
                  id='regularPrice'
                  min='500'
                  max='100000000'
                  required
                  className='p-3 border border-gray-400 rounded-lg'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
             
                <div className='flex flex-col items-center'>
             
                  <p>Regular price</p>
             
                  {formData.type === 'rent' && (
                    <span className='text-xs'>(₹ / month)</span>
                  )}

                </div>
             
              </div>

              {formData.offer && (
                <div className='flex items-center gap-2'>
             
                    <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='100000000'
                        required
                        className='p-3 border border-gray-400 rounded-lg'
                        onChange={handleChange}
                        value={formData.discountPrice}
                    />
                
                    <div className='flex flex-col items-center'>
                    
                        <p>Discounted price</p>
                    
                        {formData.type === 'rent' && (
                          <span className='text-xs'>(₹ / month)</span>
                        )}
                    
                    </div>
           
                </div>

              )}

            </div>
          
          </div>
         
          <div className="flex flex-col flex-1 gap-4 ms-5">
            
            <p className='font-semibold'>Images:
            
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            
            </p>
           
            <div className="flex gap-4">
             
                <input 
                    onChange={(e)=>{setFiles(e.target.files)}} 
                    className='p-3 border border-slate-200 rounded w-full' 
                    type="file" 
                    id='images' 
                    accept='image/*' 
                    multiple 
                />
                
                <button 
                    type="button"
                    disabled= {uploading}
                    onClick={handleImageSubmit}
                    className='p-3 text-white bg-green-600 border border-slate-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            
            </div>

            <p className="text-red-700 text-sm">
                {imageUplaodError && "ERROR : " + imageUplaodError }
            </p>

            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
    
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-cover rounded-lg"/>
                        <button 
                            onClick={() => {handleRemoveImage(index)}}
                            type="button" 
                            className="p-3 text-red-700 rounded-lg hover:opacity:75"
                        >
                            DELETE
                        </button>
                    </div>
                ))
            }
         
            <button disabled={loading || uploading} className='p-3 mt-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                {loading ? "Creating..." : "Create Listing"}
            </button>

            <p className="text-red-700 text-sm">
                {error ? error : ""}
            </p>
         
          </div>
       
        </form>
     
      </main>
    );
  }