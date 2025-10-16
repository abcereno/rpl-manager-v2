import React, { useState } from 'react';
import { EvidenceUpload } from './EvidenceUpload';
import { ProgressBar } from './ui/ProgressBar';
import { StatusBadge } from './ui/StatusBadge';
import { Button } from './ui/Button';

export const StudentDashboard: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    setUploadSuccess(true);
    setShowUpload(false);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const studentData = {
    name: 'James Mitchell',
    course: 'Certificate III in Carpentry',
    progress: 75,
    evidenceCount: 12,
    status: 'active' as const
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#373b40] to-gray-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592376672_6e5e9ee6.webp"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome back, {studentData.name}!
          </h1>
          <p className="text-xl text-gray-200 mb-6">{studentData.course}</p>
          <div className="max-w-md">
            <ProgressBar progress={studentData.progress} />
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
          ✓ Evidence uploaded successfully!
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Evidence</p>
          <p className="text-3xl font-bold text-[#373b40]">{studentData.evidenceCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Status</p>
          <StatusBadge status={studentData.status} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm font-medium mb-2">Progress</p>
          <p className="text-3xl font-bold text-[#fdb715]">{studentData.progress}%</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#373b40]">Upload Evidence</h2>
          {!showUpload && (
            <Button onClick={() => setShowUpload(true)}>+ New Upload</Button>
          )}
        </div>
        {showUpload ? (
          <EvidenceUpload onUpload={handleUpload} />
        ) : (
          <div className="text-center py-8">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592387812_0d38ee39.webp"
              alt="Dashboard"
              className="w-48 h-auto mx-auto mb-4 opacity-70"
            />
            <p className="text-gray-600">Click "New Upload" to add evidence</p>
          </div>
        )}
      </div>
    </div>
  );
};
