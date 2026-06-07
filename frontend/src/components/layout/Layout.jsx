/**
 * Main application layout with sidebar navigation
 */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count for notification badge
  useEffect(() => {
    if (user && !isAdmin) {
      import('../../api/notifications').then(({ notificationApi }) => {
        notificationApi.getUnreadCount()
          .then(({ data }) => setUnreadCount(data.data.unreadCount))
          .catch(() => {});
      });
    }
  }, [user, isAdmin]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/tasks', label: 'Quests', icon: '⚔️' },
    { to: '/notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
    { to: '/profile', label: 'Profile', icon: '👤' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: '🛡️' },
    { to: '/admin/users', label: 'User Management', icon: '👥' },
    { to: '/admin/activity-logs', label: 'Activity Logs', icon: '📋' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const NavLink = ({ to, label, icon, badge }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition ${
          active
            ? 'bg-quest-600 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span>{icon}</span>
        <span>{label}</span>
        {badge > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b dark:border-gray-800">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-quest-600 to-purple-600 bg-clip-text text-transparent">
              QuestLog
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Level up your productivity</p>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} {...link} />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-quest-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full btn-secondary text-sm py-2">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ☰
          </button>
          <div className="flex-1" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
