import React from 'react';

interface InputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  id, 
  placeholder, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${className}`}
    />
  );
};