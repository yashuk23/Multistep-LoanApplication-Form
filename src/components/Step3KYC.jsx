
import { useState } from "react";
import useVerification from "../hooks/useVerification";

export default function Step3KYC({
  formData = {},
  setFormData,
  onContinue,
  onBack,
}) {
  const [pan, setPan] = useState(formData.pan || "");
  const [aadhaar, setAadhaar] = useState(formData.aadhaar || "");
  const [aadhaarConsent, setAadhaarConsent] = useState(
    formData.aadhaarConsent || false
  );
  const [submitError, setSubmitError] = useState("");

  const panVerification = useVerification(pan, "PAN");
  const aadhaarVerification = useVerification(aadhaar, "Aadhaar");

  function handlePanChange(event) {
    setPan(event.target.value.toUpperCase());
    setSubmitError("");
  }

  function handleAadhaarChange(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaar(digits);
    setSubmitError("");
  }

  function handleContinue(event) {
    event.preventDefault();

    if (!panVerification.isVerified || !aadhaarVerification.isVerified) {
      setSubmitError("Please verify both PAN and Aadhaar before continuing.");
      return;
    }

    if (!aadhaarConsent) {
      setSubmitError("Please provide Aadhaar consent to continue.");
      return;
    }

    setFormData((previous) => ({
      ...previous,
      pan,
      aadhaar,
      panVerified: panVerification.isVerified,
      aadhaarVerified: aadhaarVerification.isVerified,
      aadhaarConsent,
    }));

    onContinue();
  }

  return (
    <form onSubmit={handleContinue} noValidate>
      <h2>KYC Verification</h2>
      <p className="description">
        Verify your identity details to continue your loan application.
      </p>

      <div className="form-field">
        <label htmlFor="pan">PAN Number *</label>
        <input
          id="pan"
          type="text"
          value={pan}
          onChange={handlePanChange}
          onBlur={panVerification.verify}
          placeholder="ABCDE1234F"
          maxLength={10}
          autoCapitalize="characters"
          autoComplete="off"
          aria-invalid={Boolean(panVerification.error)}
        />

        {panVerification.isVerifying && (
          <p className="verification-pending" role="status">
            Verifying PAN...
          </p>
        )}

        {panVerification.isVerified && (
          <p className="verification-success" role="status">
            ✓ PAN Verified
          </p>
        )}

        {panVerification.error && (
          <p className="field-error" role="alert">
            {panVerification.error}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="aadhaar">Aadhaar Number *</label>
        <input
          id="aadhaar"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={aadhaar}
          onChange={handleAadhaarChange}
          onBlur={aadhaarVerification.verify}
          placeholder="Enter 12-digit Aadhaar number"
          maxLength={12}
          aria-invalid={Boolean(aadhaarVerification.error)}
        />

        <p className="description">
          Enter your 12-digit Aadhaar number. Your input is masked.
        </p>

        {aadhaarVerification.isVerifying && (
          <p className="verification-pending" role="status">
            Verifying Aadhaar...
          </p>
        )}

        {aadhaarVerification.isVerified && (
          <p className="verification-success" role="status">
            ✓ Aadhaar Verified
          </p>
        )}

        {aadhaarVerification.error && (
          <p className="field-error" role="alert">
            {aadhaarVerification.error}
          </p>
        )}
      </div>

      <div className="form-field consent-field">
        <label htmlFor="aadhaarConsent" className="consent-label">
          <input
            id="aadhaarConsent"
            type="checkbox"
            checked={aadhaarConsent}
            onChange={(event) => {
              setAadhaarConsent(event.target.checked);
              setSubmitError("");
            }}
          />

          <span>
            I consent to the use of my Aadhaar details for identity verification
            for this loan application.
          </span>
        </label>
      </div>

      {submitError && (
        <p className="field-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="navigation">
        <button type="button" onClick={onBack}>
          Back
        </button>

        <button type="submit">
          Continue
        </button>
      </div>
    </form>
  );
}
