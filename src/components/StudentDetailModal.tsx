import React from 'react';
import { Modal } from './ui/Modal';
import { Student } from '../types';
import { StatusBadge } from './ui/StatusBadge';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEndorse?: (studentId: string) => void;
  showEndorseButton?: boolean;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ 
  student, 
  isOpen, 
  onClose,
  onEndorse,
  showEndorseButton = false
}) => {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <img 
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#fdb715]"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#373b40] mb-2">{student.name}</h3>
            <p className="text-gray-600 mb-2">{student.email}</p>
            <StatusBadge status={student.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Course</p>
            <p className="font-semibold text-[#373b40]">{student.course}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Enrolled Date</p>
            <p className="font-semibold text-[#373b40]">{student.enrolledDate.toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Evidence Submitted</p>
            <p className="font-semibold text-[#373b40]">{student.evidenceCount} items</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Assigned To</p>
            <p className="font-semibold text-[#373b40]">{student.assignedTo || 'Unassigned'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#373b40] mb-3">Progress Overview</h4>
          <ProgressBar progress={student.progress} />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Recent Activity</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Uploaded 3 new evidence items - 2 days ago</li>
            <li>• Completed safety assessment - 5 days ago</li>
            <li>• Portfolio reviewed by {student.assignedTo} - 1 week ago</li>
          </ul>
        </div>

        {showEndorseButton && onEndorse && student.progress >= 70 && (
          <Button onClick={() => onEndorse(student.id)} className="w-full">
            Endorse to RTO
          </Button>
        )}
      </div>
    </Modal>
  );
};
