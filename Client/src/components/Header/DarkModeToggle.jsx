import { useEffect, useState } from "react";
import LightModeSvg from "../../assets/LightModeSvg";
import DarkModeSvg from "../../assets/DarkModeSvg";
import { useNotifications } from "../context/NotificationContext";


const DarkModeToggle = () => {
    const [isStartingPoint, setIsStartingPoint] = useState(false)
    const { isDarkMode, setIsDarkMode } = useNotifications();

    useEffect(() => {
        setIsDarkMode(!!localStorage.getItem("dark-mode") || false)
        setIsStartingPoint(!!localStorage.getItem("dark-mode") || false)
    }, [])

    return (
        <>
            <div className="flex ">
                {isDarkMode ? <>
                    <div onClick={() => {
                        setIsDarkMode(prev => !prev,
                            localStorage.setItem("dark-mode", !isDarkMode)
                        )
                        setIsStartingPoint(prev => !prev)
                    }} className="cursor-pointer duration-250 hover:bg-white rounded-md p-1">
                        <DarkModeSvg />
                    </div>
                </>
                    :
                    <>
                        <div onClick={() => {
                            setIsDarkMode(prev => !prev,
                                localStorage.setItem("dark-mode", !isDarkMode)
                            )
                            setIsStartingPoint(prev => !prev)
                        }} className="cursor-pointer duration-250 hover:bg-gray-100 rounded-md p-1">
                            <LightModeSvg />
                        </div>
                    </>}


            </div>
        </>);
}

export default DarkModeToggle;