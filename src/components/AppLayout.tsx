import React, { useState } from 'react';
import { Header } from './Header';
import { StudentDashboard } from './StudentDashboard';
import { PortfolioTeamView } from './PortfolioTeamView';
import { RTOAssessorView } from './RTOAssessorView';
import { UserRole } from '../types';

export default function AppLayout() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  const renderView = () => {
    switch (currentRole) {
      case 'student':
        return <StudentDashboard />;
      case 'portfolio_team':
        return <PortfolioTeamView />;
      case 'rto_assessor':
        return <RTOAssessorView />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        userName="Demo User"
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#373b40] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/689aae299653328b557d3d11_1760592055872_ea362fa3.png"
                alt="Trade Certify"
                className="h-10 mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 text-sm">
                Streamlining Recognition of Prior Learning for the trades industry
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">For Students</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">For Portfolio Teams</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">For RTOs</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#fdb715] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Trade Certify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
