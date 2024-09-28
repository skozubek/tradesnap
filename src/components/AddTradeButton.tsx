// File: src/components/AddTradeButton.tsx
'use client';

import React, { useState } from 'react';
import AddTradeModal from './AddTradeModal';

interface AddTradeButtonProps {
  userId: string;
  onTradeAdded: () => Promise<void>;
}

const AddTradeButton: React.FC<AddTradeButtonProps> = ({ userId, onTradeAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTradeAdded = async () => {
    setIsModalOpen(false);
    await onTradeAdded();
  };

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
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          onTradeAdded={handleTradeAdded}
        />
      )}
    </>
  );
};

export default AddTradeButton;