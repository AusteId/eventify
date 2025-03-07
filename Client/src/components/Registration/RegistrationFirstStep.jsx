import { useFormContext } from 'react-hook-form';
import email from '../../assets/userRegistration/email-Icon.svg';
import password from '../../assets/userRegistration/password-Icon.svg';
import location from '../../assets/userRegistration/location-Icon.svg';
import username from '../../assets/userRegistration/username-Icon.svg';
import { useEffect, useImperativeHandle, useState } from 'react';
import FieldValidationError from '../FieldValidationError';

const RegistrationFirstStep = ({ setCurrentStep, ref }) => {
  const [error, setError] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useFormContext({
    mode: 'onChange',
  });

  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');

  const validatePasswordsMatch = (pass, repeat) => {
    if (pass && repeat && pass !== repeat) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };

  useEffect(() => {
    validatePasswordsMatch(passwordValue, passwordConfirmValue);
  }, [passwordValue, passwordConfirmValue]);

  const formSubmitHandler = async data => {
    try {
      // <<<<<<<PLACEHOLDER>>>>>>>>
      //await postData(data);
      // <<<<<<<PLACEHOLDER>>>>>>>>
      console.log('test');
      setCurrentStep(prev => setCurrentStep(prev + 1));
    } catch (error) {
      setError(error);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(formSubmitHandler)(),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-bold text-black text-center text-heading-m/normal mb-3">
          Create your account
        </h1>
        <p className="text-body-m/[1rem] text-body-medium">
          Join Eventify to discover amazing events near you
        </p>
      </div>

      <form onSubmit={handleSubmit(formSubmitHandler)} noValidate>
        <fieldset className="fieldset gap-y-6 mb-6">
          <div>
            <p className="text-body-medium text-sm/normal font-[500]">
              Username
            </p>
            <label className="input w-full">
              <img src={username} alt="email icon" />
              <input
                type="text"
                placeholder="Choose a username"
                {...register('username', {
                  required: 'Username is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/g,
                    message: 'Email not Valid (your@email.com)',
                  },
                })}
              />
            </label>
            <FieldValidationError>{errors.username?.message}</FieldValidationError>
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
                      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g,
                    message: 'Email not Valid (your@email.com)',
                  },
                })}
              />
            </label>
            <FieldValidationError>{errors.email?.message}</FieldValidationError>
          </div>

          <div>
            <p className="text-body-medium text-sm/normal font-[500]">
              Location
            </p>
            <label className="input w-full">
              <img src={location} alt="location icon" />
              <input
                type="text"
                placeholder="Choose a username"
                {...register('location', {
                  required: 'Location is required.',
                  pattern: {
                    value:
                      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/g,
                    message: 'Email not Valid (your@email.com)',
                  },
                })}
              />
            </label>
            <FieldValidationError>{errors.location?.message}</FieldValidationError>
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
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).+$/gm,
                    message:
                      'Password must have an uppercase, lowercase, and a number.',
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
                required
                placeholder="Retype your password"
                {...register('passwordConfirm', {
                  required: 'Confirm password.',
                })}
              />
            </label>
            <FieldValidationError>{errors.passwordConfirm?.message || passwordMatchError}</FieldValidationError>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default RegistrationFirstStep;
