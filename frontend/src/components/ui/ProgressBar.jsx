/**
 * Gamified progress bar - FR-020
 */
export default function ProgressBar({ percentage = 0, label, showLabel = true }) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label || 'Quest Progress'}</span>
          <span className="text-sm font-bold text-quest-600 dark:text-quest-400">{clamped}%</span>
        </div>
      )}
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full progress-shimmer rounded-full transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
