import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Spinner from '../components/spinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import { UserPlus, UserX, UserCheck } from 'lucide-react';
import type { User } from '../types';

export default function UserManagement() {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'REFERRAL_OFFICER',
    facility: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const allowedRoles = () => {
    if (user?.role === 'ADMIN' || user?.role === 'DEVELOPER') {
      return ['ADMIN', 'DEVELOPER', 'FACILITY_ADMIN', 'REFERRAL_OFFICER', 'VIEWER'];
    }
    if (user?.role === 'FACILITY_ADMIN') {
      return ['REFERRAL_OFFICER', 'VIEWER'];
    }
    return [];
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (form.role !== 'ADMIN' && form.role !== 'DEVELOPER' && !form.facility) {
      newErrors.facility = 'Facility is required for this role';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    try {
      setSubmitting(true);

      await api.post('/auth/create-user', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        facility: form.facility || undefined,
      });

      setSuccess('User created successfully');
      setShowForm(false);
      setForm({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'REFERRAL_OFFICER',
        facility: '',
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (userId: number, isActive: boolean) => {
    try {
      setError('');
      await api.patch(`/users/${userId}/status`, {
        isActive: !isActive,
      });
      setSuccess(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-[#6c63ff]',
    DEVELOPER: 'bg-blue-100 text-blue-700',
    FACILITY_ADMIN: 'bg-teal-100 text-teal-700',
    REFERRAL_OFFICER: 'bg-amber-100 text-amber-700',
    VIEWER: 'bg-gray-100 text-gray-600',
  };

  if (loading) return <Spinner fullScreen message="Loading users..." />;

  return (
    <Layout
      fullName={user?.fullName || ''}
      role={user?.role || ''}
      facility={user?.facility}
    >

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a4e]">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} user{users.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <span className="flex items-center gap-2">
            <UserPlus size={16} />
            {showForm ? 'Cancel' : 'New User'}
          </span>
        </Button>
      </div>

      {/* alerts */}
      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {/* create user form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-base font-semibold text-[#1a1a4e] mb-4">
            Create New User
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full name"
                error={formErrors.fullName}
                required
              />
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                error={formErrors.username}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                error={formErrors.email}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                error={formErrors.password}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#1a1a4e]">
                  Role <span className="text-[#6c63ff]">*</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="
                    px-4 py-2 text-sm border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6c63ff]
                    focus:border-transparent bg-white text-gray-700
                  "
                >
                  {allowedRoles().map(role => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="text-xs text-red-500">{formErrors.role}</p>
                )}
              </div>

              {form.role !== 'ADMIN' && form.role !== 'DEVELOPER' && (
                <Input
                  label="Facility"
                  name="facility"
                  value={form.facility}
                  onChange={handleChange}
                  placeholder="Hospital or health center name"
                  error={formErrors.facility}
                  required
                />
              )}

            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create User'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>

          </form>
        </div>
      )}

      {/* users table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a4e] text-white">
                <th className="text-left px-4 py-3 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Full Name</th>
                <th className="text-left px-4 py-3 font-medium">Username</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Facility</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`
                      border-b border-gray-100
                      hover:bg-purple-50 transition-colors duration-150
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    `}
                  >
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#1a1a4e]">
                      {u.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.username}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}
                      `}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {u.facility || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${u.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }
                      `}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleDeactivate(u.id, u.isActive)}
                          className={`
                            flex items-center gap-1.5 px-3 py-1.5
                            text-xs font-medium rounded-lg
                            border transition-all duration-200
                            ${u.isActive
                              ? 'text-red-600 border-red-300 hover:bg-red-600 hover:text-white'
                              : 'text-green-600 border-green-300 hover:bg-green-600 hover:text-white'
                            }
                          `}
                        >
                          {u.isActive
                            ? <><UserX size={14} /> Deactivate</>
                            : <><UserCheck size={14} /> Activate</>
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </Layout>
  );
}