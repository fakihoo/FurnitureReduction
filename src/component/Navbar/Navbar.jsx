// src/component/Navbar/Navbar.jsx
import React from 'react';
import { Badge, IconButton, Button, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { pink } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginRegisterModal from '../RegisterLogin/LoginRegisterModal';
import axios from 'axios';

export const Navbar = () => {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAuth();
    const [openModal, setOpenModal] = React.useState(false);
    const navigate = useNavigate();

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
                <li className='logo font-semibold text-gray-300 text-2x1'>
                    Furniture Reduction
                </li>
            </div>
            <div className='flex items-center space-x-2 lg:space-x-10'>
                <div className=''>
                    <IconButton>
                        <SearchIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                </div>
                <div className=''>
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
                <div className=''>
                    <IconButton>
                        <Badge color="primary" badgeContent={2}>
                            <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
                        </Badge>
                    </IconButton>
                </div>
            </div>
            <LoginRegisterModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                setLoggedIn={setIsLoggedIn}
                setAvatarText={setUserName}
            />
        </div>
    );
};

export default Navbar;
