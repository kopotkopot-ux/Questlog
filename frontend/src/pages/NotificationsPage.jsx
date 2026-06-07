/**
 * Notifications page - FR-016, FR-017
 */
import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notifications';
import Layout from '../components/layout/Layout';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const loadNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await notificationApi.getNotifications({ page, limit: 10 });
      setNotifications(data.data.notifications);
      setPagination({ page: data.data.page, totalPages: data.data.totalPages });
    } catch {
      setAlert({ type: 'error', message: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(1); }, []);

  const handleMarkRead = async (id) => {
    await notificationApi.markAsRead(id);
    loadNotifications(pagination.page);
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    setAlert({ type: 'success', message: 'All notifications marked as read' });
    loadNotifications(pagination.page);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Notifications 🔔</h1>
            <p className="text-gray-500">Stay updated on your quests</p>
          </div>
          <button onClick={handleMarkAllRead} className="btn-secondary text-sm">
            Mark all read
          </button>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        {loading ? (
          <Spinner size="lg" />
        ) : notifications.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🔕</div>
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                className={`card flex items-start gap-4 cursor-pointer transition ${
                  n.status === 'unread' ? 'border-quest-300 dark:border-quest-700 bg-quest-50/50 dark:bg-quest-900/10' : ''
                }`}
                onClick={() => n.status === 'unread' && handleMarkRead(n.notificationId)}
              >
                <div className="text-2xl">{n.status === 'unread' ? '🔔' : '📭'}</div>
                <div className="flex-1">
                  <p className={`text-sm ${n.status === 'unread' ? 'font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
                {n.status === 'unread' && (
                  <span className="w-2 h-2 rounded-full bg-quest-600 flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}

        <Pagination {...pagination} onPageChange={loadNotifications} />
      </div>
    </Layout>
  );
}
