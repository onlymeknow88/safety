import { useState } from 'react';
import axios from 'axios';
import TokenManager from '@/Utils/TokenManager';
import { message } from 'antd';

export default function useUser() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const updateProfile = async (data) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await axios({
                method: 'POST',
                url: '/api/update-profile',
                data: data,
                headers: {
                    Authorization: 'Bearer ' + TokenManager.getToken(),
                    Accept: 'application/json',
                },
            });

            if (response.data) {
                message.success('Profile updated successfully');
                return { success: true, user: response.data.user };
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                message.error(error.response?.data?.message || 'Failed to update profile');
            }
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (data) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await axios({
                method: 'POST',
                url: '/api/update-password',
                data: data,
                headers: {
                    Authorization: 'Bearer ' + TokenManager.getToken(),
                    Accept: 'application/json',
                },
            });

            if (response.data) {
                message.success('Password updated successfully');
                return { success: true };
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                message.error(error.response?.data?.message || 'Failed to update password');
            }
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        errors,
        updateProfile,
        updatePassword,
    };
}
