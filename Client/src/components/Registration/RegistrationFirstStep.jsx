import { useFormContext } from 'react-hook-form';
import email from '../../assets/userRegistration/email-Icon.svg';
import password from '../../assets/userRegistration/password-Icon.svg';
import username from '../../assets/userRegistration/username-Icon.svg';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import FieldValidationError from '../FieldValidationError';
import { useOutletContext } from 'react-router';
import Button from '../Button';
import { useNotification } from '../context/NotificationContext';
import LoadingScreen from '../message/LoadingScreen';

const RegistrationFirstStep = forwardRef((props, ref) => {
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { nextStep } = useOutletContext();
  const { timeoutForError, url } = useNotification();
  const [isLoading, setIsLoading] = useState(false)

  RegistrationFirstStep.displayName = "RegistrationFirstStep";

  const {
    register,
    formState: { errors },
    watch,
    trigger,
    getValues,
    setError: setFormError,
    clearErrors,
  } = useFormContext();

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
    setIsLoading(true)
    try {
      const response = await fetch(`${url}/api/users/check-availability?username=${encodeURIComponent(usernameValue)}&email=${encodeURIComponent(emailValue)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        timeoutForError('Failed to check username/email availability');
        return false;
      }

      const data = await response.json();

      let isValid = true;

      if (data.usernameExists) {
        setUsernameError('This username is already taken');
        setFormError('username', { type: 'manual', message: 'This username is already taken' });
        isValid = false;
      }

      if (data.emailExists) {
        setEmailError('This email is already registered');
        setFormError('email', { type: 'manual', message: 'This email is already registered' });
        isValid = false;
      }

      return isValid;
    } catch (error) {
      timeoutForError(error.message || "Failure checking credentials")
      return false;
    } finally {
      setIsValidating(false);
      setIsLoading(false)
    }
  };

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      const fieldsValid = await trigger(["username", "email", "password", "passwordConfirm"]);
      const passwordsMatch = validatePasswordsMatch(passwordValue, passwordConfirmValue);

      if (!fieldsValid || !passwordsMatch) {
        return false;
      }
      return await checkExistingCredentials();
    }
  }));

  const onNext = () => {
    nextStep();
  };
  
  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="flex flex-col gap-8  mt-[3rem] bg-white rounded-2xl shadow-md px-9 pt-8 pb-12">
        <div>
          <h1 className="font-bold text-black text-center text-heading-m/normal mb-12">
            Create your account
          </h1>
          <p className="text-body-m/[1rem] text-body-medium">
            Join Eventify to discover amazing events near you
          </p>
        </div>

        <div>
          <fieldset className="fieldset gap-y-6 mb-6">
            <div>
              <p className="text-body-medium text-sm/normal font-[500]">
                Username
              </p>
              <label className="input w-full">
                <img src={username} alt="username icon" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  {...register('username', {
                    required: 'Username is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9]{3,100}$/g,
                      message: 'Username must be from 3 to 100 characters',
                    },
                  })}
                />
              </label>
              <FieldValidationError>{errors.username?.message || usernameError}</FieldValidationError>
            </div>

            <div>
              <p className="text-body-medium text-sm/normal font-[500]">
                Email address
              </p>
              <label className="input w-full">
                <img src={email} alt="email icon" />
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
              <FieldValidationError>{errors.email?.message || emailError}</FieldValidationError>
            </div>

            <div>
              <p className="text-body-medium text-sm/normal font-[500]">
                Password
              </p>
              <label className="input w-full">
                <img src={password} alt="password icon" />
                <input
                  type="password"
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required.',
                    minLength: { value: 8, message: 'Password must be at least 8 characters long.' },
                    maxLength: { value: 255, message: 'Password cannot exceed 255 characters.' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[\S]{8,255}$/,
                      message: 'Password must have an uppercase, lowercase, number',
                    },
                  })}
                />
              </label>
              <FieldValidationError>{errors.password?.message}</FieldValidationError>
            </div>

            <div>
              <p className="text-body-medium text-sm/normal font-[500]">
                Confirm Password
              </p>
              <label className="input w-full">
                <img src={password} alt="password icon" />
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
            <Button onClick={onNext} disabled={isValidating} isFull>
              {isValidating ? 'Validating...' : 'Continue'}
            </Button>
          </div>
          <div className="flex justify-center gap-4 w-full text-center pt-6 ">
            <p className="font-inter text-body-medium">
            Already have an account?
            </p>
            <a className="text-btn-hover" href="/login">
            Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  );
});

export default RegistrationFirstStep;