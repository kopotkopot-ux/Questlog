/**
 * Reusable alert/feedback component for success and error messages
 */
export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-4 rounded-lg border animate-slide-up ${styles[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-lg leading-none opacity-70 hover:opacity-100">&times;</button>
      )}
    </div>
  );
}
