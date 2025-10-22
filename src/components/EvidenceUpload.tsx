import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

export interface UploadPayload {
  file: File;
  title: string;
  description: string;
}

interface EvidenceUploadProps {
  onUpload: (payload: UploadPayload[]) => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadPayload[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newUploads: UploadPayload[] = files.map(file => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Use filename as default title without extension
      description: '',
    }));
    setSelectedFiles(prev => [...prev, ...newUploads]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesSelected(Array.from(e.target.files));
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const updateField = (index: number, field: 'title' | 'description', value: string) => {
    const newFiles = [...selectedFiles];
    newFiles[index][field] = value;
    setSelectedFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
          isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <img
          src="https://d64gsuwffb70l.cloudfront.net/68f081c79172e6f9fa43a046_1760592388533_ad2b6d7f.webp"
          alt="Upload"
          className="w-24 h-24 mx-auto mb-4 opacity-70"
        />
        <p className="text-lg font-semibold text-foreground mb-2">
          Drag & Drop Files Here
        </p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <label className="cursor-pointer">
          <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold inline-block transition-colors">
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
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-4">
            {selectedFiles.map((upload, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border relative">
                <button 
                  onClick={() => removeFile(idx)} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-3">
                    <p className="text-sm font-medium truncate flex-1">{upload.file.name}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{(upload.file.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Evidence Title"
                    value={upload.title}
                    onChange={(e) => updateField(idx, 'title', e.target.value)}
                    className="bg-white"
                  />
                  <Textarea
                    placeholder="Add a description for your evidence..."
                    value={upload.description}
                    onChange={(e) => updateField(idx, 'description', e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} className="w-full" size="lg">
            Upload {selectedFiles.length} {selectedFiles.length > 1 ? 'Items' : 'Item'}
          </Button>
        </div>
      )}
    </div>
  );
};