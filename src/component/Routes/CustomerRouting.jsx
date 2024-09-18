import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../Home/Home';
import ProfilePage from '../Profile/ProfilePage';


const CustomerRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
};

export default CustomerRouting;
