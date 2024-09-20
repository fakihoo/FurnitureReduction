// src/component/Furniture/FurnitureCard.jsx
import React from 'react';
import { Card, Chip, IconButton, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FurnitureCard = ({ title, description, category, available, imageUrl, ownerEmail, onClick }) => {
    return (
        <Card 
            sx={{ 
                width: 300, 
                bgcolor: '#121212', 
                color: '#fff', 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 2 
            }} 
            onClick={onClick}
        >
            <Box sx={{ position: 'relative' }}>
                <img 
                    src={imageUrl || 'https://via.placeholder.com/300x150'} 
                    alt={title} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} 
                />
                <Chip
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10 }}
                    color={available ? "success" : "error"}
                    label={available ? "Available" : "Unavailable"}
                />
            </Box>
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">{description}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Category: {category}
                </Typography>
            </Box>
        </Card>
    );
};

export default FurnitureCard;
