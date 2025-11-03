import React from 'react';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div className={`mb-4 text-red-600 dark:text-red-400 text-sm text-center ${className}`}>
      {message}
    </div>
  );
};

export default ErrorMessage;
