import type { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'date';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">

      <label
        htmlFor={name}
        className="text-sm font-medium text-[#1a1a4e]"
      >
        {label}
        {required && <span className="text-[#6c63ff] ml-1">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-lg border text-sm
          bg-white text-[#1a1a4e]
          placeholder:text-gray-400
          outline-none transition-all duration-200
          focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent
          ${error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-300 hover:border-[#6c63ff]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
        `}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

    </div>
  );
}
