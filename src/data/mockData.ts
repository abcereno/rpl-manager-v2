import { Student, Evidence, User } from '../types';


export const mockStudents: Student[] = [

  { id: '1', name: 'James Mitchell', email: 'james@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592377602_3605fe71.webp', course: 'Certificate III in Carpentry', enrolledDate: new Date('2024-09-15'), progress: 75, status: 'active', evidenceCount: 12, assignedTo: 'Sarah Johnson' },
  { id: '2', name: 'Emily Chen', email: 'emily@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592379968_820fdb8b.webp', course: 'Certificate IV in Building', enrolledDate: new Date('2024-08-20'), progress: 90, status: 'endorsed', evidenceCount: 18, assignedTo: 'Sarah Johnson', rtoAssignedTo: 'Michael Brown' },
  { id: '3', name: 'Marcus Thompson', email: 'marcus@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-10-01'), progress: 45, status: 'active', evidenceCount: 8, assignedTo: 'Sarah Johnson' },
  { id: '4', name: 'Sofia Rodriguez', email: 'sofia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592383521_a414931c.webp', course: 'Certificate III in Electrical', enrolledDate: new Date('2024-09-10'), progress: 60, status: 'active', evidenceCount: 10, assignedTo: 'Sarah Johnson' },
  { id: '5', name: 'David Kim', email: 'david@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592385235_6ae54ba5.webp', course: 'Certificate III in Carpentry', enrolledDate: new Date('2024-07-15'), progress: 85, status: 'active', evidenceCount: 15, assignedTo: 'Sarah Johnson' },
  { id: '6', name: 'Aisha Patel', email: 'aisha@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592386945_c7c76c91.webp', course: 'Certificate IV in Construction', enrolledDate: new Date('2024-06-01'), progress: 95, status: 'endorsed', evidenceCount: 22, assignedTo: 'Sarah Johnson', rtoAssignedTo: 'Michael Brown' },
  { id: '7', name: 'Lucas Anderson', email: 'lucas@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592377602_3605fe71.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-09-25'), progress: 30, status: 'active', evidenceCount: 5, assignedTo: 'Sarah Johnson' },
  { id: '8', name: 'Isabella Martinez', email: 'isabella@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592379968_820fdb8b.webp', course: 'Certificate III in Electrical', enrolledDate: new Date('2024-08-05'), progress: 70, status: 'active', evidenceCount: 13, assignedTo: 'Sarah Johnson' },
  { id: '9', name: 'Noah Williams', email: 'noah@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592381829_09bd17d6.webp', course: 'Certificate IV in Building', enrolledDate: new Date('2024-05-20'), progress: 100, status: 'completed', evidenceCount: 25, assignedTo: 'Sarah Johnson' },
  { id: '10', name: 'Olivia Brown', email: 'olivia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592383521_a414931c.webp', course: 'Certificate III in Carpentry', enrolledDate: new Date('2024-10-10'), progress: 20, status: 'pending', evidenceCount: 3, assignedTo: 'Sarah Johnson' },
  { id: '11', name: 'Ethan Davis', email: 'ethan@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592385235_6ae54ba5.webp', course: 'Certificate III in Plumbing', enrolledDate: new Date('2024-09-01'), progress: 55, status: 'active', evidenceCount: 9, assignedTo: 'Sarah Johnson' },
  { id: '12', name: 'Mia Wilson', email: 'mia@email.com', avatar: 'https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592386945_c7c76c91.webp', course: 'Certificate IV in Construction', enrolledDate: new Date('2024-07-20'), progress: 80, status: 'active', evidenceCount: 16, assignedTo: 'Sarah Johnson' },
];

export const mockEvidence: Evidence[] = [
  { id: '1', studentId: '1', title: 'Site Safety Inspection', description: 'Completed safety checklist', fileType: 'photo', fileUrl: '', uploadedAt: new Date(), status: 'approved' },
];
