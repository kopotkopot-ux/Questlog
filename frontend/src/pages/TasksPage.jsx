/**
 * Task management page - FR-005 through FR-014
 */
import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/tasks';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const loadTasks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await taskApi.getTasks({ page, limit: 9, ...filters });
      setTasks(data.data.tasks);
      setPagination({ page: data.data.page, totalPages: data.data.totalPages });
    } catch {
      setAlert({ type: 'error', message: 'Failed to load quests' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks(1);
  }, [loadTasks]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await taskApi.createTask(formData);
      setModalOpen(false);
      setAlert({ type: 'success', message: 'Quest created successfully!' });
      loadTasks(pagination.page);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      await taskApi.updateTask(editingTask.taskId, formData);
      setModalOpen(false);
      setEditingTask(null);
      setAlert({ type: 'success', message: 'Quest updated!' });
      loadTasks(pagination.page);
    } finally {
      setFormLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    await taskApi.completeTask(taskId);
    setAlert({ type: 'success', message: 'Quest completed! +XP earned!' });
    loadTasks(pagination.page);
  };

  const handleRevert = async (taskId) => {
    await taskApi.revertTask(taskId);
    setAlert({ type: 'info', message: 'Quest reverted to pending' });
    loadTasks(pagination.page);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this quest permanently?')) return;
    await taskApi.deleteTask(taskId);
    setAlert({ type: 'success', message: 'Quest deleted' });
    loadTasks(pagination.page);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">My Quests ⚔️</h1>
            <p className="text-gray-500">Manage and conquer your tasks</p>
          </div>
          <button onClick={openCreate} className="btn-primary">+ New Quest</button>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        {/* Filters */}
        <div className="card flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search quests..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field max-w-xs"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field max-w-[150px]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="input-field max-w-[150px]"
          >
            <option value="">All Priority</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {loading ? (
          <Spinner size="lg" />
        ) : tasks.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="font-bold text-lg mb-2">No quests found</h3>
            <p className="text-gray-500 mb-4">Start your adventure by creating a new quest!</p>
            <button onClick={openCreate} className="btn-primary">Create First Quest</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                onComplete={handleComplete}
                onRevert={handleRevert}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={loadTasks}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Quest' : 'Create New Quest'}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingTask(null); }}
          loading={formLoading}
        />
      </Modal>
    </Layout>
  );
}
