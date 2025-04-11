import axios from "axios";
import { CloudCog } from "lucide-react";

const backUrl = import.meta.env.VITE_BACK_URL;

const joinEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `${backUrl}/api/events/${eventId}/register`,
        {},
        { withCredentials: true }
      );
      console.log('joinEvent response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('joinEvent error:', error.response?.data);
      throw error.response?.data || { error: "Unknown error during registration" };
    }
  };

export default joinEvent;