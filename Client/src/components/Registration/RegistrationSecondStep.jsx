import { useImperativeHandle } from 'react'; 
import { useOutletContext } from 'react-router'; 
import Button from '../Button';

const RegistrationSecondStep = ({ ref }) => {
  const { currentStep, nextStep, prevStep } = useOutletContext();

  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit(formSubmitHandler)(),
  }));

  const formSubmitHandler = (values) => {
    console.log('Form submitted:', values);
    nextStep();
  };

  const handleSubmit = (callback) => () => {
    callback();
  };

  return (
        <section className="flex flex-col gap-[1.5rem]">
          <h2 className="text-header-dark text-heading-l font-[700]">
            Tell us about yourself
          </h2>
          <fieldset className="fieldset text-[1rem]">
            <section className="flex gap-2">
              <legend className="fieldset-legend font-[400]">Birth date</legend>
            </section>
            <input type="date" className="input" />
          </fieldset>
          <fieldset className="fieldset text-[1rem]">
            <legend className="fieldset-legend font-[400]">Bio</legend>
            <textarea
              className="textarea h-24"
              placeholder="Tell us about yourself..."
            ></textarea>
          </fieldset>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn">
              City
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
          <section className="flex justify-between w-[100%]">
            <section>
              <Button
                background="bg-white"
                textColor="text-btn"
                border="border border-btn"
                onClick={prevStep}
              >
                Back
              </Button>
            </section>
            <section>
              <Button
                background="bg-white"
                textColor="text-btn"
                hoverColor="not-hover:hover"
                onClick={nextStep} 
              >
                Skip
              </Button>
            </section>
            <section>
              <Button onClick={() => ref.current.submitForm()}>
                Next
              </Button>
            </section>
          </section>
        </section>
  );
};

export default RegistrationSecondStep;
