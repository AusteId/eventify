import { useNotifications } from "./context/NotificationContext";

const Footer =() => {

    const {isDarkMode} = useNotifications();

    return(
        <section className={`h-16 flex justify-center items-center text-body-s   ${isDarkMode ? "text-[#f59e0b] bg-slate-800" : "bg-white border border-input-light text-light"}`}>
            <h2>© 2025 Eventify. All rights reserved.</h2>
        </section>
    )
}
export default Footer;
