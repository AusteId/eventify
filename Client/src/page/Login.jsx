import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FieldValidationError from '../components/FieldValidationError';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async data => {
    try {
      const response = await axios.post('api', {
        email: data.email,
        password: data.password,
      });

      console.log('Login successful:', response.data);
    } catch {
      console.error('Login failed: ', errors.response?.data || errors.message);
    }
  };

  return (
    <div className="desktop:w-112 tablet:w-112 mx-auto px-6 pt-12 pb-12">
      <div className="bg-[#FFFFFF] w-full h-auto rounded-2xl shadow-md">
        <div className="text-center px-8 pt-8 pb-8">
          <h1 className="text-header-dark font-inter text-heading-m font-bold">
            Welcome Back!
          </h1>
          <p className="font-inter text-body-medium pt-1">
            Please enter your credentials to continue
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action="" className="px-8">
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
            placeholder="••••••••"
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
          <button className="btn bg-btn w-full h-12 border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg">
            Sign In
          </button>
        </form>
        <div className="w-full text-center pt-6 pb-8">
          <p className="font-inter text-body-medium">
            Don't have an account?{' '}
            <a className="text-btn-hover" href="/register">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
