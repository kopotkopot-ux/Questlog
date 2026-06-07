/**
 * Priority badge component - FR-012, FR-013, FR-014
 */
const config = {
  easy: { label: 'Easy', className: 'badge-easy', icon: '⭐' },
  medium: { label: 'Medium', className: 'badge-medium', icon: '⚔️' },
  hard: { label: 'Hard', className: 'badge-hard', icon: '🔥' },
};

export default function PriorityBadge({ priority = 'medium' }) {
  const { label, className, icon } = config[priority] || config.medium;
  return (
    <span className={className}>
      <span className="mr-1">{icon}</span>
      {label}
    </span>
  );
}
