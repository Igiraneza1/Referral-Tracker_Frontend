export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'DEVELOPER' | 'FACILITY_ADMIN' | 'REFERRAL_OFFICER' | 'VIEWER';
  facility?: string;
  isActive: boolean;
}

export interface Referral {
  id: number;
  patientId: string;
  patientName: string;
  referringFacility: string;
  receivingFacility: string;
  reason: string;
  status: 'pending' | 'accepted' | 'attended' | 'feedback_received' | 'closed';
  notes?: string;
  referralDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ReferralCreateInput {
  patientId: string;
  patientName: string;
  referringFacility: string;
  receivingFacility: string;
  reason: string;
  notes?: string;
  referralDate: string;
}

export interface ReferralStatusUpdate {
  status: Referral['status'];
}

export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}