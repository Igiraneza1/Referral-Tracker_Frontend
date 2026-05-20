import Badge from './Badge';
import { Eye } from 'lucide-react';
import { Referral } from '../types';

interface TableProps {
  referrals: Referral[];
  onView: (id: number) => void;
}

export default function Table({ referrals, onView }: TableProps) {
  if (referrals.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">No referrals found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* header */}
          <thead>
            <tr className="bg-[#1a1a4e] text-white">
              <th className="text-left px-4 py-3 font-medium">#</th>
              <th className="text-left px-4 py-3 font-medium">Patient ID</th>
              <th className="text-left px-4 py-3 font-medium">Patient Name</th>
              <th className="text-left px-4 py-3 font-medium">From</th>
              <th className="text-left px-4 py-3 font-medium">To</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>

          {/* body */}
          <tbody>
            {referrals.map((referral, index) => (
              <tr
                key={referral.id}
                className={`
                  border-b border-gray-100
                  hover:bg-purple-50 transition-colors duration-150
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                `}
              >
                <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-[#1a1a4e]">
                  {referral.patientId}
                </td>
                <td className="px-4 py-3 text-gray-700">
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
                <td className="px-4 py-3">
                  <button
                    onClick={() => onView(referral.id)}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5
                      text-xs font-medium text-[#6c63ff]
                      border border-[#6c63ff] rounded-lg
                      hover:bg-[#6c63ff] hover:text-white
                      transition-all duration-200
                    "
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}