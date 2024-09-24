import React from 'react';
import { Modal, Card, Chip, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const FurnitureDetailModal = ({ open, onClose, furniture }) => {

    const handleReserve = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('You need to be logged in to reserve an item.');
            return;
        }
        if (!furnitureId) {
            console.error('Furniture ID is undefined');
            alert('Unable to reserve item. Please try again later.');
            return;
        }

        try {
            await axios.post(`http://localhost:5454/api/reservations/request/${furnitureId}/${user.id}`);
            alert('Reservation successful!');
            onClose();
        } catch (error) {
            console.error('Error reserving item:', error);
            alert('Error reserving item. Please try again later.');
        }
    };


    if (!furniture) return null;

    const furnitureId = furniture.id || furniture.furnitureId;

        let addressString;

        if (typeof furniture.address === 'object' && furniture.address !== null) {
            addressString = `${furniture.address.street}, ${furniture.address.city}, ${furniture.address.state}, ${furniture.address.zipCode}, ${furniture.address.country}`;
        } else if (typeof furniture.address === 'string') {
            addressString = furniture.address;
        } else {
            addressString = 'Address not available';
        }
        
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="furniture-detail-modal"
            aria-describedby="furniture-detail-description"
        >
            <div className="flex items-center justify-center min-h-screen">
                <Card
                    className="w-[60vw] md:w-[40vw] lg:w-[30vw] bg-gray-900 text-white"
                    style={{ maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
                >
                    <div className="relative">
                        <img
                            className="w-full h-[20rem] rounded-t-md object-cover"
                            src={furniture.image?.imageUrl || furniture.imageUrl || 'https://via.placeholder.com/150'}
                            alt={furniture.title}
                        />
                        <Chip
                            size="small"
                            className="absolute top-2 left-2"
                            color={furniture.available ? "success" : "error"}
                            label={furniture.available ? "Available" : "Unavailable"}
                        />
                        <IconButton
                            className="absolute top-2 right-2"
                            color="inherit"
                            onClick={onClose}
                            style={{ position: 'absolute', top: 10, right: 10 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="p-4">
                        <Typography variant="h6" className="font-semibold">{furniture.title}</Typography>
                        <Typography variant="body2" className="text-gray-300 mt-1">{furniture.description}</Typography>
                        <Typography variant="body2" className="text-gray-400 mt-2">Category: {furniture.category}</Typography>
                        <Typography variant="body2" className="text-gray-400 mt-2">Owner: {furniture.userEmail}</Typography>
                        <Typography variant="body2" className="text-gray-400 mt-2">Address: {addressString}</Typography>
                        <div className="mt-4 flex justify-end">
                            <Button variant="contained" color="primary" onClick={handleReserve}>
                                Reserve
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

export default FurnitureDetailModal;
