'use client';

import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';
import { useAdminShortcut } from '@/hooks/useAdminShortcut';

export default function AdminLoginProvider() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdminShortcut = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Set up keyboard shortcut listener
  useAdminShortcut({ onAdminShortcut: handleAdminShortcut });

  return (
    <AdminLoginModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
    />
  );
}