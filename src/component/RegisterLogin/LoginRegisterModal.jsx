import React, { useState } from 'react';
import axios from 'axios';
import { Modal, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const backdropStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
};

const LoginRegisterModal = ({ open, onClose, setAvatarText }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { setIsLoggedIn, setUserName } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5454/api/auth/login', { email, password });
            if (response.status === 200) {
                // Store user data
                const user = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                setIsLoggedIn(true);
                setUserName(user.email);
                setAvatarText(user.email.charAt(0).toUpperCase());
                setError('');
                onClose();
            }
        } catch (error) {
            setError("Error logging in. Please check your credentials.");
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5454/api/auth/register', { email, password, username });
            if (response.data === "User registered successfully!") {
                setIsRegistering(false);
                setError('');
            } else {
                setError(response.data);
            }
        } catch (error) {
            setError("Error registering. Please try again.");
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{ style: backdropStyle }}
        >
            <Box sx={modalStyle}>
                <Typography variant="h6">{isRegistering ? "Register" : "Login"}</Typography>
                {isRegistering && (
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                )}
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={isRegistering ? handleRegister : handleLogin}
                >
                    {isRegistering ? "Register" : "Login"}
                </Button>
                <Button
                    variant="text"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError(''); // Clear error message when toggling
                    }}
                >
                    {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
                </Button>
            </Box>
        </Modal>
    );
};

export default LoginRegisterModal;
