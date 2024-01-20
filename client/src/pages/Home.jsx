/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';


export default function Home() {

  const [offerListings, setOfferListings] = useState([]);

  const [saleListings, setSaleListings] = useState([]);

  const [rentListings, setRentListings] = useState([]);
  
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();      //this function is called here so that until offers list is fetched then only rent list will be fetched so that all the fetching will be in order one by one not in a go.
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();      //this function is called here so that until offersand rent list is fetched then only sale list will be fetched so that all the fetching will be in order one by one not in a go.
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();

  }, [])

    return (
      <div>
        
        {/* top */}
        <div className='flex flex-col gap-9 p-28 px-3 max-w-6xl mx-auto'>
          
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find your next <span className='text-slate-400'>perfect</span> 
            <br />
            place with ease
          </h1>
          
          <div className='text-gray-400 text-xs sm:text-sm'>
            Property Bazaar is the best place to find your perfect place to live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>

          <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 hover:underline font-bold'>
            Let's get started...
          </Link>
          
        </div>



        {/* swiper */}

        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[500px]'
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>



        {/* lisiting results for offer, sale and rent */}

        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

          {offerListings && offerListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 
                  className='text-2xl font-semibold text-slate-600'
                >
                  Recent offers
                </h2>
                
                <Link 
                  className='text-sm text-blue-800 hover:underline' 
                  to={'/search?offer=true'}
                >
                  Show more offers
                </Link>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              
              </div>
            </div>
          )}

          {rentListings && rentListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 
                  className='text-2xl font-semibold text-slate-600'
                >
                  Recent places for Rent
                </h2>
                
                <Link 
                  className='text-sm text-blue-800 hover:underline' 
                  to={'/search?type=rent'}
                >
                  Show more places for rent
                </Link>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              
              </div>
            </div>
          )}

          {saleListings && saleListings.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 
                  className='text-2xl font-semibold text-slate-600'
                >
                  Recent places for sale
                </h2>
                
                <Link 
                  className='text-sm text-blue-800 hover:underline' 
                  to={'/search?type=sale'}
                >
                  Show more places for sale
                </Link>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              
              </div>
            </div>
          )}

        </div>
        
        

      </div>
    )
}


