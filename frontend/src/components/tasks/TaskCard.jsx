/**
 * Individual task card with actions - FR-009, FR-010, FR-017
 */
import PriorityBadge from '../ui/PriorityBadge';

export default function TaskCard({ task, onComplete, onRevert, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleString();
  };

  return (
    <div
      className={`card transition hover:shadow-md ${
        task.isOverdue ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : ''
      } ${task.status === 'completed' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <PriorityBadge priority={task.priorityLevel} />
            {task.status === 'completed' && (
              <span className="text-xs font-bold text-green-600 dark:text-green-400">✓ COMPLETED</span>
            )}
            {task.isOverdue && (
              <span className="text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">⚠ OVERDUE</span>
            )}
          </div>
          <h3 className={`font-bold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
          )}
          {task.deadline && (
            <p className={`text-xs mt-2 ${task.isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
              📅 Due: {formatDate(task.deadline)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t dark:border-gray-800">
        {task.status === 'pending' ? (
          <button onClick={() => onComplete(task.taskId)} className="btn-primary text-sm py-1.5 px-3">
            ✓ Complete
          </button>
        ) : (
          <button onClick={() => onRevert(task.taskId)} className="btn-secondary text-sm py-1.5 px-3">
            ↩ Revert
          </button>
        )}
        <button onClick={() => onEdit(task)} className="btn-secondary text-sm py-1.5 px-3">
          ✏ Edit
        </button>
        <button onClick={() => onDelete(task.taskId)} className="btn-danger text-sm py-1.5 px-3">
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
