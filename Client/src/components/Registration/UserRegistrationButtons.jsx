import { useOutletContext } from 'react-router';
import Button from '../button';
import SubmitButton from './SubmitButton';

const UserRegistrationButtons = () => {
  const { currentStep, nextStep, prevStep } = useOutletContext();

  return (
    <div className="flex justify-between">
      <Button onClick={prevStep}>previous</Button>

      <div className="absolute left-1/2 translate-x-[-50%]">
        <SubmitButton>skip</SubmitButton>
      </div>

      <SubmitButton>{currentStep == 3 ? 'finish' : 'next'}</SubmitButton>
    </div>
  );
};
export default UserRegistrationButtons;
