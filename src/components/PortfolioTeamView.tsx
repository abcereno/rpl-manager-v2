// src/components/PortfolioTeamView.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Student } from '@/types';
import { StudentCard } from './StudentCard';
import { StudentDetailModal } from './StudentDetailModal';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Skeleton } from './ui/skeleton';
import { toast } from './ui/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Modal } from './ui/Modal';
import { AddStudentForm } from './AddStudentForm';
import { PlusCircle } from 'lucide-react';

interface RawFetchedStudentData {
  id: string;
  progress: number | null;
  status: string | null;
  evidence_count: number | null;
  enrolled_date: string | null;
  company_id: string | null;
  created_at?: string | null;
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
  assigned_admin: {
    full_name: string | null;
  } | null;
  offer: {
    id: string;
    qualification: {
      code: string | null;
      name: string | null;
    } | null;
  } | null;
}

const ITEMS_PER_PAGE = 6;

// Fetch students with pagination + filters
const fetchStudents = async (page: number, searchTerm: string, filterStatus: string) => {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // --- VALID select (no comments), explicit FK hints, inner join only where needed ---
  let query = supabase
    .from('students')
    .select(`
      id,
      progress,
      status,
      evidence_count,
      enrolled_date,
      company_id,
      created_at,
      profile:profiles!students_profile_id_fkey (
        id, full_name, email, avatar_url
      ),
      assigned_admin:profiles!students_assigned_admin_id_fkey (
        full_name
      ),
      offer:offers!inner (
        id,
        qualification:qualifications!offers_qualification_id_fkey ( code, name )
      )
    `, { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  if (searchTerm?.trim()) {
    const term = searchTerm.trim();
    // OR across related fields is supported via dot-notation
    query = query.or(
      `profile.full_name.ilike.%${term}%,offer.qualification.name.ilike.%${term}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching students:", error);
    throw new Error(`Could not fetch students: ${error.message}`);
  }

  const rawData = (data as unknown as RawFetchedStudentData[]) || [];

  const transformedData: Student[] = rawData.map(s => ({
    id: s.id,
    name: s.profile?.full_name || 'N/A',
    email: s.profile?.email || 'N/A',
    avatar: s.profile?.avatar_url || '/placeholder.svg',
    course: s.offer?.qualification?.name || 'N/A',
    enrolledDate: new Date(s.enrolled_date || Date.now()),
    progress: s.progress || 0,
    status: (s.status ?? 'pending') as Student['status'],
    evidenceCount: s.evidence_count || 0,
    assignedTo: s.assigned_admin?.full_name || 'Unassigned',
    rtoAssignedTo: 'N/A',
    companyId: s.company_id || undefined,
    qualifications: [],
  }));

  return { students: transformedData, count: count ?? 0 };
};

// Update student status (Endorse)
const endorseStudent = async (studentId: string) => {
  const { data, error } = await supabase
    .from('students')
    .update({ status: 'endorsed' })
    .eq('id', studentId)
    .select()
    .single();

  if (error) {
    console.error("Error endorsing student:", error);
    throw new Error(`Could not endorse student: ${error.message}`);
  }
  return data;
}

export const PortfolioTeamView: React.FC = () => {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleStudentAdded = () => {
    setIsAddStudentModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['students', currentPage, searchTerm, filterStatus],
    queryFn: () => fetchStudents(currentPage, searchTerm, filterStatus),
  });

  const students = data?.students ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const endorseMutation = useMutation({
    mutationFn: endorseStudent,
    onSuccess: () => {
      toast({ title: "Success", description: "Student endorsed to RTO successfully!" });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Endorsement Failed", description: (err as Error).message });
    },
  });

  const handleEndorse = (studentId: string) => {
    endorseMutation.mutate(studentId);
  };

  const selectedStudentData = useMemo(
    () => students.find(s => s.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(newPage);
  };

  // --- Simple stat placeholders (wire up real counts later) ---
  const totalStudents = totalCount;
  const activeStudents = '...';
  const endorsedStudents = '...';
  const completedStudents = '...';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#373b40] mb-2">Portfolio Management</h1>
          <p className="text-gray-600">Manage and track student progress</p>
        </div>
        <Button onClick={() => setIsAddStudentModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Invite Student
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search-students" className="mb-2 block">Search Students</Label>
            <Input
              id="search-students"
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name or course..."
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="filter-status" className="mb-2 block">Filter by Status</Label>
            <Select
              value={filterStatus}
              onValueChange={(value) => { setFilterStatus(value); setCurrentPage(1); }}
            >
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="endorsed">Endorsed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-[#373b40]">
            {isLoading ? <Skeleton className="h-8 w-1/2 mx-auto" /> : totalStudents}
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-[#fdb715]">
            {isLoading ? <Skeleton className="h-8 w-1/2 mx-auto" /> : activeStudents}
          </div>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">
            {isLoading ? <Skeleton className="h-8 w-1/2 mx-auto" /> : endorsedStudents}
          </div>
          <p className="text-sm text-gray-600">Endorsed</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {isLoading ? <Skeleton className="h-8 w-1/2 mx-auto" /> : completedStudents}
          </div>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Student List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#373b40]">
            Students ({isLoading ? 'Loading...' : totalCount})
          </h2>
          <Link to="/admin/students">
            <Button variant="outline" size="sm">View All Students</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        )}
        {error && <p className="text-red-600 text-center py-4">Error loading students: {(error as Error).message}</p>}

        {!isLoading && !error && students.length === 0 && (
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <p className="text-gray-600">No students found matching your criteria.</p>
          </div>
        )}

        {!isLoading && !error && students.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students.map(student => (
              <div key={student.id} className="relative">
                <StudentCard
                  student={student}
                  onClick={() => setSelectedStudentId(student.id)}
                  showAssignment
                />
                {student.status === 'active' && student.progress >= 70 && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEndorse(student.id);
                      }}
                      className="w-full"
                      disabled={endorseMutation.isPending && (endorseMutation.variables as string) === student.id}
                    >
                      {(endorseMutation.isPending && (endorseMutation.variables as string) === student.id)
                        ? 'Endorsing...'
                        : 'Endorse to RTO'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {(() => {
              const pageNumbers = [];
              const maxPagesToShow = 5;
              const halfMaxPages = Math.floor(maxPagesToShow / 2);
              let startPage = Math.max(1, currentPage - halfMaxPages);
              let endPage = Math.min(totalPages, currentPage + halfMaxPages);
              if (currentPage <= halfMaxPages) endPage = Math.min(totalPages, maxPagesToShow);
              if (currentPage + halfMaxPages >= totalPages) startPage = Math.max(1, totalPages - maxPagesToShow + 1);

              if (startPage > 1) {
                pageNumbers.push(
                  <PaginationItem key={1}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>1</PaginationLink>
                  </PaginationItem>
                );
                if (startPage > 2) {
                  pageNumbers.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
                }
              }
              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                  <PaginationItem key={i}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>{i}</PaginationLink>
                  </PaginationItem>
                );
              }
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pageNumbers.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
                }
                pageNumbers.push(
                  <PaginationItem key={totalPages}>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
                  </PaginationItem>
                );
              }
              return pageNumbers;
            })()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudentData}
        isOpen={!!selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
        onEndorse={(id) => {
          handleEndorse(id);
          setSelectedStudentId(null);
        }}
        showEndorseButton
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title=""
        size="md"
      >
        <AddStudentForm
          onCancel={() => setIsAddStudentModalOpen(false)}
          onSuccess={handleStudentAdded}
        />
      </Modal>
    </div>
  );
};
