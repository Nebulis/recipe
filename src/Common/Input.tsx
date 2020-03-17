import React, { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<any> {
  label?: React.ReactNode;
  id: string;
  error?: string;
  inputClassName?: string;
}

export const Input: React.FunctionComponent<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      error,
      placeholder,
      inputClassName = "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white",
      ...rest
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <label
            className="inline-flex items-center uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${inputClassName} ${error ? "border-red-500" : ""}`}
          id={id}
          type="text"
          placeholder={placeholder}
          {...rest}
        />
        {error && <p className="text-red-500 text-xs italic">${error}</p>}
      </>
    );
  }
);

export const useInput = ({ value: initialValue = "" } = {}) => {
  const [value, setValue] = useState(initialValue);
  // not using event type so that can freely call this function manually without typescript complaining
  const onChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };
  return { value, onChange };
};
