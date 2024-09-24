import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Avatar, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditFurnitureModal from './EditFurnitureModal';
import AddFurnitureModal from './AddFurnitureModal';

const ProfilePage = () => {
    const [userFurniture, setUserFurniture] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [activityData, setActivityData] = useState({ itemsDonatedCount: 0, peopleHelpedCount: 0 });
    const { userName, userEmail, setUserName, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const fetchUserFurniture = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            try {
                const response = await axios.get(`http://localhost:5454/api/furniture/user/${user.id}`);
                setUserFurniture(response.data || []);
            } catch (error) {
                console.error('Error fetching user furniture', error);
            }
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
        fetchUserFurniture();
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
        setModalOpen(true);
    };

    const handleDelete = async (itemId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            try {
                await axios.delete(`http://localhost:5454/api/furniture/delete/${itemId}/${user.id}`);
                setUserFurniture(userFurniture.filter(item => item.id !== itemId));
            } catch (error) {
                console.error('Error deleting item', error);
            }
        }
    };

    const handleModalUpdate = async () => {
        setModalOpen(false);
        await fetchUserFurniture();
    };

    const handleCreateDonation = () => {
        setAddModalOpen(true);
    };

    const fetchUserActivity = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            try {
                const response = await axios.get(`http://localhost:5454/api/auth/${user.id}/activity`);
                setActivityData(response.data);
            } catch (error) {
                console.error('Error fetching user activity', error);
            }
        }
    };

    useEffect(() => {
        fetchUserFurniture();
        fetchUserActivity();
    }, [navigate, setUserName]);

    const user = JSON.parse(localStorage.getItem('user'));
    
    return (
        <Box sx={{ p: 4, backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profile Page
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, marginBottom:'30px' }}>
                <Avatar sx={{ bgcolor: "white", color: "#e91e63", mr: 2 }}>
                    {userName && userName.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h6">{user.fullName || 'Guest'}</Typography>
                    <Typography variant="body2">{user.email || 'No Email'}</Typography>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right'}}>
                    <Typography variant="h6" sx={{fontSize:'15px'}}>Donated Items: {activityData.itemsDonatedCount}</Typography>
                    <Typography variant="h6" sx={{fontSize:'15px'}}>People Helped: {activityData.peopleHelpedCount}</Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'10px', margintop:'20px'}}>
                <Typography variant="h6" gutterBottom>
                    Your Uploaded Furniture
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateDonation}>
                    Create Donation
                </Button>
            </Box>
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
                                            {item.address.street}, {item.address.city}, {item.address.country}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            {item.image && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, objectFit: 'contain' }}
                                    image={item.image.imageUrl}
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

            <EditFurnitureModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                furniture={selectedItem}
                onUpdate={handleModalUpdate}
            />

            <AddFurnitureModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                userId={JSON.parse(localStorage.getItem('user'))?.id || null}
                onCreate={fetchUserFurniture}
            />
        </Box>
    );
};

export default ProfilePage;
