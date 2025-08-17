// SubmitModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount?: string;
  customerId?: string;
  OnSubmit?: () => void;
}

const SubmitModal = ({
  isOpen,
  onClose,
  totalAmount,
  customerId,
  OnSubmit,
}: SubmitModalProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!customerId) {
      alert('Customer ID is required!');
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post(
        '/api/v1/salesRequests/create-sales-request',
        {
          customer_id: customerId,
        },
      );

      if (res.status === 201) {
        setConfirmationOpen(true);
        if (OnSubmit) {
          OnSubmit();
        }
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('❌ Failed to submit order:', error);
      alert('Error occurred while submitting order.');
    } finally {
      setLoading(false);
      onClose(); // close submit modal after submit
    }
  };

  return (
    <>
      {/* Loader Overlay in center of screen */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Loader />
        </div>
      )}

      {/* Submit Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex-1 text-center">
              <h2 className="text-xl font-semibold text-black">Submit Order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Confirmation Message */}
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                Do you really want to submit this order?
              </p>
            </div>

            {/* Total Amount */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-black font-semibold">{totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-[#C32033] text-white font-medium hover:bg-[#A91B2E] transition-colors disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      />
    </>
  );
};

export default SubmitModal;
