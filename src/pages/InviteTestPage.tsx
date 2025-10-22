// src/pages/InviteTestPage.tsx
import React from 'react';
import { UserInviteForm } from '@/components/UserInviteForm';

const InviteTestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
       {/* You can add a wrapper or header if needed, but for simplicity, just the form */}
       <UserInviteForm />
    </div>
  );
};

export default InviteTestPage;