import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const cancelEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${backUrl}/api/events/${eventId}/register`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Unknown error during cancellation' };
  }
};

export default cancelEvent;