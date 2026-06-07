/**
 * User dashboard - FR-018, FR-019, FR-020
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressApi } from '../api/progress';
import { taskApi } from '../api/tasks';
import { notificationApi } from '../api/notifications';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/ui/ProgressBar';
import PriorityBadge from '../components/ui/PriorityBadge';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [progressRes, tasksRes, overdueRes, notifRes] = await Promise.all([
          progressApi.getProgress(),
          taskApi.getTasks({ limit: 5 }),
          taskApi.getOverdueTasks(),
          notificationApi.getUnreadCount(),
        ]);
        setProgress(progressRes.data.data);
        setRecentTasks(tasksRes.data.data.tasks);
        setOverdueTasks(overdueRes.data.data);
        setUnreadCount(notifRes.data.data.unreadCount);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <Layout><Spinner size="lg" /></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">
              Welcome back, <span className="text-quest-600">{user?.username}</span>! ⚔️
            </h1>
            <p className="text-gray-500 mt-1">Ready to conquer today's quests?</p>
          </div>
          <Link to="/tasks" className="btn-primary">
            + New Quest
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Quests', value: progress?.totalTasks || 0, icon: '📋', color: 'text-quest-600' },
            { label: 'Completed', value: progress?.completedTasks || 0, icon: '✅', color: 'text-green-600' },
            { label: 'Pending', value: progress?.pendingTasks || 0, icon: '⏳', color: 'text-amber-600' },
            { label: 'Overdue', value: progress?.overdueTasks || 0, icon: '⚠️', color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card">
          <ProgressBar
            percentage={progress?.progressPercentage || 0}
            label="Overall Quest Completion"
          />
          <p className="text-sm text-gray-500 mt-3">
            {progress?.completedTasks || 0} of {progress?.totalTasks || 0} quests completed
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Recent Quests</h2>
              <Link to="/tasks" className="text-sm text-quest-600 hover:underline">View all →</Link>
            </div>
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No quests yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.taskId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <PriorityBadge priority={task.priorityLevel} />
                    </div>
                    <span className={`text-xs font-bold ${task.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      {task.status === 'completed' ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue & notifications */}
          <div className="space-y-4">
            {overdueTasks.length > 0 && (
              <div className="card border-red-200 dark:border-red-800">
                <h2 className="font-bold text-lg text-red-600 mb-3">⚠ Overdue Quests</h2>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.taskId} className="text-sm p-2 rounded bg-red-50 dark:bg-red-900/20">
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <Link to="/notifications" className="text-sm text-quest-600 hover:underline">
                View all notifications →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
