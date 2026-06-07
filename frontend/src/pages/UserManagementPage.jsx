/**
 * User management page - FR-022, FR-023
 */
import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/admin';
import Layout from '../components/layout/Layout';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const loadUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers({ page, limit: 10, search });
      setUsers(data.data.users);
      setPagination({ page: data.data.page, totalPages: data.data.totalPages });
    } catch {
      setAlert({ type: 'error', message: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadUsers(1); }, [loadUsers]);

  const handleToggleActive = async (user) => {
    const action = user.isActive ? 'deactivate' : 'reactivate';
    if (!window.confirm(`${action} user "${user.username}"?`)) return;
    try {
      if (user.isActive) {
        await adminApi.deactivateUser(user.userId);
      } else {
        await adminApi.reactivateUser(user.userId);
      }
      setAlert({ type: 'success', message: `User ${action}d successfully` });
      loadUsers(pagination.page);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Action failed' });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">User Management 👥</h1>
          <p className="text-gray-500">View, search, and manage registered users</p>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        <div className="card">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-800 text-left">
                  <th className="pb-3 font-semibold">Username</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Joined</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="border-b dark:border-gray-800/50">
                    <td className="py-3 font-medium">{user.username}</td>
                    <td className="py-3 text-gray-500">{user.email}</td>
                    <td className="py-3 capitalize">{user.role}</td>
                    <td className="py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleActive(user)}
                          className={user.isActive ? 'btn-danger text-xs py-1 px-2' : 'btn-primary text-xs py-1 px-2'}
                        >
                          {user.isActive ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination {...pagination} onPageChange={loadUsers} />
      </div>
    </Layout>
  );
}
