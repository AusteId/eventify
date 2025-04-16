import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate, useOutletContext } from 'react-router';
import Button from '../Button';
import { useNotifications } from '../context/NotificationContext';
import FieldValidationError from '../FieldValidationError';
import LoadingScreen from '../message/LoadingScreen';
import RegistrationSteps from '../RegistrationSteps';
import UsernameIconSVG from '../../assets/userRegistration/UsernameIconSVG';
import EmailIconSVG from '../../assets/userRegistration/EmailIconSVG';
import PasswordIconSVG from '../../assets/userRegistration/PasswordIconSVG';

const RegistrationFirstStep = forwardRef((props, ref) => {
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { nextStep } = useOutletContext();
  const { timeoutForError, url } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useNotifications();

  RegistrationFirstStep.displayName = 'RegistrationFirstStep';

  const {
    register,
    formState: { errors },
    watch,
    trigger,
    setError: setFormError,
    clearErrors,
  } = useFormContext();

  const navigate = useNavigate();

  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');
  const usernameValue = watch('username');
  const emailValue = watch('email');

  const validatePasswordsMatch = (pass, repeat) => {
    if (pass && repeat && pass !== repeat) {
      setPasswordMatchError('Passwords do not match');
      return false;
    } else {
      setPasswordMatchError('');
      return true;
    }
  };

  useEffect(() => {
    validatePasswordsMatch(passwordValue, passwordConfirmValue);
  }, [passwordValue, passwordConfirmValue]);

  const checkExistingCredentials = async () => {
    setIsValidating(true);
    setUsernameError('');
    setEmailError('');
    clearErrors(['username', 'email']);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${url}/api/users/check-availability?username=${encodeURIComponent(usernameValue)}&email=${encodeURIComponent(emailValue)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        timeoutForError('Failed to check username/email availability');
        return false;
      }

      const data = await response.json();

      let isValid = true;

      if (data.usernameExists) {
        setUsernameError('This username is already taken');
        setFormError('username', {
          type: 'manual',
          message: 'This username is already taken',
        });
        isValid = false;
      }

      if (data.emailExists) {
        setEmailError('This email is already registered');
        setFormError('email', {
          type: 'manual',
          message: 'This email is already registered',
        });
        isValid = false;
      }

      return isValid;
    } catch (error) {
      timeoutForError(error.message || 'Failure checking credentials');
      return false;
    } finally {
      setIsValidating(false);
      setIsLoading(false);
    }
  };

  const zalgoRegex =
    /[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/;

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const fieldsValid = await trigger([
        'username',
        'email',
        'password',
        'passwordConfirm',
      ]);

      const passwordsMatch = validatePasswordsMatch(
        passwordValue,
        passwordConfirmValue,
      );

      if (!fieldsValid || !passwordsMatch || zalgoRegex.test(passwordValue)) {
        return false;
      }
      return await checkExistingCredentials();
    },
  }));

  const onNext = () => {
    nextStep();
  };

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <RegistrationSteps step={1} />
      <div
        className={`flex flex-col gap-8 duration-750  mt-[3rem] rounded-2xl border shadow-md px-9 pt-8 pb-12 ${isDarkMode ? 'text-gray-300 bg-slate-900 border-[#f59e0b]' : 'bg-white border-transparent text-body-medium'}`}
      >
        <div>
          <h1
            className={`font-bold text-center text-heading-m/normal mb-12 duration-750 ${isDarkMode ? 'text-[#f59e0b]' : 'text-header-dark'}`}
          >
            Create your account
          </h1>
          <p className="text-body-m/[1rem]">
            Join Eventify to discover amazing events near you
          </p>
        </div>

        <div>
          <fieldset className="fieldset gap-y-6 mb-6">
            <div>
              <p className="text-sm/normal font-[500]">Username</p>
              <label
                className={`input w-full border ${
                  isDarkMode
                    ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                    : 'border-gray-300'
                }`}
              >
                <UsernameIconSVG isDarkMode={isDarkMode} />
                <input
                  type="text"
                  placeholder="Choose a username"
                  className={``}
                  {...register('username', {
                    required: 'Username is required.',
                    minLength: {
                      value: 3,
                      message: 'Username must be from 3 to 100 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Username must be from 3 to 100 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/g,
                      message:
                        'Username can contain lowercase, uppercase and numbers',
                    },
                  })}
                />
              </label>
              <FieldValidationError>
                {errors.username?.message || usernameError}
              </FieldValidationError>
            </div>

            <div>
              <p className="text-sm/normal font-[500]">Email address</p>
              <label
                className={`input w-full border ${
                  isDarkMode
                    ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                    : 'border-gray-300'
                }`}
              >
                <EmailIconSVG isDarkMode={isDarkMode} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value:
                        /^(?=.{3,254}$)(?=.{1,64}@)(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,}$/g,
                      message: 'Email not Valid (your@email.com)',
                    },
                  })}
                />
              </label>
              <FieldValidationError>
                {errors.email?.message || emailError}
              </FieldValidationError>
            </div>

            <div>
              <p className="text-sm/normal font-[500]">Password</p>
              <label
                className={`input w-full border ${
                  isDarkMode
                    ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                    : 'border-gray-300'
                }`}
              >
                <PasswordIconSVG isDarkMode={isDarkMode} />
                <input
                  type="password"
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required.',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long.',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Password cannot exceed 255 characters.',
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/,
                      message:
                        'The password must have an uppercase letter, lowercase letter, number, and a wildcard',
                    },
                  })}
                />
              </label>
              <FieldValidationError>
                {errors.password?.message}
              </FieldValidationError>
            </div>

            <div>
              <p className="text-sm/normal font-[500]">Confirm Password</p>
              <label
                className={`input w-full border ${
                  isDarkMode
                    ? 'border-gray-200 bg-transparent text-gray-200 focus-within:border-[#f59e0b] focus-within:ring focus-within:ring-[#f59e0b] focus-within:ring-opacity-50'
                    : 'border-gray-300'
                }`}
              >
                <PasswordIconSVG isDarkMode={isDarkMode} />
                <input
                  type="password"
                  placeholder="Retype your password"
                  {...register('passwordConfirm', {
                    required: 'Confirm password.',
                  })}
                />
              </label>
              <FieldValidationError>
                {errors.passwordConfirm?.message || passwordMatchError}
              </FieldValidationError>
            </div>
          </fieldset>

          <div className="flex justify-center ">
            <Button size="large" onClick={onNext} disabled={isValidating} isFull>
              {isValidating ? 'Validating...' : 'Continue'}
            </Button>
          </div>
          <div className="flex justify-center gap-4 w-full text-center pt-6 ">
            <p className="font-inter">Already have an account?</p>
            <a
              className="duration-750 text-btn-hover cursor-pointer hover:text-[#f59e0b]"
              onClick={() => navigate('/login')}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RegistrationFirstStep;
