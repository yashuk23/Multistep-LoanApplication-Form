import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "../step2Schema";

const defaultValues = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    fatherName: "",
    motherName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
};

export default function PersonalDetailsStep({
    formData = {},
    setFormData,
    onBack,
    onContinue,
}) {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(step2Schema),
        defaultValues: { ...defaultValues, ...formData },
        mode: "onChange",
    });

    const submitStep = handleSubmit((values) => {
        setFormData((previous) => ({ ...previous, ...values }));
        onContinue();
    });

    const fields = [
        { name: "fullName", label: "Full Name (as per PAN)", placeholder: "Enter full name" },
        { name: "fatherName", label: "Father's Name", placeholder: "Enter father's name" },
        { name: "motherName", label: "Mother's Name", placeholder: "Enter mother's name" },
        { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
        { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile number" },
        { name: "alternateMobile", label: "Alternate Mobile (optional)", type: "tel", placeholder: "Optional alternate number" },
    ];

    return (
        <form onSubmit={submitStep} noValidate>
            <h2>Personal Details</h2>
            <p className="description">
                Enter your details exactly as they appear on your official documents.
            </p>

            <div className="form-field">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                    id="dateOfBirth"
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    {...register("dateOfBirth")}
                    aria-invalid={Boolean(errors.dateOfBirth)}
                />
                {errors.dateOfBirth && (
                    <p className="field-error">{errors.dateOfBirth.message}</p>
                )}
            </div>

            <div className="form-field">
                <label>Gender *</label>
                <div className="radio-group">
                    {["Male", "Female", "Other"].map((gender) => (
                        <label key={gender} className="radio-option">
                            <input
                                type="radio"
                                value={gender}
                                {...register("gender")}
                            />
                            {gender}
                        </label>
                    ))}
                </div>
                {errors.gender && (
                    <p className="field-error">{errors.gender.message}</p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="maritalStatus">Marital Status *</label>
                <select id="maritalStatus" {...register("maritalStatus")}>
                    <option value="">Select marital status</option>
                    {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                {errors.maritalStatus && (
                    <p className="field-error">{errors.maritalStatus.message}</p>
                )}
            </div>

            {fields.map((field) => (
                <div className="form-field" key={field.name}>
                    <label htmlFor={field.name}>
                        {field.label}
                        {field.name !== "alternateMobile" && " *"}
                    </label>
                    <input
                        id={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        aria-invalid={Boolean(errors[field.name])}
                    />
                    {errors[field.name] && (
                        <p className="field-error">
                            {errors[field.name].message}
                        </p>
                    )}
                </div>
            ))}

            <div className="navigation">
                <button
                    type="button"
                    onClick={onBack}
                >
                    Back
                </button>

                <button type="submit">Continue</button>
            </div>
        </form>
    );
}
