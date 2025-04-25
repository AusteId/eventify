import { useDarkMode } from '../components/context/DarkModeContext.jsx';

const AdminPanelSVG = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <svg
      viewBox="0 0 24 24"
      fill={`${isDarkMode ? "none" : "none"}`}
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <path d="M9 21V9"></path>
      <circle cx="15" cy="15" r="2"></circle>
      <path d="M15 13v-1"></path>
      <path d="M15 18v-1"></path>
      <path d="M13 15h-1"></path>
      <path d="M18 15h-1"></path>
    </svg>
  );
};

export default AdminPanelSVG;
