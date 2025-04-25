import DefaultImage from '../../assets/no-image.png';
import Button from '../Button.jsx';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Auth/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import LoadingScreen from '../message/LoadingScreen.jsx';

const BanModal = ({closeModal, userBanId, username,setRefresh}) => {
  const {isDarkMode} = useDarkMode();
  const {userId, authFetch} = useAuth();
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const {handleSubmit, register, reset, formState: { errors }} = useForm();

  const adminId = userId;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await authFetch(`http://localhost:8080/api/admin/${userId}/username`, {
          method: 'GET',
        });
        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized");
        }
        const username = await response.text();
        setAdminName(username);
      } catch (error) {
        console.error(error.message || "Server Error");
      }
    };
    fetchUsername();
  }, []);

  const banUser = async (data) => {
    setLoading(true);
    try {
      // if the duration is empty it is considered a permanent ban
      const duration = data.duration ? parseInt(data.duration) : null;

      const enhancedData = {
        ...data,
        userId: userBanId,
        adminId: adminId,
        duration: duration
      };

      const response = await authFetch(`http://localhost:8080/api/admin/ban-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedData),
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Unauthorized");
        return;
      }

      if (response.ok) {
        toast.success(`User ${username} has been banned ${duration ? `for ${duration} days` : 'permanently'}`);
        reset();
        closeModal();
        setRefresh(prev => prev + 1);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to ban user");
      }
    } catch (error) {
      console.error(error.message || "Server Error");
      toast.error("Failed to ban user");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = e => {
    e.stopPropagation();
  };

  const FieldValidationError = ({ children }) => {
    if (!children) return null;
    return <p className="text-red-500 text-xs mt-1">{children}</p>;
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div
        onClick={closeModal}
        className="fixed z-20 bg-black/50 inset-0 flex justify-center items-center"
      >
        <div
          onClick={handleClick}
          className={`duration-750 border rounded-lg flex justify-center flex-col p-10 max-w-md w-full ${
            isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent'
          }`}
        >
          <p className={`text-xl font-bold duration-750 text-center pb-6 ${
            isDarkMode ? "text-[#f59e0b]" : "text-header-darker"
          }`}>Ban Panel</p>

          <div className="flex flex-col items-center mb-6">
            <img
              className="rounded-2xl w-40 mb-3"
              src={`http://localhost:8080/api/users/${userBanId}/avatar`}
              alt="User avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DefaultImage;
              }}
            />

            <div className="flex space-x-2 items-center mb-1">
              <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>User:</p>
              <p className={`capitalize ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}>{username}</p>
            </div>

            <div className="flex space-x-2 items-center">
              <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Admin:</p>
              <p className={`capitalize ${isDarkMode ? "text-[#f59e0b]" : "text-black"}`}>{adminName}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(banUser)} className="w-full mb-6">
            {/* Reason Input */}
            <div className="mb-4">
              <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Reason</p>
              <textarea
                placeholder="Enter ban reason"
                rows="3"
                className={`w-full bg-transparent resize-none py-2 px-3 rounded-md border outline-none ${
                  isDarkMode
                    ? "text-white border-gray-600 focus:outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b] focus:ring-opacity-50"
                    : "text-gray-900 border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                }`}
                {...register('reason', {
                  required: 'Ban reason is required',
                  minLength: {
                    value: 3,
                    message: 'Reason must be at least 3 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Reason cannot exceed 1000 characters',
                  },
                })}
              />
              <FieldValidationError>{errors.reason?.message}</FieldValidationError>
            </div>

            {/* Duration Input */}
            <div className="mb-4">
              <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Ban Duration (Days)
              </p>
              <label
                className={`input w-full border ${
                  isDarkMode
                    ? 'border-gray-600 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="number"
                  placeholder="Leave empty for permanent ban"
                  className={`w-full bg-transparent py-2 px-3 rounded-md ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                  {...register('duration', {
                    validate: (value) => {
                      if (value === "") return true; // Allow empty for permanent ban
                      const numValue = parseInt(value);
                      if (isNaN(numValue)) return "Please enter a valid number";
                      if (numValue < 1) return "Duration must be at least 1 day";
                      if (numValue > 365) return "Duration cannot exceed 365 days";
                      return true;
                    }
                  })}
                />
              </label>
              <FieldValidationError>{errors.duration?.message}</FieldValidationError>
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Note: If left empty, the ban will be permanent
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={closeModal}
                hoverColor={"hover:bg-slate-600 duration-750"}
                textColor={"text-white"}
                size={"large"}
                background={`bg-slate-900`}
                border={`border ${isDarkMode ? "border-[#f59e0b]" : "border-transparent"}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="large"
                background="bg-red-600"
                hoverColor="hover:bg-red-700"
                textColor="text-white"
                border="border-0"
              >
                Ban User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BanModal;