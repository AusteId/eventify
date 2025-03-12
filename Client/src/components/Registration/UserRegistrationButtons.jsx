import { useNavigate, useOutletContext } from 'react-router';
import Button from '../button';
import SubmitButton from './SubmitButton';

const UserRegistrationButtons = () => {
  const { currentStep, nextStep, prevStep, formRefs, finalSubmit } = useOutletContext();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (currentStep === 3) {
      if (formRefs.current[3]) {
        const isValid = await formRefs.current[3].validateStep();
        if (isValid) {
          finalSubmit();
        }
      }
    } else {
      if (formRefs.current[currentStep]) {
        const isValid = await formRefs.current[currentStep].validateStep();
        if (isValid) {
          nextStep();
          navigate(`/register/${currentStep === 0 ? "step2" : currentStep === 1 ? "step3" : "step4"}`);
        }
      }
    }
  };

  const handlePrev = () => {
    prevStep();
    navigate(`/register${currentStep === 1 ? "" : currentStep === 2 ? "/step2" : "/step3"}`);
  };

  const handleSkip = () => {
    nextStep();
    navigate(`/register/${currentStep === 0 ? "step2" : currentStep === 1 ? "step3" : "step4"}`);
  };

  return (
    <div className="flex justify-between">
      {currentStep > 0 && <Button onClick={handlePrev}>Back</Button>}

      {currentStep < 3 && currentStep > 0 && (
        <div className="absolute left-1/2 translate-x-[-50%]">
          <SubmitButton onClick={handleSkip}>Skip</SubmitButton>
        </div>
      )}

      <SubmitButton onClick={handleNext}>
        {currentStep === 3 ? "Finish" : "Next"}
      </SubmitButton>
    </div>
  );
};

export default UserRegistrationButtons;
