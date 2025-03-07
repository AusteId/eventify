import { useRef } from 'react';
import RegistrationFirstStep from '../components/Registration/RegistrationFirstStep';
import RegistrationSecondStep from '../components/Registration/RegistrationSecondStep';
import RegistrationThirdStep from '../components/Registration/RegistrationThirdStep';
import RegistrationFourthStep from '../components/Registration/RegistrationFourthStep';
import { FormProvider, useForm } from 'react-hook-form';
import UserRegistrationButtons from '../components/Registration/UserRegistrationButtons';
import SubmitButton from '../components/Registration/SubmitButton';
import { useOutletContext } from 'react-router';

const steps = [
  RegistrationFirstStep,
  RegistrationSecondStep,
  RegistrationThirdStep,
  RegistrationFourthStep,
];

const UserRegistration = () => {
  const { currentStep, setCurrentStep } = useOutletContext();

  const methods = useForm();
  const formRef = useRef();

  const Forms = steps[currentStep];

  return (
    <div className="h-full flex flex-col items-center mt-12">
      <FormProvider {...methods}>
        <div className="flex flex-col p-8 bg-white w-112 rounded-2xl shadow-[0px_10px_15px_rgba(0,0,0,0.10)]">
          <Forms ref={formRef} setCurrentStep={setCurrentStep}/>

          {currentStep === 0 ? (
            <SubmitButton
              type={'submit'}
              onClick={() => formRef.current?.submitForm()}
            >
              Continue
            </SubmitButton>
          ) : (
            <UserRegistrationButtons />
          )}
        </div>
      </FormProvider>
    </div>
  );
};
export default UserRegistration;
