import { useForm } from 'react-hook-form';
import FieldValidationError from '../components/FieldValidationError';
import { useNavigate } from 'react-router';
import { useAuth } from '../components/Auth/AuthContext';
import { useNotifications } from '../components/context/NotificationContext';
import { useState } from 'react';
import LoadingScreen from '../components/message/LoadingScreen';
import toast from 'react-hot-toast';

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { timeoutForSuccess, timeoutForError } = useNotifications();
  const { login, loading } = useAuth();
 
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      const success = await login(data);
      if (success) {
        // timeoutForSuccess("Successfully logged in");
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
      <div className="desktop:w-112 tablet:w-112 mx-auto px-6 pt-12 pb-12 mt-[1.5rem]">
        <div className="bg-[#FFFFFF] w-full h-auto rounded-2xl shadow-md">
          <div className="text-center px-8 pt-8 pb-8">
            <h1 className="text-header-dark font-inter text-heading-m font-bold">
              Welcome Back!
            </h1>
            <p className="font-inter text-body-medium pt-1">
              Please enter your credentials to continue
            </p>
          </div>
          <form noValidate onSubmit={handleSubmit(onSubmit)} action="" className="px-8">
            <label
              className="block font-inter text-body-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email', {
                required: 'Email is required.',
              })}
            />
            <FieldValidationError>{errors.email?.message}</FieldValidationError>
            <label
              className="block font-inter text-body-medium mt-6 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 text-body-medium leading-tight focus:outline-none"
              id="password"
              type="password"
              placeholder="Password"
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
                value=""
                className="w-4 h-4 rounded-sm checkbox border-body-medium shadow-none text-body-medium"
              />
              <label
                className="font-inter text-body-medium ml-2"
                htmlFor="remember-checkbox"
              >
                Remember me
              </label>
            </div>
            <button 
            className="btn bg-btn w-full h-12 border-0 shadow-none text-white font-[500] hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg"
            disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <div className="flex justify-center gap-4 w-full text-center pt-6 pb-8">
            <p className="font-inter text-body-medium">
              Don&apos;t have an account?
            </p>
            <a className="text-btn-hover" href="/register">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
