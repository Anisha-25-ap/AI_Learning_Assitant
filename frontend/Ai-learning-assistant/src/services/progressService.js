import axios from 'axios';

const API_URL = 'http://localhost:8000/api/progress';

export const getDashboardData = async () => {
  // 1. Seedha 'token' key se data lein (kyunki image mein key ka naam 'token' hai)
  const token = localStorage.getItem('token'); 
  
  console.log("Found Token:", token); // Check karne ke liye

  if (!token) {
    throw new Error("Token nahi mila! Please login dobara karein.");
  }

  const config = {
    headers: {
      // Dhyan dein: Bearer ke baad space hona zaroori hai
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/dashboard`, config);
  return response.data;
};

