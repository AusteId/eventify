const BanHistorySVG = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
      <path d="M4 5v3a1 1 0 0 0 1 1h3"></path>
      <path d="M4 13v3a1 1 0 0 0 1 1h3"></path>
      <path d="M16 4h3a1 1 0 0 1 1 1v3"></path>
      <path d="M16 20h3a1 1 0 0 0 1-1v-3"></path>
    </svg>
  );
};

export default BanHistorySVG;