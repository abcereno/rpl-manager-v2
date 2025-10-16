import React from 'react';
import { EvidenceStatus } from '../../types';

interface StatusBadgeProps {
  status: EvidenceStatus | 'active' | 'pending' | 'completed' | 'endorsed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'endorsed':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};
