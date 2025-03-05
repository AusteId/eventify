import SubmitButton from './SubmitButton';

const UserRegistrationButtons = ({ currentStep, setCurrentStep }) => {
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="flex justify-between">

      <SubmitButton onClick={prevStep}>previous</SubmitButton>

      <div className="absolute left-1/2 translate-x-[-50%]">
        <SubmitButton>skip</SubmitButton>
      </div>

      <SubmitButton>{currentStep == 3 ? 'finish' : 'next'}</SubmitButton>
    </div>
  );
};
export default UserRegistrationButtons;
