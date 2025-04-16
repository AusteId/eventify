import { useNotifications } from './context/NotificationContext';

const RegistrationSteps = ({ step }) => {
  const steps = [1, 2, 3, 4];
  const {isDarkMode} = useNotifications();

  return (
    <div className="flex justify-center">
      <div className="flex gap-20 relative items-center">
        {steps.map((num,index) => {
          let classname =
            `w-15 h-15 rounded-full z-1 text-center border duration-750 content-center ${isDarkMode ? "bg-slate-900 border-[#f59e0b]" : "bg-light-special border-transparent"}`;
          if (step == num) {
            classname =
              `w-15 h-15 rounded-full duration-750 z-1 border text-center content-center ${isDarkMode ? "shadow-md shadow-[#f59e0b] bg-amber-700 border-[#f59e0b]" : "bg-btn border-transparent"}`;
          }

          return (
            <div className={classname} key={index}>
              <p className={`font-bold text-heading-m ${isDarkMode ? "text-gray-200" : "text-white"}`}>{num}</p>
            </div>
          );
        })}
        <div className={`absolute w-full duration-750 h-1 z-0 ${isDarkMode ? "bg-gray-400" : "bg-slate-400"}`}></div>
      </div>
    </div>
  );
};

export default RegistrationSteps;
