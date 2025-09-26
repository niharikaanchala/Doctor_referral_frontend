// DoctorContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, token } from '../config';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const fetchDoctor = async (id) => {
        if (!id) return;

        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctor(res.data.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setDoctor(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        if (!doctor?._id) return;

        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/doctors/profile/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(res.data.data.appointments || []);
            console.log(appointments)
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            await axios.put(
                `${BASE_URL}/bookings/${bookingId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state without refreshing
            setAppointments(prev => prev.map(appt =>
                appt._id === bookingId ? { ...appt, status } : appt
            ));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    return (
        <DoctorContext.Provider value={{
            doctor,
            loading,
            error,
            appointments,
            fetchDoctor,
            fetchAppointments,
            updateBookingStatus
        }}>
            {children}
        </DoctorContext.Provider>
    );
};

export const useDoctor = () => {
    const context = useContext(DoctorContext);
    if (!context) {
        throw new Error('useDoctor must be used within a DoctorProvider');
    }
    return context;
};