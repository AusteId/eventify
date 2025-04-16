import { useForm } from 'react-hook-form';
import FieldValidationError from '../components/FieldValidationError';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/Auth/AuthContext';
import { useNotifications } from '../components/context/NotificationContext';
import LoadingScreen from '../components/message/LoadingScreen';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { timeoutForError, isDarkMode } = useNotifications();
  const { login, loading } = useAuth();
  const [rememberMe,setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email",savedEmail)
      setRememberMe(true);
    }
  },[setValue])

  const onSubmit = async data => {
    try {
      if (rememberMe) {
        localStorage.setItem("savedEmail",data.email)
      } else {
        localStorage.removeItem("savedEmail");
      }
      const success = await login({
        email: data.email,
        password: data.password,
        rememberMe: rememberMe
      });
      if (success) {
        toast.success('Successfully logged in!');
        reset();
      }
    } catch (error) {
      timeoutForError(error.message || 'Something went wrong');
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div
        className={`desktop:w-112 tablet:w-112 mx-auto px-6 pt-12 pb-12 mt-[1.5rem]`}
      >
        <div
          className={`bg-[#FFFFFF] w-full h-auto rounded-2xl shadow-md duration-750 border ${isDarkMode ? 'bg-slate-900 border-[#f59e0b]' : "border-transparent"}`}
        >
          <div className="text-center px-8 pt-8 pb-8">
            <h1
              className={` font-inter text-heading-m font-bold ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}
            >
              Welcome Back!
            </h1>
            <p
              className={`font-inter pt-1 duration-750 ${isDarkMode ? 'text-gray-200' : 'text-body-medium'}`}
            >
              Please enter your credentials to continue
            </p>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="px-8"
            method='post'
            name='login-form'
          >
            <label
              className={`block font-inter mb-2 duration-750 ${isDarkMode ? 'text-gray-200' : 'text-header-dark'}`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
  ${
    isDarkMode
      ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
      : 'focus:outline-none '
  }`}
              id="email"
              type="email"
              name='email'
              autoComplete='username'
              placeholder="your@email.com"
              {...register('email', {
                required: 'Email is required.',
              })}
            />
            <FieldValidationError>{errors.email?.message}</FieldValidationError>
            <label
              className={`block font-inter mb-2 mt-6 ${isDarkMode ? 'text-gray-200' : 'text-header-dark'}`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 leading-tight 
  ${
    isDarkMode
      ? 'focus:border-[#f59e0b] text-gray-200 focus:outline-none focus:ring focus:ring-[#f59e0b] focus:ring-opacity-50 placeholder:text-gray-400'
      : 'focus:outline-none '
  }`}
              id="password"
              type="password"
              name='password'
              autoComplete='current-password'
              placeholder="Ex: SecretPassword99!"
              {...register('password', {
                required: 'Password is required.',
              })}
            />
            <FieldValidationError>
              {errors.password?.message}
            </FieldValidationError>
            <div className="flex items-center mt-6 mb-6">
              <input
                id="remember-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`w-6 h-6 rounded-sm checkbox shadow-none  ${isDarkMode ? 'text-[#f59e0b] border-gray-300' : 'text-body-medium border-body-medium'}`}
              />
              <label
                className={`font-inter ml-2 ${isDarkMode ? 'text-gray-300' : 'text-body-medium'}`}
                htmlFor="remember-checkbox"
              >
                Remember me
              </label>
            </div>
            <button
              className={`btn  w-full h-12 border-0 shadow-none  font-[500]  px-4 pt-2 pb-2 rounded-lg ${isDarkMode ? 'bg-amber-500 hover:bg-amber-600 text-gray-200' : 'hover:bg-btn-hover text-white bg-btn'}`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <div className="flex justify-center gap-4 w-full text-center pt-6 pb-8">
            <p
              className={`font-inter ${isDarkMode ? 'text-gray-300' : 'text-body-medium'}`}
            >
              Don&apos;t have an account?
            </p>
            <button
              className="duration-750 text-btn-hover cursor-pointer hover:text-[#f59e0b]"
              onClick={() => navigate('/register')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
