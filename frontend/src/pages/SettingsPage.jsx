/**
 * Settings page - theme and preferences
 */
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-black">Settings ⚙️</h1>
          <p className="text-gray-500">Customize your QuestLog experience</p>
        </div>

        <div className="card space-y-6">
          <div>
            <h2 className="font-bold text-lg mb-4">Appearance</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`p-4 rounded-xl border-2 transition ${
                  !darkMode ? 'border-quest-600 bg-quest-50 dark:bg-quest-900/20' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">☀️</div>
                <div className="font-semibold">Light Mode</div>
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`p-4 rounded-xl border-2 transition ${
                  darkMode ? 'border-quest-600 bg-quest-50 dark:bg-quest-900/20' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">🌙</div>
                <div className="font-semibold">Dark Mode</div>
              </button>
            </div>
          </div>

          <div className="border-t dark:border-gray-800 pt-6">
            <h2 className="font-bold text-lg mb-2">About QuestLog</h2>
            <p className="text-sm text-gray-500">
              QuestLog v1.0 — Gamified Task Management Web Application.
              Based on IEEE 830-1998 Software Requirements Specification.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
