import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const cancelEvent = async (eventId, token) => {
  const response = await axios.delete(
    `${backUrl}/api/events/${eventId}/register`,
    { withCredentials: true }
  );
  return response.data;
};

export default cancelEvent;