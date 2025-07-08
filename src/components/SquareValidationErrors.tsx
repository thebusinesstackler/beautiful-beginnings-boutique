import React from 'react';

interface SquareValidationErrorsProps {
  errors: string[];
}

const SquareValidationErrors = ({ errors }: SquareValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
      <ul className="text-sm text-red-700 space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="flex items-center">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SquareValidationErrors;