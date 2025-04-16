import React from 'react';

const RegistrationSteps = ({ step }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="flex justify-center">
      <div className="flex gap-20 relative items-center">
        {steps.map(num => {
          let classname =
            'w-15 h-15 rounded-full bg-light-special z-1 text-center content-center';
          if (step == num) {
            classname =
              'w-15 h-15 rounded-full bg-btn z-1 text-center content-center';
          }

          return (
            <div className={classname}>
              <p className="font-bold text-white text-heading-m">{num}</p>
            </div>
          );
        })}
        <div className="absolute w-full h-1 bg-slate-400 z-0"></div>
      </div>
    </div>
  );
};

export default RegistrationSteps;
