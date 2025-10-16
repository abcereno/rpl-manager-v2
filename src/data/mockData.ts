import { Student, Evidence, Qualification, Unit } from '../types';

// Mock Units of Competency
export const mockUnits: Unit[] = [
  { id: 'unit-1', code: 'CPCCCA2011A', name: 'Handle carpentry materials', description: 'This unit covers the competency to handle carpentry materials safely and effectively.', evidenceCount: 3 },
  { id: 'unit-2', code: 'CPCCCA2002B', name: 'Use carpentry tools and equipment', description: 'This unit specifies the outcome required to use and maintain carpentry tools and equipment.', evidenceCount: 5 },
  { id: 'unit-3', code: 'CPCCCA3001A', name: 'Carry out general demolition of minor building structures', description: 'This unit of competency covers the demolition of minor building structures.', evidenceCount: 2 },
  { id: 'unit-4', code: 'CPCCCA3002A', name: 'Carry out setting out', description: 'This unit covers the competency to set out buildings and structures for construction.', evidenceCount: 1 },
  { id: 'unit-5', code: 'CPCCCM2001A', name: 'Read and interpret plans and specifications', description: 'This unit is about reading and interpreting plans and specifications for construction projects.', evidenceCount: 0 },
];

// Mock Qualifications
export const mockQualifications: Qualification[] = [
  {
    id: 'qual-1',
    name: 'Certificate III in Carpentry',
    code: 'CPC30220',
    progress: 75,
    units: mockUnits,
  }
];

// Mock Evidence
export const mockEvidence: Evidence[] = [
  // Evidence for unit-1
  { id: 'ev-1', studentId: '1', unitId: 'unit-1', title: 'Material Handling Safety Checklist', description: 'Signed checklist from supervisor.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-10'), status: 'approved' },
  { id: 'ev-2', studentId: '1', unitId: 'unit-1', title: 'Video of stacking timber', description: 'Short video showing correct stacking procedure.', fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-10-11'), status: 'approved' },
  { id: 'ev-3', studentId: '1', unitId: 'unit-1', title: 'Photo of materials storage', description: 'Photo of the storage area on site.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-10-12'), status: 'under_review' },

  // Evidence for unit-2
  { id: 'ev-4', studentId: '1', unitId: 'unit-2', title: 'Tool maintenance log', description: 'Log book showing regular tool maintenance.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-09-20'), status: 'approved' },
  { id: 'ev-5', studentId: '1', unitId: 'unit-2', title: 'Using a circular saw', description: 'Video demonstrating safe use of a circular saw.', fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-09-22'), status: 'approved' },
  { id: 'ev-6', studentId: '1', unitId: 'unit-2', title: 'Using a power drill', description: 'Video demonstrating safe use of a power drill.', fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-09-25'), status: 'rejected' },
  { id: 'ev-7', studentId: '1', unitId: 'unit-2', title: 'Hand tools photo', description: 'A photo of my hand tools.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-09-28'), status: 'pending' },
  { id: 'ev-8', studentId: '1', unitId: 'unit-2', title: 'Hand tools photo 2', description: 'Another photo of my hand tools.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-09-28'), status: 'pending' },

  // Evidence for unit-3
  { id: 'ev-9', studentId: '1', unitId: 'unit-3', title: 'Demolition plan', description: 'Minor demolition plan.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-01'), status: 'approved' },
  { id: 'ev-10', studentId: '1', unitId: 'unit-3', title: 'Site cleanup photo', description: 'Photo after demolition.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-10-02'), status: 'approved' },
  
  // Evidence for unit-4
  { id: 'ev-11', studentId: '1', unitId: 'unit-4', title: 'Set out diagram', description: 'Diagram of building set out.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-15'), status: 'pending' },
];


export const mockStudents: Student[] = [
  { 
    id: '1', 
    name: 'James Mitchell', 
    email: 'james@email.com', 
    avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592377602_3605fe71.webp', 
    course: 'Certificate III in Carpentry',
    enrolledDate: new Date('2024-09-15'), 
    progress: 75,
    status: 'active', 
    evidenceCount: 12,
    assignedTo: 'Sarah Johnson',
    qualifications: mockQualifications,
  },
  { id: '2', name: 'Emily Chen', email: 'emily@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592379968_820fdb8b.webp', course: 'Certificate IV in Building', enrolledDate: new Date('2024-08-20'), progress: 90, status: 'endorsed', evidenceCount: 18, assignedTo: 'Sarah Johnson', rtoAssignedTo: 'Michael Brown', qualifications: [] },
  { id: '3', name: 'Marcus Thompson', email: 'marcus@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-10-01'), progress: 45, status: 'active', evidenceCount: 8, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '4', name: 'Sofia Rodriguez', email: 'sofia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592383521_a414931c.webp', course: 'Certificate III in Electrical', enrolledDate: new Date('2024-09-10'), progress: 60, status: 'active', evidenceCount: 10, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '5', name: 'David Kim', email: 'david@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592385235_6ae54ba5.webp', course: 'Certificate III in Carpentry', enrolledDate: new Date('2024-07-15'), progress: 85, status: 'active', evidenceCount: 15, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '6', name: 'Aisha Patel', email: 'aisha@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592386945_c7c76c91.webp', course: 'Certificate IV in Construction', enrolledDate: new Date('2024-06-01'), progress: 95, status: 'endorsed', evidenceCount: 22, assignedTo: 'Sarah Johnson', rtoAssignedTo: 'Michael Brown', qualifications: [] },
  { id: '7', name: 'Lucas Anderson', email: 'lucas@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592377602_3605fe71.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-09-25'), progress: 30, status: 'active', evidenceCount: 5, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '8', name: 'Isabella Martinez', email: 'isabella@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592379968_820fdb8b.webp', course: 'Certificate III in Electrical', enrolledDate: new Date('2024-08-05'), progress: 70, status: 'active', evidenceCount: 13, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '9', name: 'Noah Williams', email: 'noah@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp', course: 'Certificate IV in Building', enrolledDate: new Date('2024-05-20'), progress: 100, status: 'completed', evidenceCount: 25, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '10', name: 'Olivia Brown', email: 'olivia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592383521_a414931c.webp', course: 'Certificate III in Carpentry', enrolledDate: new Date('2024-10-10'), progress: 20, status: 'pending', evidenceCount: 3, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '11', name: 'Ethan Davis', email: 'ethan@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592385235_6ae54ba5.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-09-01'), progress: 55, status: 'active', evidenceCount: 9, assignedTo: 'Sarah Johnson', qualifications: [] },
  { id: '12', name: 'Mia Wilson', email: 'mia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592386945_c7c76c91.webp', course: 'Certificate IV in Construction', enrolledDate: new Date('2024-07-20'), progress: 80, status: 'active', evidenceCount: 16, assignedTo: 'Sarah Johnson', qualifications: [] },
];

