import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer';

  const variants = {
    primary: 'bg-[#6c63ff] text-white hover:bg-[#5a52e0] active:scale-95',
    secondary: 'bg-[#1a1a4e] text-white hover:bg-[#2a2a6e] active:scale-95',
    outline: 'border-2 border-[#6c63ff] text-[#6c63ff] hover:bg-[#6c63ff] hover:text-white active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}