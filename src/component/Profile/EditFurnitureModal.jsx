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
        state: '',
        zipCode: '',
        country: ''
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (furniture) {
            setTitle(furniture.title || '');
            setDescription(furniture.description || '');
            setCategory(furniture.category || '');
            setAvailable(furniture.available || true);
            setAddress(furniture.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            });
            setImages(furniture.images.map(image => image.imageUrl) || []); // Set image URLs
        }
    }, [furniture]);

    const handleUpdate = async () => {
        try {
            // Mapping images to ensure they are sent as an array of objects with imageUrl property
            const updatedImages = images.map(image => ({
                imageUrl: image
            }));

            const requestData = {
                title,
                description,
                category,
                available,
                address,
                images: updatedImages, // Use updated images format
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
            console.error('Error updating furniture', error.response); // Log response error for debugging
        }
    };

    const handleImageChange = (index, newUrl) => {
        const updatedImages = [...images];
        updatedImages[index] = newUrl;
        setImages(updatedImages);
    };

    const addNewImageField = () => {
        setImages([...images, '']);  // Add a new empty field for another image URL
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
                    label="State"
                    value={address.state}
                    onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))} 
                    fullWidth
                />
                <TextField
                    label="Zip Code"
                    value={address.zipCode}
                    onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))} 
                    fullWidth
                />
                <TextField
                    label="Country"
                    value={address.country}
                    onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))} 
                    fullWidth
                />

                {/* Add fields for image URLs */}
                {images.map((image, index) => (
                    <TextField
                        key={index}
                        label={`Image URL ${index + 1}`}
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        fullWidth
                    />
                ))}

                {/* Button to add more image fields */}
                <Button onClick={addNewImageField} variant="outlined">
                    Add another image
                </Button>

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
