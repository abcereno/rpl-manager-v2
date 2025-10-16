import React from 'react';
import { Student } from '../types';
import { StatusBadge } from './ui/StatusBadge';
import { ProgressBar } from './ui/ProgressBar';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  showAssignment?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onClick,
  showAssignment = false 
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-[#fdb715]"
    >
      <div className="flex items-start gap-4">
        <img 
          src={student.avatar} 
          alt={student.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#fdb715]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg text-[#373b40] truncate">{student.name}</h3>
              <p className="text-sm text-gray-600 truncate">{student.email}</p>
            </div>
            <StatusBadge status={student.status} />
          </div>
          <p className="text-sm text-gray-700 font-medium mb-3">{student.course}</p>
          <ProgressBar progress={student.progress} />
          <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
            <span>{student.evidenceCount} evidence items</span>
            {showAssignment && student.assignedTo && (
              <span className="text-[#fdb715] font-medium">Assigned to: {student.assignedTo}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
