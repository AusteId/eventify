import { createContext, useContext, useState } from "react";


const NotificationContext = createContext()

export const useNotification = () => {
    return useContext(NotificationContext)
}

export const NotificationProvider = ({children}) => {
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("")

    const timeoutForError = (message) => {
        const errorMessage = typeof message === 'string' ? message : 'An error occurred';
        setError(errorMessage);
        setTimeout(() => {
            setError("");
        }, 3000);
    }

    const timeoutForSuccess = (message) => {
        setSuccess(message)
        setTimeout(() => {
            setSuccess("")
        },1500)
    }

    return ( 
        <>
        <NotificationContext.Provider value={{error,success,timeoutForError,timeoutForSuccess}}>
            {children}
        </NotificationContext.Provider>
        </>
     );
}
 