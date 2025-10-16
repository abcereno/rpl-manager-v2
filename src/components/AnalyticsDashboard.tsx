import React from 'react';
import { mockStudents } from '../data/mockData';

export const AnalyticsDashboard: React.FC = () => {
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const endorsedStudents = mockStudents.filter(s => s.status === 'endorsed').length;
  const completedStudents = mockStudents.filter(s => s.status === 'completed').length;
  const avgProgress = Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents);
  const totalEvidence = mockStudents.reduce((sum, s) => sum + s.evidenceCount, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <h3 className="text-xl font-bold text-[#373b40]">Analytics Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#fdb715] to-yellow-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Avg Progress</p>
          <p className="text-3xl font-bold">{avgProgress}%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Evidence</p>
          <p className="text-3xl font-bold">{totalEvidence}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <p className="text-sm opacity-90">Completion Rate</p>
          <p className="text-3xl font-bold">{Math.round((completedStudents / totalStudents) * 100)}%</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-[#373b40] mb-3">Status Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#fdb715]"
                  style={{ width: `${(activeStudents / totalStudents) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8">{activeStudents}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Endorsed</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${(endorsedStudents / totalStudents) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8">{endorsedStudents}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(completedStudents / totalStudents) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8">{completedStudents}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
