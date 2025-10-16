import React, { useState } from 'react';
import { StudentCard } from './StudentCard';
import { Button } from './ui/Button';
import { mockStudents } from '../data/mockData';

export const RTOAssessorView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const endorsedStudents = mockStudents.filter(s => s.status === 'endorsed' || s.rtoAssignedTo);

  const handleApprove = (studentId: string) => {
    console.log('Approving student:', studentId);
    alert('Student assessment approved!');
  };

  const handleReject = (studentId: string) => {
    console.log('Rejecting student:', studentId);
    alert('Student assessment rejected with feedback.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-[#373b40] mb-2">RTO Assessment Portal</h1>
        <p className="text-gray-600">Review and assess endorsed students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Pending Review</p>
          <p className="text-3xl font-bold text-[#fdb715]">{endorsedStudents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Approved This Month</p>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Average Review Time</p>
          <p className="text-3xl font-bold text-[#373b40]">3.5d</p>
        </div>
      </div>

      {/* Endorsed Students */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#373b40]">Endorsed Students</h2>
        {endorsedStudents.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <p className="text-gray-600">No students currently endorsed for review</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {endorsedStudents.map(student => (
              <div key={student.id} className="space-y-2">
                <StudentCard 
                  student={student}
                  onClick={() => setSelectedStudent(student.id)}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(student.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ✓ Approve
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReject(student.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    ✗ Request Changes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Guidelines */}
      <div className="bg-gradient-to-r from-[#373b40] to-gray-700 p-8 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-4">Assessment Guidelines</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-[#fdb715]">•</span>
            <span>Review all submitted evidence for completeness and authenticity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#fdb715]">•</span>
            <span>Verify competency against national standards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#fdb715]">•</span>
            <span>Provide detailed feedback for any required changes</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
