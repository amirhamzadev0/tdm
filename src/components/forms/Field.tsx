"use client";

import { useId, type ReactNode } from "react";

interface BaseFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "datetime-local";
  placeholder?: string;
  autoComplete?: string;
}

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="form__field">
      <label className="form__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <span className="form__error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        id={id}
        className={`form__input${type === "datetime-local" ? " form__input--date" : ""}`}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  rows = 3,
}: BaseFieldProps & { placeholder?: string; rows?: number }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        className="form__input"
        rows={rows}
        value={value}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  error,
  required,
  options,
}: BaseFieldProps & { options: string[] }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error}>
      <select
        id={id}
        className="form__input"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
