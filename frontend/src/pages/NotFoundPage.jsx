/**
 * 404 Not Found page
 */
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-quest-50 to-purple-50 dark:from-gray-950 dark:to-quest-950 p-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🗺️</div>
        <h1 className="text-6xl font-black text-quest-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Quest Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          This path doesn't exist in the QuestLog realm. The quest you seek has vanished into the void.
        </p>
        <Link to="/" className="btn-primary px-8 py-3">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
