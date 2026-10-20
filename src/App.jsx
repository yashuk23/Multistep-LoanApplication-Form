
import { useState } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import StepNavigation from "./components/StepNavigation";
import LoanTypeStep from "./components/LoanTypeStep";
import PersonalDetailsStep from "./components/PersonalDetailsStep";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanType, setLoanType] = useState("");
  const [formData, setFormData] = useState({});
  const totalSteps = 8;

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  function handleContinue() {
    setCurrentStep((step) => Math.min(step + 1, totalSteps));
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Zetheta Finance</h1>
        <p>Simple, secure and transparent loan applications</p>
      </header>

      <main className="loan-card">
        <div className="progress-header">
          <span>Loan Application</span>
          <span>Step {currentStep} of {totalSteps}</span>
        </div>

        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
        />


        {currentStep === 1 && (
          <LoanTypeStep
            loanType={loanType}
            setLoanType={setLoanType}
            formData={formData}
            setFormData={setFormData}
            dateOfBirth={formData.dateOfBirth}
            onContinue={handleContinue}
          />
        )}

        {currentStep === 2 && (
          <PersonalDetailsStep
            formData={formData}
            setFormData={setFormData}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        )}

        {currentStep > 2 && (
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        )}
      </main>
    </div>
  );
}

export default App;
