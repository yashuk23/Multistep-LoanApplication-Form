
import { useState } from "react";
import "./App.css";

import ProgressBar from "./components/ProgressBar";
import StepNavigation from "./components/StepNavigation";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanType, setLoanType] = useState("");
  const totalSteps = 10;

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  function handleContinue() {
    if (!loanType) {
      alert("Please select a loan type.");
      return;
    }

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

        <h2>Select Your Loan Type</h2>
        <p className="description">
          Choose the loan that best matches your requirements.
        </p>

        <div className="loan-options">
          {[
            {
              type: "Personal",
              description: "For personal expenses and financial needs",
            },
            {
              type: "Home",
              description: "For purchasing or constructing a home",
            },
            {
              type: "Business",
              description: "For business expenses and expansion",
            },
          ].map((loan) => (
            <button
              key={loan.type}
              type="button"
              className={`loan-option ${loanType === loan.type ? "selected" : ""
                }`}
              onClick={() => setLoanType(loan.type)}
            >
              <strong>{loan.type} Loan</strong>
              <span>{loan.description}</span>
            </button>
          ))}
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onContinue={handleContinue}
        />
      </main>
    </div>
  );
}

export default App;
