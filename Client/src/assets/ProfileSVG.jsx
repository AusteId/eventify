import { useNotifications } from "../components/context/NotificationContext";

const ProfileSVG = () => {
    const {isDarkMode} = useNotifications();
  return (
    <svg
      viewBox="0 0 24 24"
      fill={`${isDarkMode ? "none" : "#f59e0b"}`}
      stroke={`${isDarkMode ? "currentColor" : "#f59e0b"}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 "
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
};

export default ProfileSVG;
