/**
 * User profile page
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/user';
import Layout from '../components/layout/Layout';
import Alert from '../components/ui/Alert';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.updateProfile(form);
      await loadUser();
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Profile 👤</h1>
          <p className="text-gray-500">Manage your adventurer identity</p>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

        <div className="card">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b dark:border-gray-800">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-quest-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-quest-100 text-quest-700 dark:bg-quest-900/30 dark:text-quest-300 capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="text-sm text-gray-500">
              Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
