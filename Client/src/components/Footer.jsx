import { useDarkMode } from './context/DarkModeContext.jsx';

const Footer =() => {

  const { isDarkMode } = useDarkMode();

    return(
        <section className={`h-16 flex justify-center items-center text-body-s duration-750 border   ${isDarkMode ? "text-[#f59e0b] border-[#f59e0b] bg-slate-900 shadow-lg shadow-slate-900" : "bg-white border-input-light text-light"}`}>
            <h2>© 2025 Eventify. All rights reserved.</h2>
        </section>
    )
}
export default Footer;
