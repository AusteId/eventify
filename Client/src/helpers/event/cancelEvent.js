import axios from 'axios';

const backUrl = import.meta.env.VITE_BACK_URL;

const cancelEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${backUrl}/api/events/${eventId}/register`, 
        {}, 
        {
          withCredentials: true,
          headers: {
              "Content-Type": "application/json"
          }
      }
    
      
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Error cancelling registration');
  }
};

export default cancelEvent;