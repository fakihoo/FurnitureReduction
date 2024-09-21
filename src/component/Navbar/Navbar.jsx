import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Button, Avatar } from '@mui/material';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RequestsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginRegisterModal from '../RegisterLogin/LoginRegisterModal';
import RequestsModal from '../Requests/RequestsModal';
import CartModal from '../Requests/CartModal';
import axios from 'axios';

export const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [openRequestsModal, setOpenRequestsModal] = useState(false);
    const [requestCount, setRequestCount] = useState(0);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [reservedItems, setReservedItems] = useState([]);
    const navigate = useNavigate();
    
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        if (isLoggedIn && userId) {
            const fetchRequestCount = async () => {
                try {
                    const response = await axios.get(`http://localhost:5454/api/reservations/count/${userId}`);
                    setRequestCount(response.data);
                } catch (error) {
                    console.error('Error fetching request count:', error);
                }
            };
            fetchRequestCount();
        }
    }, [isLoggedIn, userId]);

    // Fetch reserved items (Cart)
    useEffect(() => {
        if (isLoggedIn && userId) {
            const fetchReservedItems = async () => {
                try {
                    const response = await axios.get(`http://localhost:5454/api/reservations/requester/${userId}`);
                    setReservedItems(response.data);
                    setCartCount(response.data.length);
                    console.log('Fetched Reserved Items:', response.data); // Check the fetched data
                } catch (error) {
                    console.error('Error fetching reserved items:', error);
                }
            };

            fetchReservedItems();
        }
    }, [isLoggedIn, userId]);

    // Method to update cart count dynamically
    const updateCartCount = (newCount) => {
        setCartCount(newCount);
    };

    const handleLoginClick = () => {
        setOpenModal(true);
    };

    const handleAvatarClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            setOpenModal(true);
        }
    };

    const handleRequestsClick = () => {
        if (isLoggedIn) {
            setOpenRequestsModal(true);
        }
    };

    const handleCartClick = () => {
        if (isLoggedIn) {
            setOpenCartModal(true);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5454/api/auth/logout');
            setIsLoggedIn(false);
            setUserName('');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <div className='px-5 z-50 py-[.8rem] bg-[#e91e63] lg:px-20 flex justify-between'>
            <div className='lg:mr-10 cursor-pointer flex items-center space-x-4'>
                <li className='logo font-semibold text-gray-300 text-2xl'>
                    Furniture Reduction
                </li>
            </div>
            <div className='flex items-center space-x-2 lg:space-x-10'>
                <div>
                    {isLoggedIn ? (
                        <Avatar
                            sx={{ bgcolor: "white", color: pink.A400 }}
                            onClick={handleAvatarClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {userName.charAt(0).toUpperCase()}
                        </Avatar>
                    ) : (
                        <Button onClick={handleLoginClick} variant="contained" color="primary">
                            Register
                        </Button>
                    )}
                </div>
                {isLoggedIn && (
                    <div>
                        <IconButton onClick={handleRequestsClick}>
                            <Badge color="primary" badgeContent={requestCount}>
                                <RequestsIcon sx={{ fontSize: "1.5rem" }} />
                            </Badge>
                        </IconButton>
                    </div>
                )}
                {isLoggedIn && (
                    <div>
                        <IconButton onClick={handleCartClick}>
                            <Badge color="primary" badgeContent={cartCount}>
                                <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                            </Badge>
                        </IconButton>
                    </div>
                )}
            </div>
            <LoginRegisterModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                setLoggedIn={setIsLoggedIn}
                setAvatarText={setUserName}
            />
            <RequestsModal
                open={openRequestsModal}
                onClose={() => setOpenRequestsModal(false)}
                userId={userId}
            />
            <CartModal
                open={openCartModal}
                onClose={() => setOpenCartModal(false)}
                reservedItems={reservedItems}
                updateCartCount={updateCartCount} // Pass the update function to CartModal
            />
        </div>
    );
};
