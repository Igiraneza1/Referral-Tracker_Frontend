interface BadgeProps {
  status: 'pending' | 'accepted' | 'attended' | 'feedback_received' | 'closed';
}

export default function Badge({ status }: BadgeProps) {
  const styles = {
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      label: 'Pending',
    },
    accepted: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      dot: 'bg-blue-500',
      label: 'Accepted',
    },
    attended: {
      bg: 'bg-purple-100',
      text: 'text-[#1a1a4e]',
      dot: 'bg-[#6c63ff]',
      label: 'Attended',
    },
    feedback_received: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      dot: 'bg-teal-500',
      label: 'Feedback Received',
    },
    closed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      dot: 'bg-green-500',
      label: 'Closed',
    },
  };

  const current = styles[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full text-xs font-medium
        ${current.bg} ${current.text}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}