import { X, Send, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'direct' | 'referenced') => void;
}

const NotificationModal = ({
  isOpen,
  onClose,
  onSelectOption,
}: OptionModalProps) => {
  const navigate = useNavigate(); // <-- initialize

  if (!isOpen) return null;

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
            Notification Detail
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-4"></div>
      </div>
    </div>
  );
};

export default NotificationModal;
