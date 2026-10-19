function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    required = false,
}) {
    return (
        <div className="form-field">
            <label htmlFor={name}>
                {label}
                {required && " *"}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
            />

            {error && (
                <p className="field-error" id={`${name}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default FormField;
