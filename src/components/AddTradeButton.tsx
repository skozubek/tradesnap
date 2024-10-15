// File: src/components/AddTradeButton.tsx
'use client';

import React, { useState } from 'react';
import AddTradeModal from './AddTradeModal';
import { useAuth } from '@clerk/nextjs';

interface AddTradeButtonProps {
  onTradeAdded: () => Promise<void>;
}

const AddTradeButton: React.FC<AddTradeButtonProps> = ({ onTradeAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useAuth();

  const handleTradeAdded = async () => {
    setIsModalOpen(false);
    await onTradeAdded();
  };

  if (!userId) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Trade
      </button>
      {isModalOpen && (
        <AddTradeModal
          onClose={() => setIsModalOpen(false)}
          onTradeAdded={handleTradeAdded}
        />
      )}
    </>
  );
};

export default AddTradeButton;