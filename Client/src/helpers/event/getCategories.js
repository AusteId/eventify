import axios from 'axios';

const backUrl = import.meta.env.VITE_BACK_URL;

const getCategories = async () => {
  const response = await axios.get(`${backUrl}/api/categories/all`);
  return response.data;
};

export default getCategories;
