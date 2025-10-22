import { Student, Evidence, Qualification, Unit, Comment } from '../types';

// Mock Units of Competency
export const mockUnitsCarpentry: Unit[] = [
  { id: 'unit-c1', code: 'CPCCCA2011A', name: 'Handle carpentry materials', description: 'This unit covers the competency to handle carpentry materials safely and effectively.', evidenceCount: 3 },
  { id: 'unit-c2', code: 'CPCCCA2002B', name: 'Use carpentry tools and equipment', description: 'This unit specifies the outcome required to use and maintain carpentry tools and equipment.', evidenceCount: 5 },
  { id: 'unit-c3', code: 'CPCCCA3001A', name: 'Carry out general demolition of minor building structures', description: 'This unit of competency covers the demolition of minor building structures.', evidenceCount: 2 },
  { id: 'unit-c4', code: 'CPCCCA3002A', name: 'Carry out setting out', description: 'This unit covers the competency to set out buildings and structures for construction.', evidenceCount: 1 },
  { id: 'unit-c5', code: 'CPCCCM2001A', name: 'Read and interpret plans and specifications', description: 'This unit is about reading and interpreting plans and specifications for construction projects.', evidenceCount: 0 },
];

export const mockUnitsBuilding: Unit[] = [
    { id: 'unit-b1', code: 'CPCCBC4001A', name: 'Apply building codes and standards', description: 'Apply building codes and standards to the construction process for low-rise building projects.', evidenceCount: 2 },
    { id: 'unit-b2', code: 'CPCCBC4002A', name: 'Manage occupational health and safety', description: 'Manage occupational health and safety (OHS) in the building and construction workplace.', evidenceCount: 1 },
    { id: 'unit-b3', code: 'CPCCBC4003A', name: 'Select and prepare a construction contract', description: 'Select, procure and administer a construction contract.', evidenceCount: 0 },
];


// Mock Qualifications
export const mockQualifications: Qualification[] = [
  {
    id: 'qual-1',
    name: 'Certificate III in Carpentry',
    code: 'CPC30220',
    progress: 75,
    units: mockUnitsCarpentry,
  },
  {
    id: 'qual-2',
    name: 'Certificate IV in Building and Construction',
    code: 'CPC40120',
    progress: 25,
    units: mockUnitsBuilding,
  }
];

// Mock Evidence
export const mockEvidence: Evidence[] = [
  // Evidence for unit-c1
  { id: 'ev-1', studentId: '1', unitId: 'unit-c1', title: 'Material Handling Safety Checklist', description: 'Signed checklist from supervisor.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-10'), status: 'approved' },
  { id: 'ev-2', studentId: '1', unitId: 'unit-c1', title: 'Video of stacking timber', description: 'Short video showing correct stacking procedure.', fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-10-11'), status: 'approved' },
  { id: 'ev-3', studentId: '1', unitId: 'unit-c1', title: 'Photo of materials storage', description: 'Photo of the storage area on site.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-10-12'), status: 'under_review' },

  // Evidence for unit-c2
  { id: 'ev-4', studentId: '1', unitId: 'unit-c2', title: 'Tool maintenance log', description: 'Log book showing regular tool maintenance.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-09-20'), status: 'approved' },
  { id: 'ev-5', studentId: '1', unitId: 'unit-c2', title: 'Using a circular saw', description: 'Video demonstrating safe use of a circular saw.', fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-09-22'), status: 'approved' },
  { 
    id: 'ev-6', studentId: '1', unitId: 'unit-c2', title: 'Using a power drill', 
    description: 'Video demonstrating safe use of a power drill.', 
    fileType: 'video', fileUrl: '', uploadedAt: new Date('2025-09-25'), status: 'rejected',
    reviewNotes: 'The video is too blurry and does not clearly show the safety guard in place. Please re-submit with a clearer video.',
    comments: [
      {
        id: 'comment-1',
        author: 'Michael Brown (RTO Assessor)',
        authorAvatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp',
        comment: 'The video is too blurry and does not clearly show the safety guard in place. Please re-submit with a clearer video.',
        createdAt: new Date('2025-09-26'),
      }
    ] 
  },
  { id: 'ev-7', studentId: '1', unitId: 'unit-c2', title: 'Hand tools photo', description: 'A photo of my hand tools.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-09-28'), status: 'pending' },
  { id: 'ev-8', studentId: '1', unitId: 'unit-c2', title: 'Hand tools photo 2', description: 'Another photo of my hand tools.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-09-28'), status: 'pending' },

  // Evidence for unit-c3
  { id: 'ev-9', studentId: '1', unitId: 'unit-c3', title: 'Demolition plan', description: 'Minor demolition plan.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-01'), status: 'approved' },
  { id: 'ev-10', studentId: '1', unitId: 'unit-c3', title: 'Site cleanup photo', description: 'Photo after demolition.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-10-02'), status: 'approved' },
  
  // Evidence for unit-c4
  { id: 'ev-11', studentId: '1', unitId: 'unit-c4', title: 'Set out diagram', description: 'Diagram of building set out.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-15'), status: 'pending' },
  
  // Evidence for unit-b1
  { id: 'ev-12', studentId: '1', unitId: 'unit-b1', title: 'Building Code Assessment', description: 'Quiz on local building codes.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-18'), status: 'approved' },
  { id: 'ev-13', studentId: '1', unitId: 'unit-b1', title: 'Code Compliance Photo', description: 'Example of compliant guardrail installation.', fileType: 'photo', fileUrl: '', uploadedAt: new Date('2025-10-19'), status: 'under_review' },
  
  // Evidence for unit-b2
  { id: 'ev-14', studentId: '1', unitId: 'unit-b2', title: 'OHS Site Induction', description: 'Certificate of OHS site induction.', fileType: 'document', fileUrl: '', uploadedAt: new Date('2025-10-20'), status: 'approved' },
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
    evidenceCount: 14,
    assignedTo: 'Sarah Johnson',
    qualifications: mockQualifications,
  },
  { id: '2', course: 'Certificate III in Carpentry', name: 'Emily Chen', email: 'emily@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592379968_820fdb8b.webp', enrolledDate: new Date('2024-08-20'), progress: 90, status: 'endorsed', evidenceCount: 18, assignedTo: 'Sarah Johnson', rtoAssignedTo: 'Michael Brown', qualifications: [] },
  { id: '3', course: 'Certificate III in Carpentry', name: 'Marcus Thompson', email: 'marcus@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp', enrolledDate: new Date('2024-10-01'), progress: 45, status: 'active', evidenceCount: 8, assignedTo: 'Sarah Johnson', qualifications: [] },
  // ... other students
];