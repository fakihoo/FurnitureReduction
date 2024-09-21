import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import MultiItemCArousel from './MultiItemCArousel';
import FurnitureCard from '../Furniture/FurnitureCard';
import FurnitureDetailModal from '../Furniture/FurnitureDetailModal';

const Home = () => {
    const [furnitureList, setFurnitureList] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useState({ name: '', category: '', city: '' });

    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const response = await axios.get('http://localhost:5454/api/furniture/all');
                setFurnitureList(response.data);
            } catch (error) {
                console.error('Error fetching furniture data:', error);
            }
        };

        fetchFurniture();
    }, []);

    const handleCardClick = (furniture) => {
        setSelectedFurniture(furniture);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedFurniture(null);
    };

    const handleReserve = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.error('User not logged in');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5454/api/reservation/request/${selectedFurniture.furnitureId}/${user.id}`);
            console.log('Reservation successful:', response.data);
        } catch (error) {
            console.error('Error reserving furniture:', error);
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5454/api/furniture/search', {
                params: {
                    name: searchParams.name,
                    category: searchParams.category,
                    city: searchParams.city,
                },
            });
            setFurnitureList(response.data);
        } catch (error) {
            console.error('Error searching furniture:', error);
        }
    };

    return (
        <div className='pb-10'>
            <section className='banner -z-50 relative flex flex-col justify-center items-center'>
                <div className='w-[50vw] z-10 text-center'>
                    <p className='text-2xl lg:text-6xl font-bold z-10 py-5'>Furniture Reduction</p>
                    <p className='z-10 text-gray-300 text-x1 lg:text-4xl'>Offer Your Used Furniture Or Electronics for others to benefit.</p>
                </div>
                <div className='cover absolute top-0 left-0 right-0'></div>
                <div className='fadout'></div>
            </section>
            <section className='p-10 lg:py-10 lg:px-20'>
                <p className='text-2xl font-semibold text-gray-400 py-3 pb-10'>Products to Donate</p>
                <MultiItemCArousel />
            </section>
            <section className='px-5 lg:px-20 pt-5'>
                <div className='flex justify-between items-center pb-10'>
                    <h1 className='text-2xl font-semibold text-gray-400'>Request from the Donater</h1>
                    <div className='flex space-x-3'>
                        <input
                            type='text'
                            name='name'
                            placeholder='Search by Name'
                            value={searchParams.name}
                            onChange={handleSearchChange}
                            className='bg-gray-700 text-white border border-gray-500 rounded p-2 placeholder-gray-400'
                        />
                        <input
                            type='text'
                            name='category'
                            placeholder='Search by Category'
                            value={searchParams.category}
                            onChange={handleSearchChange}
                            className='bg-gray-700 text-white border border-gray-500 rounded p-2 placeholder-gray-400'
                        />
                        <input
                            type='text'
                            name='city'
                            placeholder='Search by City'
                            value={searchParams.city}
                            onChange={handleSearchChange}
                            className='bg-gray-700 text-white border border-gray-500 rounded p-2 placeholder-gray-400'
                        />
                        <button
                            onClick={handleSearch}
                            className='bg-gray-700 text-white rounded p-2 hover:bg-black transition duration-200'
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className='flex flex-wrap items-center justify-around gap-5'>
                    {furnitureList.map((item) => (
                        <FurnitureCard
                            key={item.furnitureId}
                            title={item.title}
                            description={item.description}
                            category={item.category}
                            available={item.available}
                            imageUrl={item.imageUrl}
                            onClick={() => handleCardClick(item)}
                        />
                    ))}
                </div>
            </section>
            {selectedFurniture && (
                <FurnitureDetailModal
                    open={modalOpen}
                    onClose={handleModalClose}
                    furniture={selectedFurniture}
                    onReserve={handleReserve}
                />
            )}
        </div>
    );
};

export default Home;
