import { forwardRef, useId } from "react";

import "./Input.css";

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    defaultValue,
    onChange,
    onBlur,
    error = "",
    helperText = "",
    disabled = false,
    required = false,
    readOnly = false,
    autoComplete,
    className = "",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = props.id || name || generatedId;
  const messageId = `${inputId}-message`;

  const inputClasses = [
    "lumora-input",
    error ? "lumora-input--error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="lumora-input-field">
      {label && (
        <label htmlFor={inputId} className="lumora-input-field__label">
          {label}

          {required && (
            <span className="lumora-input-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error || helperText ? messageId : undefined
        }
        {...props}
      />

      {(error || helperText) && (
        <p
          id={messageId}
          className={
            error
              ? "lumora-input-field__message lumora-input-field__message--error"
              : "lumora-input-field__message"
          }
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;