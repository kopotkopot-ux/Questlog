/**
 * Landing page for guest users
 */
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { darkMode, toggleTheme } = useTheme();

  const features = [
    { icon: '⚔️', title: 'Quest-Based Tasks', desc: 'Transform chores into epic quests with XP-style progress tracking.' },
    { icon: '🎯', title: 'Priority Levels', desc: 'Easy, Medium, and Hard priorities to match your challenge appetite.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Visual progress bars and completion percentages keep you motivated.' },
    { icon: '🔔', title: 'Smart Notifications', desc: 'Never miss a deadline with timely reminders and overdue alerts.' },
    { icon: '🌙', title: 'Light & Dark Mode', desc: 'Beautiful interface that adapts to your preferred theme.' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Seamless experience on desktop, tablet, and mobile.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-quest-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-quest-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">⚔️</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-quest-600 to-purple-600 bg-clip-text text-transparent">
            QuestLog
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/login" className="btn-secondary text-sm">Log In</Link>
          <Link to="/register" className="btn-primary text-sm">Start Quest</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-quest-100 dark:bg-quest-900/30 text-quest-700 dark:text-quest-300 text-sm font-semibold mb-6">
          🎮 Gamified Task Management
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Turn Tasks Into
          <span className="block bg-gradient-to-r from-quest-600 to-purple-600 bg-clip-text text-transparent">
            Epic Quests
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          QuestLog transforms everyday productivity into an adventure. Track progress, earn completion rewards, and conquer your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Begin Your Adventure →
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-3">
            Continue Quest
          </Link>
        </div>

        {/* Demo progress preview */}
        <div className="mt-16 max-w-md mx-auto card text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Quest Progress</span>
            <span className="text-quest-600 font-bold">67%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-2/3 progress-shimmer rounded-full" />
          </div>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>✓ 4 Completed</span>
            <span>⏳ 2 Pending</span>
            <span>🔥 1 Hard</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why QuestLog?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-lg transition hover:-translate-y-1">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="card bg-gradient-to-r from-quest-600 to-purple-600 text-white border-0">
          <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
          <p className="mb-6 opacity-90">Join QuestLog and start completing quests today.</p>
          <Link to="/register" className="inline-block bg-white text-quest-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm border-t dark:border-gray-800">
        <p>QuestLog © 2026 — Turn everyday tasks into achievable quests.</p>
        <p className="mt-1">Based on IEEE 830-1998 SRS by Xian Tristan Teaño</p>
      </footer>
    </div>
  );
}
