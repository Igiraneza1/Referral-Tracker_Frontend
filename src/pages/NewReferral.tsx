import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { ArrowLeft } from 'lucide-react';

export default function NewReferral() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    referringFacility: '',
    receivingFacility: '',
    reason: '',
    notes: '',
    referralDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.patientId) newErrors.patientId = 'Patient ID is required';
    if (!form.patientName) newErrors.patientName = 'Patient name is required';
    if (!form.referringFacility) newErrors.referringFacility = 'Referring facility is required';
    if (!form.receivingFacility) newErrors.receivingFacility = 'Receiving facility is required';
    if (!form.reason) newErrors.reason = 'Reason is required';
    if (!form.referralDate) newErrors.referralDate = 'Referral date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post('/referrals', {
        patientId: form.patientId,
        patientName: form.patientName,
        referringFacility: form.referringFacility,
        receivingFacility: form.receivingFacility,
        reason: form.reason,
        notes: form.notes || undefined,
        referralDate: form.referralDate,
      });

      setSuccess('Referral created successfully');

      // reset form
      setForm({
        patientId: '',
        patientName: '',
        referringFacility: '',
        receivingFacility: '',
        reason: '',
        notes: '',
        referralDate: '',
      });

      setTimeout(() => navigate('/referrals'), 1500);

    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to create referral. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-[#1a1a4e]">New Referral</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create a new patient referral
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div>
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient ID"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                placeholder="e.g. RW-2026-001"
                error={errors.patientId}
                required
              />
              <Input
                label="Patient Name"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Full name"
                error={errors.patientName}
                required
              />
            </div>
          </div>

          {/* facilities */}
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Facility Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Referring Facility"
                name="referringFacility"
                value={form.referringFacility}
                onChange={handleChange}
                placeholder="Facility sending the patient"
                error={errors.referringFacility}
                required
              />
              <Input
                label="Receiving Facility"
                name="receivingFacility"
                value={form.receivingFacility}
                onChange={handleChange}
                placeholder="Facility receiving the patient"
                error={errors.receivingFacility}
                required
              />
            </div>
          </div>

          {/* referral details */}
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a4e] uppercase tracking-wide mb-4">
              Referral Details
            </h3>
            <div className="flex flex-col gap-4">

              <Input
                label="Referral Date"
                name="referralDate"
                type="date"
                value={form.referralDate}
                onChange={handleChange}
                error={errors.referralDate}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#1a1a4e]">
                  Reason <span className="text-[#6c63ff]">*</span>
                </label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Reason for referral"
                  rows={3}
                  className={`
                    px-4 py-2 rounded-lg border text-sm
                    bg-white text-[#1a1a4e]
                    placeholder:text-gray-400
                    outline-none transition-all duration-200
                    focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent
                    ${errors.reason
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-[#6c63ff]'
                    }
                  `}
                />
                {errors.reason && (
                  <p className="text-xs text-red-500">{errors.reason}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#1a1a4e]">
                  Notes <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes"
                  rows={2}
                  className="
                    px-4 py-2 rounded-lg border text-sm
                    bg-white text-[#1a1a4e]
                    placeholder:text-gray-400
                    outline-none transition-all duration-200
                    border-gray-300 hover:border-[#6c63ff]
                    focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent
                  "
                />
              </div>

            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Referral'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/referrals')}
            >
              Cancel
            </Button>
          </div>

        </form>
      </div>

    </Layout>
  );
}