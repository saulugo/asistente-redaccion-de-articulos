import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  id,
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  className = '' 
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-300 hover:border-gray-400"
  };

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};