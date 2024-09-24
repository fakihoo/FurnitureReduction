import React from 'react';
import { Modal, Box, Typography, Button, Grid, Avatar } from '@mui/material';

const CartModal = ({ open, onClose, reservedItems = [], updateCartCount }) => { 
    const handleRemoveItem = (itemId) => {
        const updatedItems = reservedItems.filter(item => item.id !== itemId);
        updateCartCount(updatedItems.length);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 24,
                p: 4,
                backgroundColor: '#333',
                color: '#fff'
            }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Your Reserved Items
                </Typography>
                {reservedItems.length === 0 ? (
                    <Typography sx={{ mt: 2 }}>No reserved items yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {reservedItems.map((reservation) => (
                            <Grid item xs={12} key={reservation.id} sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, mb: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Avatar
                                            variant="square"
                                            src={reservation.furniture.image?.imageUrl || ''}
                                            alt={reservation.furniture.title}
                                            sx={{ width: '100%', height: 'auto' }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                                            <strong>Title:</strong> {reservation.furniture.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff' }}>
                                            <strong>Description:</strong> {reservation.furniture.description}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff' }}>
                                            <strong>Owner:</strong> {reservation.owner.email}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff' }}>
                                            <strong>Status:</strong> {reservation.status}
                                        </Typography>
                                        <Button 
                                            variant="outlined" 
                                            color="secondary" 
                                            onClick={() => handleRemoveItem(reservation.id)}
                                            sx={{ mt: 1 }}
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Button onClick={onClose} sx={{ mt: 2 }} variant="contained" color="primary">Close</Button>
            </Box>
        </Modal>
    );
};

export default CartModal;
