import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, TextField, Button, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const backdropStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
};

const EditFurnitureModal = ({ open, onClose, furniture, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [available, setAvailable] = useState(true);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        country: ''
    });
    const [image, setImage] = useState('');  // Single image state

    useEffect(() => {
        if (furniture) {
            setTitle(furniture.title || '');
            setDescription(furniture.description || '');
            setCategory(furniture.category || '');
            setAvailable(furniture.available || true);
            setAddress(furniture.address || {
                street: '',
                city: '',
                country: ''
            });
            setImage(furniture.image?.imageUrl || '');  // Set the image URL
        }
    }, [furniture]);

    const handleUpdate = async () => {
        try {
            const requestData = {
                title,
                description,
                category,
                available,
                address,
                image: { imageUrl: image },  // Send a single image object
            };

            console.log("Request Data:", requestData);  // Log request data for debugging

            // Make PUT request to update furniture
            await axios.put(`http://localhost:5454/api/furniture/update/${furniture.id}`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            onUpdate(); // Trigger a refresh or re-fetch
            onClose();  // Close modal
        } catch (error) {
            console.error('Error updating furniture', error.response?.data || error.message); // Better error logging
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={backdropStyle}
        >
            <Box sx={modalStyle}>
                <Typography variant="h6">Edit Furniture</Typography>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Street"
                    value={address.street}
                    onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))} 
                    fullWidth
                />
                <TextField
                    label="City"
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))} 
                    fullWidth
                />
                <TextField
                    label="Country"
                    value={address.country}
                    onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))} 
                    fullWidth
                />

                {/* Single field for image URL */}
                <TextField
                    label="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    fullWidth
                />

                {/* Add radio buttons for Available status */}
                <FormControl component="fieldset">
                    <FormLabel component="legend">Available</FormLabel>
                    <RadioGroup
                        row
                        value={available ? 'yes' : 'no'}
                        onChange={(e) => setAvailable(e.target.value === 'yes')}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </Box>
        </Modal>
    );
};

export default EditFurnitureModal;
