/**
 * Task form for creating and editing quests
 */
import { useState } from 'react';
import Alert from '../ui/Alert';

const PRIORITIES = [
  { value: 'easy', label: '⭐ Easy', desc: 'Quick wins' },
  { value: 'medium', label: '⚔️ Medium', desc: 'Standard quest' },
  { value: 'hard', label: '🔥 Hard', desc: 'Epic challenge' },
];

export default function TaskForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priorityLevel: initialData?.priorityLevel || 'medium',
    deadline: initialData?.deadline
      ? new Date(initialData.deadline).toISOString().slice(0, 16)
      : '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Quest title is required');
      return;
    }
    try {
      await onSubmit({
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quest');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div>
        <label className="block text-sm font-medium mb-1">Quest Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter quest title..."
          maxLength={200}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input-field min-h-[100px] resize-y"
          placeholder="Describe your quest..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Priority Level</label>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <label
              key={p.value}
              className={`cursor-pointer rounded-lg border-2 p-3 text-center transition ${
                form.priorityLevel === p.value
                  ? 'border-quest-600 bg-quest-50 dark:bg-quest-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-quest-300'
              }`}
            >
              <input
                type="radio"
                name="priorityLevel"
                value={p.value}
                checked={form.priorityLevel === p.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="text-xs text-gray-500">{p.desc}</div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : initialData ? 'Update Quest' : 'Create Quest'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
