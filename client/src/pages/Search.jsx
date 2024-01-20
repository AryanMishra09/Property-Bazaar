/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {

    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    })

    const [loading , setLoading] = useState(false);

    const [listings, setListings] = useState([]);
    
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        //to change the search filter if there is any change/update in the searchBar-tab-Icon of header or url itself:
        if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl){
            setSidebardata({
                searchTerm : searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true'? true : false,
                furnished: furnishedFromUrl === 'true'? true: false,
                offer: offerFromUrl === 'true'? true: false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }

        //to show the listings as per the search :
        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    
    }, [ location.search ]);

    //this will handle the changes in the filter of search
    const handleChange = async (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id == 'sale'){
            setSidebardata({...sidebardata, type: e.target.id});
        }

        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata, searchTerm: e.target.value})
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({
                ...sidebardata, 
                [e.target.id]: 
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
      
            const order = e.target.value.split('_')[1] || 'desc';
      
            setSidebardata({ ...sidebardata, sort, order });
        }
    }

    //this will change/update the search url as per the changes made in the search filter of the left side column of search page(i.e on the above function of handleChange):
    const handleSubmit = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams()   //to get the currrent url params
        
        //for setting the params as per the changes made in the handleChange function:
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);

        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings/get/${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

  return (
    <div className="flex flex-col md:flex-row">
        
        {/* div for the left column (filters) */}
        <div className=" p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-9">
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap">
                        Search Term: 
                    </label>
                    <input 
                        type="text" 
                        id="searchTerm"
                        placeholder="Search..."
                        className="border rounded-lg p-3 w-full"
                        value={sidebardata.searchTerm}
                        onChange={handleChange}
                    />
                </div>

                <div className='flex gap-4 flex-wrap items-center'>
                    <label className="font-semibold">Type:</label>
                    <div className="flex gap-1">
                        <input 
                            type="checkbox"
                            id="all"
                            className="w-4"
                            checked={sidebardata.type === 'all'}
                            onChange={handleChange}
                        />
                        <span>Rent & Sale</span>
                    </div>

                    <div className="flex gap-1">
                        <input 
                            type="checkbox"
                            id="rent"
                            className="w-4"
                            checked={sidebardata.type === 'rent'}
                            onChange={handleChange}
                        />
                        <span>Rent </span>
                    </div>

                    <div className="flex gap-1">
                        <input 
                            type="checkbox"
                            id="sale"
                            className="w-4"
                            checked={sidebardata.type === 'sale'}
                            onChange={handleChange}
                        />
                        <span>Sale</span>
                    </div>

                    <div className="flex gap-1">
                        <input 
                            type="checkbox"
                            id="offer"
                            className="w-4"
                            checked={sidebardata.offer}
                            onChange={handleChange}
                        />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex gap-4 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-1'>
                        <input 
                            type='checkbox' 
                            id='parking' 
                            className='w-4' 
                            checked={sidebardata.parking}
                            onChange={handleChange}
                        />
                        <span>Parking</span>
                    </div>
                    
                    <div className='flex gap-1'>
                        <input 
                            type='checkbox' 
                            id='furnished' 
                            className='w-4' 
                            checked={sidebardata.furnished}
                            onChange={handleChange}
                        />
                        <span>Furnished</span>
                    </div>
                </div>

                <div>
                    <label className="font-semibold">Sort:</label>
                    <select 
                        id="sort-order" 
                        className="border rounded-lg"
                        defaultValue={'created_at_desc'}
                        onChange={handleChange}
                    >
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>

                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                    search
                </button>

            </form>
        </div>

        {/* div for the right column (listing results) */}
        <div className="flex-1" >
            <h1 className=" text-3xl font-semibold border-b p-3 text-slate-800 mt-5"> 
                Listing Results:
            </h1>
            <div className="p-7 flex flex-wrap gap-4">
                {(!loading && listings.length === 0) && (
                    <p className="text-xl text-slate-700">
                        No Listing Found!
                    </p>
                )}

                {loading && (
                    <p className="text-xl text-slate-700 text-center w-full">
                       Loading... 
                    </p>
                )} 

                {!loading &&
                  listings &&
                  listings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                ))}

                {showMore && (
                    <button 
                        onClick={onShowMoreClick}
                        className="text-green-700 hover:underline text-center w-full p-7"
                    >
                        Show More
                    </button>
                )}

            </div> 
        </div>

    </div>
  )
}
