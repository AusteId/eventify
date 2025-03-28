import axios from "axios";

const backUrl = import.meta.env.VITE_BACK_URL;

const getEvent = async (id)=>{
    // try{
    const response = await axios.get(`${backUrl}/api/events/${id}`);
    return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || 'Error fetching event ');
//   }
}


export default getEvent;