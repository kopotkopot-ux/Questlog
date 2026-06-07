/**
 * Activity logs page - FR-024
 */
import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import Layout from '../components/layout/Layout';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLogs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.getActivityLogs({ page, limit: 20, search });
      setLogs(data.data.logs);
      setPagination({ page: data.data.page, totalPages: data.data.totalPages });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(1); }, [search]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Activity Logs 📋</h1>
          <p className="text-gray-500">System audit trail and user actions</p>
        </div>

        <div className="card">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-md"
          />
        </div>

        {loading ? (
          <Spinner size="lg" />
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.logId} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
                <div>
                  <span className="font-bold text-quest-600 text-sm">{log.action}</span>
                  <span className="text-gray-500 text-sm ml-2">— {log.username}</span>
                  {log.details && <p className="text-xs text-gray-400 mt-1">{log.details}</p>}
                </div>
                <span className="text-xs text-gray-400">{new Date(log.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <Pagination {...pagination} onPageChange={loadLogs} />
      </div>
    </Layout>
  );
}
