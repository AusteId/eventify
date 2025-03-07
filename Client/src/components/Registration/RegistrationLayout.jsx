import { Outlet } from 'react-router';
import RegistrationHeader from '../Header/RegistrationHeader';
import { useState } from 'react';

const RegistrationLayout = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-full flex flex-col">
      <RegistrationHeader currentStep={currentStep  + 1} />
      <div className="flex-1">
        <Outlet context={{ currentStep, setCurrentStep }} />
      </div>
    </div>
  );
};

export default RegistrationLayout;
