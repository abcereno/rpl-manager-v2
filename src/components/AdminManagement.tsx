// src/components/AdminManagement.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast"; // Or Sonner, depending on preference

// Define interfaces for fetched data (adjust based on actual Supabase response)
interface AssessorProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  rto_id: string | null;
  rtos: { // Assumes a join or relationship; adjust if fetched separately
    id: string;
    trading_name: string | null;
  } | null;
}

interface StudentData {
  id: string;
  qualification_id: string | null; // Assuming needed for display
  offer_id: string | null; // Assuming needed for display
  rto_id: string | null;
  profiles: { // Joined data from profiles table
      id: string;
      full_name: string | null;
      email: string | null;
  } | null;
  rtos: { // Joined data from rtos table
      id: string;
      trading_name: string | null;
  } | null;
  // Add course/qualification name if needed via joins
  course_name?: string; // Placeholder for joined qualification/offer name
}


interface Rto {
  id: string;
  trading_name: string | null;
  rto_code: string | null;
}

export const AdminManagement: React.FC = () => {
  const [assessors, setAssessors] = useState<AssessorProfile[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [rtos, setRtos] = useState<Rto[]>([]);
  const [loadingAssessors, setLoadingAssessors] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingRtos, setLoadingRtos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch RTOs
  useEffect(() => {
    const fetchRtos = async () => {
      setLoadingRtos(true);
      const { data, error } = await supabase
        .from('rtos')
        .select('id, trading_name, rto_code')
        .order('trading_name');

      if (error) {
        console.error("Error fetching RTOs:", error);
        setError("Could not load RTOs.");
        setRtos([]);
      } else {
        setRtos(data || []);
      }
      setLoadingRtos(false);
    };
    fetchRtos();
  }, []);

  // Fetch Assessors
  useEffect(() => {
    const fetchAssessors = async () => {
      setLoadingAssessors(true);
      // Join with rtos table to get the name directly
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          rto_id,
          rtos ( id, trading_name )
        `)
        .eq('role', 'rto_assessor')
        .order('full_name');

      if (error) {
        console.error("Error fetching assessors:", error);
        setError("Could not load assessors.");
        setAssessors([]);
      } else {
        setAssessors(data || []);
      }
      setLoadingAssessors(false);
    };
    fetchAssessors();
  }, []);

   // Fetch Students
   useEffect(() => {
     const fetchStudents = async () => {
       setLoadingStudents(true);
        // Join with profiles and rtos
        // Adjust the join based on your actual relationship (e.g., if you need course name)
       const { data, error } = await supabase
         .from('students')
         .select(`
           id,
           rto_id,
           qualification_id,
           offer_id,
           profiles ( id, full_name, email ),
           rtos ( id, trading_name )
           /* Add join for qualification/offer name if needed, e.g.,
           qualifications ( name ),
           offers ( name )
           */
         `)
         .order('profiles(full_name)'); // Order by student name

       if (error) {
         console.error("Error fetching students:", error);
         setError("Could not load students.");
         setStudents([]);
       } else {
         // Post-process to add course name if joined (example)
         const processedData = (data || []).map(s => ({
            ...s,
            // course_name: s.qualifications?.name || s.offers?.name || 'N/A' // Example
            course_name: 'Course Placeholder' // Replace with actual logic
         }));
         setStudents(processedData);
       }
       setLoadingStudents(false);
     };
     fetchStudents();
   }, []);

  // Handler to update Assessor's RTO
  const handleAssignAssessorRto = async (assessorId: string, newRtoId: string | null) => {
    // Find the assessor in the current state to potentially update UI optimistically
    const assessorIndex = assessors.findIndex(a => a.id === assessorId);
    if (assessorIndex === -1) return;

    // Optional: Optimistic UI Update (revert on error)
    const originalRtoId = assessors[assessorIndex].rto_id;
    const originalRto = assessors[assessorIndex].rtos;
    const selectedRto = rtos.find(r => r.id === newRtoId);
    // setAssessors(prev => prev.map(a => a.id === assessorId ? {...a, rto_id: newRtoId, rtos: selectedRto ? { id: selectedRto.id, trading_name: selectedRto.trading_name } : null } : a));


    const { error } = await supabase
      .from('profiles')
      .update({ rto_id: newRtoId }) // Use null if 'unassign' is selected
      .eq('id', assessorId);

    if (error) {
      console.error("Error updating assessor RTO:", error);
      toast({
         variant: "destructive",
         title: "Update Failed",
         description: `Could not assign RTO: ${error.message}`,
       });
      // Optional: Revert optimistic update
      // setAssessors(prev => prev.map(a => a.id === assessorId ? {...a, rto_id: originalRtoId, rtos: originalRto } : a));
      // For simplicity, refetch on error might be easier:
      // fetchAssessors(); // You'd need to extract fetchAssessors
    } else {
      toast({
         title: "Success",
         description: `Assessor assigned to ${selectedRto?.trading_name ?? 'Unassigned'}.`,
       });
      // Update state directly to reflect change without full refetch
        setAssessors(prev => prev.map(a => a.id === assessorId ? {...a, rto_id: newRtoId, rtos: selectedRto ? { id: selectedRto.id, trading_name: selectedRto.trading_name } : null } : a));

    }
  };

   // Handler to update Student's RTO
   const handleAssignStudentRto = async (studentId: string, newRtoId: string | null) => {
     const studentIndex = students.findIndex(s => s.id === studentId);
     if (studentIndex === -1) return;

     const selectedRto = rtos.find(r => r.id === newRtoId);

     const { error } = await supabase
       .from('students')
       .update({ rto_id: newRtoId })
       .eq('id', studentId);

     if (error) {
       console.error("Error updating student RTO:", error);
       toast({
          variant: "destructive",
          title: "Update Failed",
          description: `Could not assign RTO: ${error.message}`,
        });
     } else {
       toast({
          title: "Success",
          description: `Student assigned to ${selectedRto?.trading_name ?? 'Unassigned'}.`,
        });
       // Update state directly
         setStudents(prev => prev.map(s => s.id === studentId ? {...s, rto_id: newRtoId, rtos: selectedRto ? { id: selectedRto.id, trading_name: selectedRto.trading_name } : null } : s));
     }
   };


  const renderAssessorTable = () => {
    if (loadingAssessors || loadingRtos) {
      return (
         <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
         </div>
      );
    }

    if (!assessors.length) {
      return <p className="text-center text-muted-foreground py-4">No assessors found.</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Currently Assigned RTO</TableHead>
            <TableHead className="w-[250px]">Assign RTO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessors.map((assessor) => (
            <TableRow key={assessor.id}>
              <TableCell>{assessor.full_name || 'N/A'}</TableCell>
              <TableCell>{assessor.email || 'N/A'}</TableCell>
              <TableCell>{assessor.rtos?.trading_name || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
              <TableCell>
                 <Select
                    defaultValue={assessor.rto_id || 'unassign'}
                    onValueChange={(value) => handleAssignAssessorRto(assessor.id, value === 'unassign' ? null : value)}
                    disabled={loadingRtos}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select RTO..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassign">
                            <span className="text-muted-foreground italic">-- Unassign --</span>
                        </SelectItem>
                        {rtos.map((rto) => (
                        <SelectItem key={rto.id} value={rto.id}>
                            {rto.trading_name} ({rto.rto_code})
                        </SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

   const renderStudentTable = () => {
     if (loadingStudents || loadingRtos) {
       return (
          <div className="space-y-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
       );
     }

     if (!students.length) {
       return <p className="text-center text-muted-foreground py-4">No students found.</p>;
     }

     return (
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Name</TableHead>
             <TableHead>Email</TableHead>
              {/* <TableHead>Course</TableHead> */}
             <TableHead>Currently Assigned RTO</TableHead>
             <TableHead className="w-[250px]">Assign RTO</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {students.map((student) => (
             <TableRow key={student.id}>
               <TableCell>{student.profiles?.full_name || 'N/A'}</TableCell>
               <TableCell>{student.profiles?.email || 'N/A'}</TableCell>
                {/* <TableCell>{student.course_name || 'N/A'}</TableCell> */}
               <TableCell>{student.rtos?.trading_name || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
               <TableCell>
                  <Select
                     defaultValue={student.rto_id || 'unassign'}
                     onValueChange={(value) => handleAssignStudentRto(student.id, value === 'unassign' ? null : value)}
                     disabled={loadingRtos}
                     >
                     <SelectTrigger>
                         <SelectValue placeholder="Select RTO..." />
                     </SelectTrigger>
                     <SelectContent>
                         <SelectItem value="unassign">
                             <span className="text-muted-foreground italic">-- Unassign --</span>
                         </SelectItem>
                         {rtos.map((rto) => (
                         <SelectItem key={rto.id} value={rto.id}>
                             {rto.trading_name} ({rto.rto_code})
                         </SelectItem>
                         ))}
                     </SelectContent>
                  </Select>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Assign Assessors and Students to RTOs.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <Tabs defaultValue="assessors">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessors">Manage Assessors</TabsTrigger>
            <TabsTrigger value="students">Manage Students</TabsTrigger>
          </TabsList>
          <TabsContent value="assessors">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>RTO Assessor Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {renderAssessorTable()}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Student RTO Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {renderStudentTable()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// You'll need to decide where to render this component.
// For example, in AppLayout.tsx, you could add:
//
// import { AdminManagement } from './AdminManagement'; // Import the new component
//
// // Inside the renderView function or similar logic:
// case 'admin':
//   // Could show PortfolioTeamView by default and have a link/button to AdminManagement,
//   // or show AdminManagement directly or within tabs.
//   return (
//     <div className="space-y-6">
//       <PortfolioTeamView />
//       <AdminManagement /> {/* Or render conditionally based on admin action */}
//     </div>
//   );