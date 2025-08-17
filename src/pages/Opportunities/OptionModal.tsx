'use client';

import { X, Send, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- import this
// import { useEffect } from 'react';

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'direct' | 'referenced') => void;
}

const OptionModal = ({ isOpen, onClose, onSelectOption }: OptionModalProps) => {
  const navigate = useNavigate(); // <-- initialize

  if (!isOpen) return null;

  const handleDirectOpportunity = () => {
    onSelectOption('direct');
    onClose();
    navigate('/opportunities/create'); // <-- navigate to the page
  };

  const handleReferencedOpportunity = () => {
    onSelectOption('referenced');
    onClose();
    navigate('/opportunities/create'); // <-- navigate to the page
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-black">
            Create Opportunity
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-4">
          {/* Direct Opportunity */}
          <button
            onClick={handleDirectOpportunity}
            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex-shrink-0">
              <Send className="w-5 h-5 text-[#C32033] transform rotate-45" />
            </div>
            <span className="text-black font-medium group-hover:text-[#C32033] transition-colors">
              Direct Opportunity
            </span>
          </button>

          {/* Referenced Opportunity - Disabled */}
          <button
            onClick={handleReferencedOpportunity}
            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-[#C32033]" />
            </div>
            <span className="text-black font-medium group-hover:text-[#C32033] transition-colors">
              Referenced Opportunity
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
