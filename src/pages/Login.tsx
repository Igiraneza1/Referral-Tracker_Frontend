import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { Activity } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // basic validation
    if (!username || !password) {
      setError('Please enter your username and password');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      // save to context and localStorage
      login(token, user);

    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#1a1a4e] p-4 rounded-2xl mb-4">
            <Activity size={32} className="text-[#6c63ff]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a4e]">Referral Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Healthcare Information System</p>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          <h2 className="text-lg font-semibold text-[#1a1a4e] mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to your account to continue
          </p>

          {/* error alert */}
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} dismissible={false} />
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Input
              label="Username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

          </form>

        </div>

        {/* footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account? Contact your administrator.
        </p>

      </div>
    </div>
  );
}