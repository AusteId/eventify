import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const getEvent = async (id)=>{
    const response = await axios.get(`${backUrl}/api/events/${id}`);
    return response.data;
}

export default getEvent;