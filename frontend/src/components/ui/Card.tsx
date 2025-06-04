import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseClasses = 'rounded-2xl bg-white dark:bg-gray-800 transition-all duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    bordered: 'border-2 border-gray-300 dark:border-gray-600',
    elevated: 'shadow-soft border border-gray-100 dark:border-gray-700',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  const allClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${paddingClasses[padding]}
    ${className}
  `;
  
  return (
    <div className={allClasses}>
      {children}
    </div>
  );
};

export default Card;