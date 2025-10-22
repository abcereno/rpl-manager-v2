import React, { useState } from 'react';
import { EvidenceUpload, UploadPayload } from '@/components/EvidenceUpload';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStudents, mockEvidence } from '@/data/mockData';
import { Evidence, Unit, Qualification, Comment } from '@/types';
import { FileText, Camera, Video, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { UnitCommentsModal } from './UnitCommentsModal';


// Helper component to render an icon based on file type
const EvidenceIcon = ({ fileType }: { fileType: Evidence['fileType'] }) => {
  switch (fileType) {
    case 'document':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'photo':
      return <Camera className="h-5 w-5 text-green-500" />;
    case 'video':
      return <Video className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

// Helper component to render an icon based on evidence status
const StatusIcon = ({ status }: { status: Evidence['status'] }) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'rejected':
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    case 'pending':
    case 'under_review':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

// Component to list evidence for a specific unit
const EvidenceList = ({ unitId }: { unitId: string }) => {
  const evidences = mockEvidence.filter(ev => ev.unitId === unitId);

  if (evidences.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-4">No evidence uploaded for this unit yet.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
      <h4 className="font-semibold text-gray-700">Submitted Evidence:</h4>
      <ul className="space-y-2">
        {evidences.map(evidence => (
          <li key={evidence.id}>
             <Collapsible>
                <CollapsibleTrigger asChild>
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors w-full cursor-pointer 
                        ${evidence.status === 'rejected' ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <EvidenceIcon fileType={evidence.fileType} />
                            <div>
                                <p className="font-medium text-gray-800">{evidence.title}</p>
                                <p className="text-xs text-gray-500">{evidence.uploadedAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {evidence.comments && evidence.comments.length > 0 && <MessageSquare className="h-4 w-4 text-gray-500" />}
                            <StatusIcon status={evidence.status} />
                            <Badge
                                variant={
                                evidence.status === 'approved' ? 'success' :
                                evidence.status === 'rejected' ? 'destructive' :
                                evidence.status === 'under_review' ? 'warning' :
                                'secondary'
                                }
                                className="capitalize hidden sm:inline-flex"
                            >
                                {evidence.status.replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="p-4 bg-white border border-t-0 rounded-b-lg">
                        <p className="text-sm text-gray-600 mb-4 italic">"{evidence.description}"</p>
                        {evidence.comments && evidence.comments.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="font-semibold text-sm">Feedback:</h5>
                                {evidence.comments.map(comment => (
                                    <div key={comment.id} className={`p-3 rounded-lg ${evidence.status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-gray-100 border border-gray-200'}`}>
                                        <div className="flex items-start gap-3">
                                            {comment.authorAvatar && <img src={comment.authorAvatar} alt={comment.author} className="h-8 w-8 rounded-full" />}
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                                                <p className="text-xs text-gray-500 mb-1">{comment.createdAt.toLocaleString()}</p>
                                                <p className="text-sm text-gray-700">{comment.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
    </div>
  );
};

// The main Student Dashboard component
export const StudentDashboard: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [viewingCommentsForUnit, setViewingCommentsForUnit] = useState<Unit | null>(null);


  const handleUpload = (payload: UploadPayload[]) => {
    console.log(`Uploading ${payload.length} files for unit ${activeUnit}:`, payload);
    setUploadSuccess(true);
    setActiveUnit(null); // Close accordion on upload
    setTimeout(() => setUploadSuccess(false), 5000); // Hide message after 5 seconds
  };
  
  const handleViewComments = (e: React.MouseEvent | React.KeyboardEvent, unit: Unit) => {
    e.stopPropagation(); // Prevent the accordion from toggling
    setViewingCommentsForUnit(unit);
  };

  const studentData = mockStudents[0];

  const allCommentsForUnit = viewingCommentsForUnit
    ? mockEvidence
        .filter(e => e.unitId === viewingCommentsForUnit.id && e.comments)
        .flatMap(e => e.comments as Comment[])
    : [];

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-6">
         <img src={studentData.avatar} alt={studentData.name} className="w-24 h-24 rounded-full border-4 border-primary shadow-md" />
         <div>
            <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
                {studentData.name}
            </h1>
            <p className="text-md text-gray-500 text-center sm:text-left">{studentData.email}</p>
         </div>
      </div>

      {/* Upload Success Banner */}
      {uploadSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md" role="alert">
          <p className="font-bold">Success!</p>
          <p>Your evidence has been uploaded successfully and is now pending review.</p>
        </div>
      )}

      {/* Qualifications Tabs */}
      <Tabs defaultValue={studentData.qualifications[0]?.id} className="w-full">
        <TabsList className={`grid w-full grid-cols-${studentData.qualifications.length > 1 ? studentData.qualifications.length : 1}`}>
            {studentData.qualifications.map(qual => (
                <TabsTrigger key={qual.id} value={qual.id}>{qual.name}</TabsTrigger>
            ))}
        </TabsList>
        
        {studentData.qualifications.map(qualification => (
            <TabsContent key={qualification.id} value={qualification.id}>
                <div className="mt-6 space-y-6">
                    {/* Qualification Progress */}
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-[#373b40]">{qualification.code}</h2>
                             <span className="text-lg font-bold text-primary">{qualification.progress}%</span>
                        </div>
                        <ProgressBar progress={qualification.progress} showLabel={false} />
                    </div>

                    {/* Units of Competency Accordion */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">
                        <h2 className="text-2xl font-bold text-[#373b40] mb-6">Units of Competency</h2>
                        <Accordion type="single" collapsible className="w-full" onValueChange={setActiveUnit} value={activeUnit ?? ""}>
                        {qualification.units.map((unit: Unit) => (
                            <AccordionItem value={unit.id} key={unit.id}>
                                <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg transition-colors">
                                    <div className="flex items-center gap-4 text-left flex-1">
                                        <div className="flex-grow">
                                            <p className="font-bold text-md text-[#373b40]">{unit.code}</p>
                                            <p className="text-sm text-gray-600">{unit.name}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => handleViewComments(e, unit)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewComments(e, unit); }}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary hover:bg-primary/10 h-8 px-2"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Feedback
                                        </div>
                                        <Badge variant="outline">{mockEvidence.filter(e => e.unitId === unit.id).length} Evidence</Badge>
                                    </div>
                                </AccordionTrigger>
                            <AccordionContent className="px-4 pt-4 pb-6 bg-gray-50 border-t">
                                <p className="text-sm text-gray-600 mb-6">{unit.description}</p>
                                <EvidenceList unitId={unit.id} />
                                <div className="mt-6 border-t pt-6">
                                <h4 className="font-semibold text-gray-700 mb-4">Upload New Evidence for {unit.code}</h4>
                                <EvidenceUpload onUpload={handleUpload} />
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </div>
                </div>
            </TabsContent>
        ))}
      </Tabs>
      
      <UnitCommentsModal
        unit={viewingCommentsForUnit}
        comments={allCommentsForUnit}
        isOpen={!!viewingCommentsForUnit}
        onClose={() => setViewingCommentsForUnit(null)}
      />
    </div>
  );
};