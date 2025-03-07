import { useFormContext } from 'react-hook-form';
import email from '../../assets/userRegistration/email-Icon.svg';
import password from '../../assets/userRegistration/password-Icon.svg';
import location from '../../assets/userRegistration/location-Icon.svg';
import username from '../../assets/userRegistration/username-Icon.svg';
import { useImperativeHandle, useState } from 'react';

const RegistrationFirstStep = ({ setCurrentStep, ref }) => {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const formSubmitHandler = async (data) => {
    try {
      //await postData(data);
      // <<<<<<<PLACEHOLDER>>>>>>>>
      console.log("test");
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
                  required: 'username is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/g,
                    message: 'Email not Valid (your@email.com)',
                  },
                })}
              />
            </label>
            <div className="flex justify-center text-red-600 drop-shadow-lg">
              {errors.username?.message}
            </div>
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
            <div className="flex justify-center text-red-600 drop-shadow-lg">
              {errors.email?.message}
            </div>
          </div>

          <div>
            <p className="text-body-medium text-sm/normal font-[500]">
              Location
            </p>
            <label className="input w-full">
              <img src={location} alt="email icon" />
              <input
                type="email"
                placeholder="Choose a username"
                {...register('location', {
                  required: 'location is required.',
                  pattern: {
                    value:
                      /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/g,
                    message: 'Email not Valid (your@email.com)',
                  },
                })}
              />
            </label>
            <div className="flex justify-center text-red-600 drop-shadow-lg">
              {errors.location?.message}
            </div>
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
                  required: 'password is required.',
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).+$/gm,
                    message:
                      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                  },
                })}
              />
            </label>
            <div className="flex justify-center text-red-600 drop-shadow-lg">
              {errors.password?.message}
            </div>
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
                {...register('passwordRepeat', {
                  required: 'password is required.',
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).+$/gm,
                    message:
                      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                  },
                })}
              />
            </label>
            <div className="flex justify-center text-red-600 drop-shadow-lg">
              {errors.passwordRepeat?.message}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
export default RegistrationFirstStep;
