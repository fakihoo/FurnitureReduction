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
                <h1 className='text-2xl font-semibold text-gray-400 pb-10'>Request from the Donater</h1>
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
