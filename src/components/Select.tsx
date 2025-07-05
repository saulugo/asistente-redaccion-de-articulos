import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  id, 
  value, 
  onChange, 
  options, 
  placeholder = "Seleccionar...",
  className = '' 
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 appearance-none bg-white cursor-pointer ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );
};