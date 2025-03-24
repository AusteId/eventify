import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const joinEvent = async (id)=>{
    const response = await axios.post(`${backUrl}/api/events/${id}/register`);
    return response.data;
}

export default joinEvent;