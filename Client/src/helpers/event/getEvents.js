import axios from 'axios';

const url = 'http://localhost:8080/api/events';

export const getEvents = async () => {
  const response = await axios.get(url);

  return response.data;
};
