import React, { useState } from 'react';
import { Button } from './ui/Button';

interface EvidenceUploadProps {
  onUpload: (files: File[]) => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging ? 'border-[#fdb715] bg-yellow-50' : 'border-gray-300 hover:border-[#fdb715]'
        }`}
      >
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592388533_ad2b6d7f.webp"
          alt="Upload"
          className="w-24 h-24 mx-auto mb-4 opacity-70"
        />
        <p className="text-lg font-semibold text-[#373b40] mb-2">
          Drag & Drop Files Here
        </p>
        <p className="text-sm text-gray-600 mb-4">or</p>
        <label className="cursor-pointer">
          <span className="bg-[#fdb715] hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold inline-block transition-colors">
            Browse Files
          </span>
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-[#373b40]">Selected Files ({selectedFiles.length})</h4>
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
          <Button onClick={handleUpload} className="w-full">Upload Evidence</Button>
        </div>
      )}
    </div>
  );
};
