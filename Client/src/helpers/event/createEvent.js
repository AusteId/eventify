import axios from 'axios';

const createEvent = async data => {
  const response = await axios.post(
    import.meta.env.VITE_BACK_URL + '/api/events',
    data,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

export default createEvent;
