import React, { useState } from 'react';
import { StudentCard } from './StudentCard';
import { StudentDetailModal } from './StudentDetailModal';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Button } from './ui/Button';
import { mockStudents } from '../data/mockData';


export const PortfolioTeamView: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEndorse = (studentId: string) => {
    console.log('Endorsing student:', studentId);
    alert('Student endorsed to RTO successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-[#373b40] mb-2">Portfolio Management</h1>
        <p className="text-gray-600">Manage and track student progress</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or course..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdb715] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fdb715] focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="endorsed">Endorsed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-[#373b40]">{mockStudents.length}</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-[#fdb715]">{mockStudents.filter(s => s.status === 'active').length}</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-blue-600">{mockStudents.filter(s => s.status === 'endorsed').length}</p>
          <p className="text-sm text-gray-600">Endorsed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-green-600">{mockStudents.filter(s => s.status === 'completed').length}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Student List */}
      <div className="space-y-4">

        <h2 className="text-xl font-bold text-[#373b40]">Students ({filteredStudents.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredStudents.map(student => (
            <div key={student.id} className="relative">
              <StudentCard 
                student={student}
                onClick={() => setSelectedStudent(student.id)}
                showAssignment
              />
              {student.status === 'active' && student.progress >= 70 && (
                <div className="mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleEndorse(student.id)}
                    className="w-full"
                  >
                    Endorse to RTO
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <StudentDetailModal 
        student={mockStudents.find(s => s.id === selectedStudent) || null}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEndorse={handleEndorse}
        showEndorseButton
      />
    </div>
  );
};
