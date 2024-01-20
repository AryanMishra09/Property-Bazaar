/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import {
    FaBath, 
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

//  ***  SWIPER IS USED FOR THE SLIDING OF PHOTOS ***

export default function Listing() {

    const params = useParams();

    const {currentUser} = useSelector((state) => state.user);

    SwiperCore.use([Navigation]);

    const [loading, setLoading] = useState(false);

    const [listing, setListing] = useState(null);

    const [error, setError] = useState(false);

    const [copied, setCopied] = useState(false);

    const [contact, setContact] = useState(false);

    useEffect(() => {
        try {
            setLoading(true);
            const fetchListing = async () => {
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
            }
            fetchListing();
        } catch (error) {
            setError(true); 
            setLoading(false);
        }
        
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!</p>
            )}
            
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div
                            className='h-[550px]'
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                            ></div>
                        </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-lg bg-green-600 text-white p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-5xl mx-auto justify-normal p-6 my-7 gap-4'>
                        <p className='text-3xl font-semibold'>
                            {listing.name} -  ₹{' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' ? ' / month' : ' /-'}
                        </p>
                        
                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-lg'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        
                        <div className='flex gap-4'>
                            <p className='bg-red-800 w-full max-w-[150px] text-white text-center p-1 rounded-lg'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            
                            {listing.offer && (
                                <p className='bg-green-700 w-full max-w-[150px] text-white text-center p-1 rounded-lg'>
                                 ₹{+listing.regularPrice - +listing.discountPrice} Off /-
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-lg text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-md flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds `
                                : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths `
                                : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>

                        {(listing?.userRef !== currentUser?._id && !contact) && (
                            <button 
                                className="bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase p-3"
                                onClick={() => setContact(true)}
                            >
                                Contact Landlord
                            </button>
                        )}
                        {contact && <Contact listing= {listing}/>}
                        
                    </div>
                </div>
            )}
        </main>
    )
}
