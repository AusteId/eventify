import axios from "axios";
import { CloudCog } from "lucide-react";

const backUrl = import.meta.env.VITE_BACK_URL;

const joinEvent = async (eventId, token)=>{
    try{
    const response = await axios.post(
        `${backUrl}/api/events/${eventId}/register`,
        {}, 
        { withCredentials: true }
    );
    return response.data;
} catch (error) {
    throw error.response?.data || { error: "Unknown error during registration" };
};

}

export default joinEvent;