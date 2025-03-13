import { Outlet, useLocation, useNavigate } from 'react-router';
import RegistrationHeader from '../Header/RegistrationHeader';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNotification } from '../context/NotificationContext';
import config from '../../helpers/config';

const RegistrationLayout = ({ formRefs }) => {
  const {timeoutForSuccess,timeoutForError,url} = useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {registerUserUrl} = config;

  const location = useLocation()

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      birthDate: "",
      description: "",
      city: "",
      categoryIds:[],
    }
  });

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);

    if (newStep === 0) {
      navigate("/register");
    } else {
      navigate(`/register/step${newStep + 1}`);
    }
  };

  const nextStep = async () => {
    if (formRefs.current[currentStep]) {
      try {
        const isValid = await formRefs.current[currentStep].validateStep();
        if (!isValid) return;
      } catch (err) {
        console.error("Error validating step:", err);
        return;
      }
    }

    const newStep = Math.min(currentStep + 1, 3);
    setCurrentStep(newStep);
    navigate(`/register${newStep === 0 ? "" : "/step" + (newStep + 1)}`);
  };

  const skipStep = () => {
    const newStep = Math.min(currentStep + 1, 3);
    setCurrentStep(newStep);
    navigate(`/register${newStep === 0 ? "" : "/step" + (newStep + 1)}`);
  };

  const finalSubmit = async (data) => {
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.birthDate) {
        formData.append("birthDate", data.birthDate);
      }

      if (data.categoryIds && data.categoryIds.length > 0) {
        data.categoryIds.forEach((id, index) => {
          formData.append(`categoryIds[${index}]`, id);
        });
      }

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.city) {
        formData.append("city", data.city);
      }

      if (data.profilePicture && data.profilePicture instanceof File) {
        formData.append("avatar", data.profilePicture);
      }
      const response = await fetch(`${registerUserUrl}`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        timeoutForError(errorData?.message || `Server responded with ${response.status}: ${response.statusText}`);
      }

      await response.json();
      timeoutForSuccess("Successfully Registered")
      navigate("/login", { state: { registrationSuccess: true } });

    } catch (err) {
      timeoutForError(err.message || "Registration failed")
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    const path = location.pathname;
    let pathStep = 0;
    if (path.includes('/register/step')) {
      const stepMatch = path.match(/\/register\/step(\d+)/);
      if (stepMatch && stepMatch[1]) {
        pathStep = parseInt(stepMatch[1], 10) - 1; 
      }
    }
    
    if (pathStep > currentStep) {
      const correctPath = currentStep === 0 ? '/register' : `/register/step${currentStep + 1}`;
      navigate(correctPath, { replace: true });
    }
  }, [location, currentStep, navigate]);


  return (
    <FormProvider {...methods}>
      <div className="min-h-full flex flex-col">
        <RegistrationHeader currentStep={currentStep} />
        <div className="flex justify-center pt-[2%]">
          {/* {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )} */}
          <Outlet
            context={{
              currentStep,
              nextStep,
              prevStep,
              skipStep,
              finalSubmit,
              isSubmitting
            }}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default RegistrationLayout;