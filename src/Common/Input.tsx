import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, useCallback, useState } from "react";

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

interface TextareaProps extends TextareaHTMLAttributes<any> {
  label?: React.ReactNode;
  id: string;
  error?: string;
  inputClassName?: string;
}

export const Textarea: React.FunctionComponent<InputProps> = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          className={`${inputClassName} ${error ? "border-red-500" : ""}`}
          id={id}
          placeholder={placeholder}
          rows={3}
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
  const onChange = useCallback((event: { target: { value: string } }) => {
    console.log(`onChange input => ${event.target.value}`);
    setValue(event.target.value);
  }, []);
  return { value, onChange };
};

interface SelectProps extends SelectHTMLAttributes<any> {
  label?: string;
  id: string;
  error?: string;
  options: string[];
  selectClassName?: string;
}
export const Select: React.FunctionComponent<SelectProps> = ({
  label,
  id,
  options,
  onChange,
  value,
  selectClassName = "block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
}) => {
  return (
    <>
      {label && (
        <label className="inline-flex uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        <select className={selectClassName} id={id} onChange={onChange} value={value}>
          {options.map(option => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </>
  );
};
