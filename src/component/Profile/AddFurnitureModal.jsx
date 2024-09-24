import React, { useState } from 'react';
import { Modal, Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';

const AddFurnitureModal = ({ open, onClose, userId, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Furniture');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        country: ''
    });
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5454/api/furniture/create/${userId}`, {
                title,
                description,
                category,
                address,
                image: { imageUrl }
            });
            console.log('Furniture added:', response.data);
            onCreate();
            onClose();
        } catch (error) {
            console.error('Error creating furniture:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box 
                sx={{ 
                    p: 4, 
                    backgroundColor: '#1e1e1e', 
                    borderRadius: '8px', 
                    maxWidth: '600px', 
                    margin: 'auto', 
                    mt: '10vh', 
                    boxShadow: 24 
                }}>
                <Typography variant="h6" gutterBottom color="#fff">
                    Add New Furniture
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="Street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="Country"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        required
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <TextField
                        label="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2, backgroundColor: '#fff', '& .MuiInputBase-input': { color: '#000' }, '& .MuiInputLabel-root': { color: '#b0b0b0' }}}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Furniture
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddFurnitureModal;
