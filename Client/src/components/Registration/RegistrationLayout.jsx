import { Outlet } from 'react-router';
import RegistrationHeader from '../Header/RegistrationHeader';
import { useState } from 'react';

const RegistrationLayout = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const prevStep = () =>
    setCurrentStep(prev => Math.max(prev - 1, 0));

  const nextStep = () =>
    setCurrentStep(prev => Math.min(prev + 1, 3));

  return (
    <div className="min-h-full flex flex-col">
      <RegistrationHeader currentStep={currentStep} />
      <div className="flex-1">
        <Outlet context={{ currentStep, nextStep, prevStep }} />
      </div>
    </div>
  );
};

export default RegistrationLayout;
