// src/api.js
import axios from 'axios';

export const fetchRecommendations = async (user_id, product_title, top_n = 5) => {
    try {
        console.log('Making API request...');
        const response = await axios.get('http://127.0.0.1:5000/recommend', {
            params: {
                user_id: user_id,
                product_title: product_title,
                top_n: top_n
            }
        });
        console.log('API response:', response.data);  // Log the response
        return response.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/register', {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};