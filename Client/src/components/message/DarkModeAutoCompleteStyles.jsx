import { useDarkMode } from '../context/DarkModeContext.jsx';

const DarkModeAutocompleteStyles = () => {
  const { isDarkMode } = useDarkMode();

    return (
      <style>{`
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px ${isDarkMode ? "#0f172b" : "#fff"} inset !important;
              -webkit-text-fill-color: ${isDarkMode ? "#e5e7eb" : "#000"} !important;
              ${isDarkMode && "caret-color: #e5e7eb !important;"}
              transition: background-color 99999s ease-in-out 0s;
            }
            
            input:autofill {
              background-color: #1e293b !important;
              color: #f8fafc !important;
            }
          `}</style>
    );
};

export default DarkModeAutocompleteStyles;
