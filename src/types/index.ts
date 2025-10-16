export type UserRole = 'student' | 'portfolio_team' | 'rto_assessor' | 'admin';

export type EvidenceStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'endorsed';

export interface Evidence {
  id: string;
  studentId: string;
  title: string;
  description: string;
  fileType: 'photo' | 'video' | 'document';
  fileUrl: string;
  uploadedAt: Date;
  status: EvidenceStatus;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  enrolledDate: Date;
  progress: number;
  status: 'active' | 'pending' | 'completed' | 'endorsed';
  evidenceCount: number;
  assignedTo?: string;
  rtoAssignedTo?: string;
  companyId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}
