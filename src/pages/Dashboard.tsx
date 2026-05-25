import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/spinner';
import Button from '../components/Button';
import { Users, Clock, CheckCircle, Activity } from 'lucide-react';
import type { Referral } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await api.get('/referrals');
        setReferrals(response.data);
      } catch (error) {
        console.error('Failed to fetch referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  // calculate stats
  const total = referrals.length;
  const pending = referrals.filter(r => r.status === 'pending').length;
  const attended = referrals.filter(r => r.status === 'attended').length;
  const closed = referrals.filter(r => r.status === 'closed').length;

  // last 5 referrals
  const recent = referrals.slice(-5).reverse();

  if (loading) return <Spinner fullScreen message="Loading dashboard..." />;

  return (
    <Layout
      fullName={user?.fullName || ''}
      role={user?.role || ''}
      facility={user?.facility}
    >

      {/* welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a4e]">
          Welcome back, {user?.fullName} 
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is what is happening in your referral system
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          title="Total Referrals"
          value={total}
          icon={<Activity size={20} />}
          color="purple"
        />
        <Card
          title="Pending"
          value={pending}
          icon={<Clock size={20} />}
          color="amber"
        />
        <Card
          title="Attended"
          value={attended}
          icon={<Users size={20} />}
          color="teal"
        />
        <Card
          title="Closed"
          value={closed}
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>

      {/* recent referrals */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1a1a4e]">
            Recent Referrals
          </h2>
          <Button
            variant="outline"
            onClick={() => navigate('/referrals')}
          >
            View All
          </Button>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No referrals yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a4e] text-white rounded-lg">
                  <th className="text-left px-4 py-3 font-medium">Patient</th>
                  <th className="text-left px-4 py-3 font-medium">From</th>
                  <th className="text-left px-4 py-3 font-medium">To</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((referral, index) => (
                  <tr
                    key={referral.id}
                    onClick={() => navigate(`/referrals/${referral.id}`)}
                    className={`
                      border-b border-gray-100 cursor-pointer
                      hover:bg-purple-50 transition-colors duration-150
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    `}
                  >
                    <td className="px-4 py-3 font-medium text-[#1a1a4e]">
                      {referral.patientName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {referral.referringFacility}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {referral.receivingFacility}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(referral.referralDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={referral.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </Layout>
  );
}