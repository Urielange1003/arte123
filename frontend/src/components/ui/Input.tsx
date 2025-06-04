import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  id,
  ...props
}, ref) => {
  // Generate a random ID if one is not provided, for associating label with input
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseInputClasses = 'block w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 shadowu-sm focus:outline-none focus:ring-2 focus:ring-agl-blue transition duration-150 ease-in-out';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Different styling based on error state and icons
  const errorClasses = error
    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
    : 'border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-agl-blue/20';
  
  const paddingClasses = `px-4 py-2.5 ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;
  
  const inputClasses = `
    ${baseInputClasses}
    ${errorClasses}
    ${paddingClasses}
    ${widthClasses}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;