import Button from "./button";

const UserRegistrationButtons = ({setCurrentStep}) => {

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    return (
        <div className="flex justify-between">
            <Button onClick={prevStep}>previous</Button>
            <Button>skip</Button>
            <Button onClick={nextStep}>next</Button>
        </div>
    )
}
export default UserRegistrationButtons;