import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Spinner from '../components/spinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { ArrowLeft, Calendar, Building2, User, FileText } from 'lucide-react';
import type { Referral } from '../types';

export default function ReferralDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const canUpdate = ['ADMIN', 'DEVELOPER', 'FACILITY_ADMIN', 'REFERRAL_OFFICER']
    .includes(user?.role || '');

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const response = await api.get(`/referrals/${id}`);
        setReferral(response.data);
        setNewStatus(response.data.status);
      } catch (err) {
        setError('Referral not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!referral || newStatus === referral.status) return;

    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      const response = await api.patch(`/referrals/${id}/status`, {
        status: newStatus,
      });

      setReferral(response.data);
      setSuccess('Status updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner fullScreen message="Loading referral..." />;

  if (!referral) {
    return (
      <Layout
        fullName={user?.fullName || ''}
        role={user?.role || ''}
        facility={user?.facility}
      >
        <Alert type="error" message="Referral not found" />
      </Layout>
    );
  }

  return (
    <Layout
      fullName={user?.fullName || ''}
      role={user?.role || ''}
      facility={user?.facility}
    >

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/referrals')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-[#1a1a4e]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a4e]">
            Referral Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Referral ID #{referral.id}
          </p>
        </div>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User size={16} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Patient Name</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {referral.patientName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText size={16} className="text-[#6c63ff]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Patient ID</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {referral.patientId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Facility Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Building2 size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Referring Facility</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {referral.referringFacility}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Building2 size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Receiving Facility</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {referral.receivingFacility}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Clinical Details
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Reason for Referral</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {referral.reason}
                </p>
              </div>
              {referral.notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {referral.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Status
            </h3>
            <div className="mb-4">
              <Badge status={referral.status} />
            </div>

            {canUpdate && (
              <div className="flex flex-col gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="
                    w-full px-4 py-2 text-sm
                    border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6c63ff]
                    focus:border-transparent bg-white text-gray-700
                  "
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="attended">Attended</option>
                  <option value="feedback_received">Feedback Received</option>
                  <option value="closed">Closed</option>
                </select>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={updating || newStatus === referral.status}
                  onClick={handleStatusUpdate}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Dates
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Calendar size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Referral Date</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {new Date(referral.referralDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Calendar size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Created At</p>
                  <p className="text-sm font-medium text-[#1a1a4e]">
                    {new Date(referral.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </Layout>
  );
}