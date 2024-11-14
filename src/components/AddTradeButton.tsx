// src/components/AddTradeButton.tsx
'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface AddTradeButtonProps {
  onClick: () => void;
}

const AddTradeButton: React.FC<AddTradeButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="bg-green-600 hover:bg-green-700"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Trade
    </Button>
  );
};

export default AddTradeButton;