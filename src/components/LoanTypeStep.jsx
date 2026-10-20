import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanRules, createStep1Schema } from "../step1Schema";
const defaultValues = {
    loanType: "",
    loanAmount: "",
    loanTenure: "",
    loanPurpose: "",
    referralCode: "",
};

export default function LoanTypeStep({
    loanType,
    setLoanType,
    formData,
    setFormData,
    dateOfBirth,
    onContinue,
}) {

    const step1Schema = createStep1Schema(dateOfBirth);
    const {
        register,
        watch,
        reset,
        trigger,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            loanType: loanType || formData?.loanType || "",
            loanAmount: formData?.loanAmount ?? "",
            loanTenure: formData?.loanTenure ?? "",
            loanPurpose: formData?.loanPurpose ?? "",
            referralCode: formData?.referralCode ?? "",
        },
        mode: "onChange",
    });

    const selectedType = watch("loanType");
    const rules = loanRules[selectedType];

    useEffect(() => {
        setLoanType(selectedType);
    }, [selectedType, setLoanType]);

    useEffect(() => {
        trigger("loanTenure");
    }, [dateOfBirth, trigger]);

    useEffect(() => {
        const subscription = watch((values) => {
            setFormData((previous) => ({
                ...previous,
                ...values,
            }));
        });

        return () => subscription.unsubscribe();
    }, [watch, setFormData]);

    const submitStep = handleSubmit((values) => {
        setFormData((previous) => ({
            ...previous,
            ...values,
        }));

        onContinue();
    });

    return (
        <form onSubmit={submitStep} noValidate>
            <h2>Select Your Loan Type</h2>
            <p className="description">
                Choose the loan that best matches your requirements.
            </p>

            <div className="loan-options">
                {["Personal", "Home", "Business"].map((type) => (
                    <label
                        key={type}
                        className={`loan-option ${selectedType === type ? "selected" : ""
                            }`}
                    >
                        <input
                            type="radio"
                            value={type}
                            {...register("loanType")}
                        />
                        <strong>{type} Loan</strong>
                        <span>
                            {type === "Personal"
                                ? "For personal expenses and financial needs"
                                : type === "Home"
                                    ? "For purchasing or constructing a home"
                                    : "For business expenses and expansion"}
                        </span>
                    </label>
                ))}
            </div>
            {errors.loanType && (
                <p className="field-error">{errors.loanType.message}</p>
            )}

            {rules && (
                <>
                    <div className="form-field">
                        <label htmlFor="loanAmount">Loan Amount (₹) *</label>
                        <input
                            id="loanAmount"
                            type="number"
                            min={rules.minAmount}
                            max={rules.maxAmount}
                            placeholder={`₹${rules.minAmount.toLocaleString("en-IN")} to ₹${rules.maxAmount.toLocaleString("en-IN")}`}
                            {...register("loanAmount")}
                        />
                        {errors.loanAmount && (
                            <p className="field-error">{errors.loanAmount.message}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="loanTenure">Loan Tenure (months) *</label>
                        <select id="loanTenure" {...register("loanTenure")}>
                            <option value="">Select tenure</option>
                            {Array.from(
                                {
                                    length: rules.maxTenure - rules.minTenure + 1,
                                },
                                (_, index) => rules.minTenure + index
                            ).map((months) => (
                                <option key={months} value={months}>
                                    {months} months
                                </option>
                            ))}
                        </select>
                        {errors.loanTenure && (
                            <p className="field-error">{errors.loanTenure.message}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="loanPurpose">Loan Purpose *</label>
                        <select id="loanPurpose" {...register("loanPurpose")}>
                            <option value="">Select purpose</option>
                            {rules.purposes.map((purpose) => (
                                <option key={purpose} value={purpose}>
                                    {purpose}
                                </option>
                            ))}
                        </select>
                        {errors.loanPurpose && (
                            <p className="field-error">{errors.loanPurpose.message}</p>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="referralCode">Referral Code (optional)</label>
                        <input
                            id="referralCode"
                            placeholder="Enter referral code"
                            {...register("referralCode")}
                        />
                        {errors.referralCode && (
                            <p className="field-error">{errors.referralCode.message}</p>
                        )}
                    </div>
                </>
            )}

            <button type="submit">Continue</button>
        </form>
    );
}
