// import { ReactNode } from 'react';
import type { ReactNode } from 'react'

interface CardProps {
  title?: string;
  value?: string | number;
  icon?: ReactNode;
  children?: ReactNode;
  color?: 'purple' | 'navy' | 'teal' | 'amber' | 'green' | 'red';
}

export default function Card({
  title,
  value,
  icon,
  children,
  color = 'purple',
}: CardProps) {
  const colors = {
    purple: {
      border: 'border-l-[#6c63ff]',
      icon: 'bg-purple-100 text-[#6c63ff]',
      value: 'text-[#6c63ff]',
    },
    navy: {
      border: 'border-l-[#1a1a4e]',
      icon: 'bg-[#1a1a4e] text-white',
      value: 'text-[#1a1a4e]',
    },
    teal: {
      border: 'border-l-teal-500',
      icon: 'bg-teal-100 text-teal-600',
      value: 'text-teal-600',
    },
    amber: {
      border: 'border-l-amber-500',
      icon: 'bg-amber-100 text-amber-600',
      value: 'text-amber-600',
    },
    green: {
      border: 'border-l-green-500',
      icon: 'bg-green-100 text-green-600',
      value: 'text-green-600',
    },
    red: {
      border: 'border-l-red-500',
      icon: 'bg-red-100 text-red-600',
      value: 'text-red-600',
    },
  };

  const current = colors[color];

  // stat card — title + value + icon
  if (title && value !== undefined) {
    return (
      <div
        className={`
          bg-white rounded-lg p-5
          border border-gray-200
          border-l-4 ${current.border}
          shadow-sm hover:shadow-md
          transition-shadow duration-200
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className={`text-3xl font-bold ${current.value}`}>{value}</p>
          </div>
          {icon && (
            <div className={`p-3 rounded-full ${current.icon}`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  // content card — wraps any children
  return (
    <div
      className={`
        bg-white rounded-lg p-5
        border border-gray-200
        shadow-sm
      `}
    >
      {title && (
        <h3 className="text-base font-semibold text-[#1a1a4e] mb-4 pb-3 border-b border-gray-100">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}