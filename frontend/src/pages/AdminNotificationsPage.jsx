/**
 * Admin notifications management - FR-025
 */
import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import Layout from '../components/layout/Layout';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const loadNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.getNotifications({ page, limit: 10, search });
      setNotifications(data.data.notifications);
      setPagination({ page: data.data.page, totalPages: data.data.totalPages });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(1); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await adminApi.deleteNotification(id);
      setAlert({ type: 'success', message: 'Notification deleted' });
      loadNotifications(pagination.page);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Manage Notifications 🔔</h1>
          <p className="text-gray-500">View and manage system notifications</p>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        <div className="card">
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.notificationId} className="card flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    User: {n.username} · {new Date(n.date).toLocaleString()} · {n.status}
                  </p>
                </div>
                <button onClick={() => handleDelete(n.notificationId)} className="btn-danger text-xs py-1 px-2 flex-shrink-0">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination {...pagination} onPageChange={loadNotifications} />
      </div>
    </Layout>
  );
}
