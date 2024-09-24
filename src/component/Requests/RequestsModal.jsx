import React, { useEffect, useState } from 'react';
import { Modal, Card, Typography, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const RequestsModal = ({ open, onClose, userId }) => {
    const [requests, setRequests] = useState([]);
    const [statusMap, setStatusMap] = useState({});

    useEffect(() => {
        const fetchRequests = async () => {
            if (!userId) return;
    
            try {
                const response = await axios.get(`http://localhost:5454/api/reservations/owner/${userId}`);
                console.log('Fetched requests:', response.data);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching reservation requests:', error);
            }
        };
    
        fetchRequests();
    }, [userId]);

    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            await axios.put(`http://localhost:5454/api/reservations/update-status/${reservationId}?status=${newStatus}`);
            setStatusMap((prev) => ({ ...prev, [reservationId]: newStatus }));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-[80vw] md:w-[50vw] lg:w-[40vw] bg-gray-900 text-white" style={{ maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                    <div className="relative p-4">
                        <IconButton onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className="font-semibold mb-4">Reservation Requests</Typography>
                        {requests.length === 0 ? (
                            <Typography>No requests found.</Typography>
                        ) : (
                            requests.map((request) => (
                                <div key={request.id} className="flex items-center mb-4">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={request.furniture.image?.imageUrl || 'https://via.placeholder.com/150'}
                                            alt={request.furniture.title}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <Typography variant="body1">{request.furniture.title}</Typography>
                                        <Typography variant="body2" className="text-gray-400">Requested by: {request.requester.email}</Typography>
                                        <Typography variant="body2" className="text-gray-400">Status: {statusMap[request.id] || request.status}</Typography>
                                    </div>
                                    <div className="ml-auto">
                                        <FormControl>
                                            <Select
                                                value={statusMap[request.id] || request.status}
                                                onChange={(e) => handleStatusChange(request.id, e.target.value)}
                                                className="text-white"
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Approved">Approved</MenuItem>
                                                <MenuItem value="Declined">Declined</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

export default RequestsModal;
