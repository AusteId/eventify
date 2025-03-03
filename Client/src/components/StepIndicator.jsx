const StepIndicator = ({step, totalSteps}) => {

    const progressValue = (step / totalSteps) * 100;

    return(
        <div className="flex items-center gap-2">
            <div className="text-body-s text-title font-[400] font-inter" > Step {step} of {totalSteps}</div>
            <progress 
            className="progress w-25"
            style={{ color: "#F59E0B", accentColor: "#F59E0B" }}
            value={step} 
            max={totalSteps}
            ></progress>
        </div>
    )
}
export default StepIndicator;