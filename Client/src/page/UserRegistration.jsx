import { useState } from "react";
import RegistrationFirstStep from "../components/RegistrationFirstStep";
import RegistrationSecondStep from "../components/RegistrationSecondStep";
import RegistrationThirdStep from "../components/RegistrationThirdStep";
import RegistrationFourthStep from "../components/RegistrationFourthStep";
import Button from "../components/button";
import UserRegistrationButtons from "../components/UserRegistrationButtons";

const steps = [RegistrationFirstStep, RegistrationSecondStep, RegistrationThirdStep, RegistrationFourthStep];

const UserRegistration = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    const StepComponent = steps[currentStep];

    return (
        <div className="flex flex-col items-center mt-17 ">
            <div className="flex flex-col p-8 bg-white w-112">
                <StepComponent />
                <p>Current step: {currentStep + 1}</p>

                {currentStep === 0 && <Button onClick={nextStep}>Continue</Button>}

                {currentStep > 0 && <UserRegistrationButtons setCurrentStep={setCurrentStep}/>}
            </div>
        </div>
    )
}
export default UserRegistration;