// src/component/Profile/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Avatar, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditFurnitureModal from './EditFurnitureModal'; // Import the modal component

const ProfilePage = () => {
    const [userFurniture, setUserFurniture] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // For update modal
    const [modalOpen, setModalOpen] = useState(false); // Modal open state
    const { userName, userEmail, setUserName, setIsLoggedIn } = useAuth(); // Retrieve userEmail from AuthContext
    const navigate = useNavigate();

    const fetchUserFurniture = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const response = await axios.get(`http://localhost:5454/api/furniture/user/${user.id}`);
                setUserFurniture(response.data);
            } catch (error) {
                console.error('Error fetching user furniture', error);
            }
        } else {
            navigate('/'); // Redirect to home if user is not logged in
        }
    };

    useEffect(() => {
        fetchUserFurniture(); // Fetch the furniture list on component mount
    }, [navigate, setUserName]);

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

    const handleUpdate = (item) => {
        setSelectedItem(item);
        setModalOpen(true); // Open the modal
    };

    const handleDelete = async (itemId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            await axios.delete(`http://localhost:5454/api/furniture/delete/${itemId}/${user.id}`);
            setUserFurniture(userFurniture.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    const handleModalUpdate = async () => {
        setModalOpen(false);
        await fetchUserFurniture(); // Re-fetch furniture list after update
    };

    return (
        <Box sx={{ p: 4, backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profile Page
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "#e91e63", mr: 2 }}>
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h6">{userName}</Typography>
                    <Typography variant="body2">{userEmail}</Typography> {/* Display the user's email */}
                </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
                Your Uploaded Furniture
            </Typography>
            <Box>
                {userFurniture.length > 0 ? (
                    userFurniture.map((item) => (
                        <Card key={item.id} sx={{ mb: 2, p: 2, backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="body1">{item.description}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Category: {item.category}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Available: {item.available ? 'Yes' : 'No'}
                                </Typography>
                                {item.address && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Address:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.address.street}, {item.address.city}, {item.address.state} {item.address.zipCode}, {item.address.country}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            {item.images.length > 0 && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, objectFit: 'contain' }}
                                    image={item.images[0].imageUrl}
                                    alt={item.title}
                                />
                            )}
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                                <IconButton color="primary" onClick={() => handleUpdate(item)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1">No furniture items uploaded.</Typography>
                )}
            </Box>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button>

            {/* EditFurnitureModal Component */}
            <EditFurnitureModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                furniture={selectedItem}
                onUpdate={handleModalUpdate}
            />
        </Box>
    );
};

export default ProfilePage;
