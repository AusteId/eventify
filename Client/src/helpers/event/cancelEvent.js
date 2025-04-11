import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const cancelEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${backUrl}/api/events/${eventId}/register`,
      { withCredentials: true }
    );
    console.log('cancelEvent response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('cancelEvent error:', error.response?.data);
    throw error.response?.data || { error: "Unknown error during cancellation" };
  }
};
export default cancelEvent;

