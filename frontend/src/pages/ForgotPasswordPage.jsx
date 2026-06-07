/**
 * Forgot password page - FR-003
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import Alert from '../components/ui/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(email);
      setMessage(data.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-quest-50 to-purple-50 dark:from-gray-950 dark:to-quest-950 p-4">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={message} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-quest-600 hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
