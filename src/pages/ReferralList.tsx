import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Spinner from '../components/spinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { Plus, Search } from 'lucide-react';
import type { Referral } from '../types';

export default function ReferralList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filtered, setFiltered] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const canCreate = ['ADMIN', 'DEVELOPER', 'FACILITY_ADMIN', 'REFERRAL_OFFICER']
    .includes(user?.role || '');

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await api.get('/referrals');
        setReferrals(response.data);
        setFiltered(response.data);
      } catch (err) {
        setError('Failed to fetch referrals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  // filter by search and status
  useEffect(() => {
    let result = referrals;

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(r =>
        r.patientName.toLowerCase().includes(query) ||
        r.patientId.toLowerCase().includes(query) ||
        r.referringFacility.toLowerCase().includes(query) ||
        r.receivingFacility.toLowerCase().includes(query)
      );
    }

    setFiltered(result);
  }, [search, statusFilter, referrals]);

  if (loading) return <Spinner fullScreen message="Loading referrals..." />;

  return (
    <Layout
      fullName={user?.fullName || ''}
      role={user?.role || ''}
      facility={user?.facility}
    >

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a4e]">Referrals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} referral{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            onClick={() => navigate('/referrals/new')}
          >
            <span className="flex items-center gap-2">
              <Plus size={16} />
              New Referral
            </span>
          </Button>
        )}
      </div>

      {/* error */}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {/* filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">

        {/* search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by patient name, ID or facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2 text-sm
              border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#6c63ff]
              focus:border-transparent
            "
          />
        </div>

        {/* status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            px-4 py-2 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#6c63ff]
            focus:border-transparent bg-white text-gray-700
          "
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="attended">Attended</option>
          <option value="feedback_received">Feedback Received</option>
          <option value="closed">Closed</option>
        </select>

      </div>

      {/* table */}
      <Table
        referrals={filtered}
        onView={(id) => navigate(`/referrals/${id}`)}
      />

    </Layout>
  );
}