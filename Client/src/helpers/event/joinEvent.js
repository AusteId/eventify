import axios from "axios";
import { CloudCog } from "lucide-react";

const backUrl = import.meta.env.VITE_BACK_URL;

const joinEvent = async (eventId)=>{
    try {
        const response = await axios.post(`${backUrl}/api/events/${eventId}/register`, 
            {}, 
            // { headers: { Authorization: `Bearer ${token}` } }
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
          
        );
console.log("response:", response);


        return response.data;
      } catch (error) {
        console.log(error);
        
        throw new Error(error.response?.data || 'Error joining event');
      }
    };

export default joinEvent;