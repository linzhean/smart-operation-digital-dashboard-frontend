import axios from "axios";

const BASE_URL = ' http://127.0.0.1:8000';

export const fetchData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};