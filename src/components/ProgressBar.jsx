function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="progress-track">
            <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default ProgressBar;
