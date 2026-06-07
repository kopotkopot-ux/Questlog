/**
 * Admin dashboard - FR-021
 */
import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, logsRes] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getActivityLogs({ limit: 5 }),
        ]);
        setStats(dashRes.data.data);
        setRecentLogs(logsRes.data.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Layout><Spinner size="lg" /></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Admin Dashboard 🛡️</h1>
          <p className="text-gray-500">System overview and monitoring</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-4xl font-black text-quest-600">{stats?.totalUsers || 0}</div>
            <div className="text-gray-500">Registered Users</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-4xl font-black text-purple-600">{stats?.totalTasks || 0}</div>
            <div className="text-gray-500">Total Tasks</div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-lg mb-4">Recent System Activity</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity recorded yet</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.logId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm">
                  <div>
                    <span className="font-semibold text-quest-600">{log.action}</span>
                    <span className="text-gray-500 ml-2">by {log.username}</span>
                    {log.details && <p className="text-gray-400 text-xs mt-0.5">{log.details}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(log.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
