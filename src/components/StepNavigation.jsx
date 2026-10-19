function StepNavigation({
    currentStep,
    totalSteps,
    onBack,
    onContinue,
}) {
    return (
        <div className="navigation">
            <button
                type="button"
                disabled={currentStep === 1}
                onClick={onBack}
            >
                Back
            </button>

            <button
                type="button"
                disabled={currentStep === totalSteps}
                onClick={onContinue}
            >
                Continue
            </button>
        </div>
    );
}

export default StepNavigation;
