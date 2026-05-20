import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  dismissible?: boolean;
}

export default function Alert({
  type,
  message,
  dismissible = true,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    success: {
      container: 'bg-green-50 border-green-400 text-green-800',
      icon: <CheckCircle size={18} className="text-green-500 shrink-0" />,
    },
    error: {
      container: 'bg-red-50 border-red-400 text-red-800',
      icon: <AlertCircle size={18} className="text-red-500 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-400 text-amber-800',
      icon: <AlertCircle size={18} className="text-amber-500 shrink-0" />,
    },
    info: {
      container: 'bg-purple-50 border-[#6c63ff] text-[#1a1a4e]',
      icon: <Info size={18} className="text-[#6c63ff] shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`
        flex items-start justify-between gap-3
        px-4 py-3 rounded-lg border-l-4 text-sm
        ${current.container}
      `}
    >
      <div className="flex items-start gap-2">
        {current.icon}
        <p className="leading-relaxed">{message}</p>
      </div>

      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}