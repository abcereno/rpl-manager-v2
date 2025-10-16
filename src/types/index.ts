export type UserRole = 'student' | 'portfolio_team' | 'rto_assessor' | 'admin';

export type EvidenceStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'endorsed';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  comment: string;
  createdAt: Date;
}

export interface Evidence {
  id: string;
  studentId: string;
  unitId: string;
  title: string;
  description: string;
  fileType: 'photo' | 'video' | 'document';
  fileUrl: string;
  uploadedAt: Date;
  status: EvidenceStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  comments?: Comment[];
}

export interface Unit {
    id: string;
    code: string;
    name: string;
    description: string;
    evidenceCount: number;
}

export interface Qualification {
    id: string;
    name: string;
    code: string;
    progress: number;
    units: Unit[];
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
  qualifications: Qualification[];
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

