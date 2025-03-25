import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const joinEvent = async (id)=>{
    const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/register`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
}

export default joinEvent;