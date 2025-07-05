import React from 'react';

interface TextAreaProps {
  id: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder,
  readOnly = false,
  rows = 12,
  className = '' 
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      rows={rows}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none ${readOnly ? 'bg-gray-50 cursor-default' : ''} ${className}`}
    />
  );
};