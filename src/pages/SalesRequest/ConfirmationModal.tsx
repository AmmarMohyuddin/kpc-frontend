import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confirmationImage from '../../images/confirmation.png';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onDismiss?: () => void;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  title = 'Order Submitted Successfully!',
  message,
  onDismiss,
}: ConfirmationModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
    onClose();

    // Navigate to sales-request/manage after dismiss
    navigate('/sales-request/manage');
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
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <img src={confirmationImage} alt="Confirmation" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-black">{title}</h2>
            {message && <p className="text-gray-600 text-sm">{message}</p>}
          </div>

          {/* Dismiss Button */}
          <div className="pt-4">
            <button
              onClick={handleDismiss}
              className="px-8 py-3 rounded-lg bg-[#C32033] text-white font-medium hover:bg-[#A91B2E] transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
