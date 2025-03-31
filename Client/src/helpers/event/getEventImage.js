import axios from 'axios';

const backUrl = import.meta.env.VITE_BACK_URL;

const getEventImage = async eventId => {
  const url = `${backUrl}/api/events/${eventId}/picture`;

  const response = await axios.get(url, {
    responseType: 'blob',
  });
  return response.data;
};

export default getEventImage;
