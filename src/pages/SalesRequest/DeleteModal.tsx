import { X } from 'lucide-react';
import apiService from '../../services/ApiService';
import toast from 'react-hot-toast';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName?: string;
  itemNumber?: string;
  customerId?: string;
  onItemDeleted: (updatedItems: any[]) => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  itemName = 'item',
  itemNumber,
  customerId,
  onItemDeleted,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (!itemNumber || !customerId) {
      console.error('Item number and customer ID are required for deletion');
      return;
    }

    try {
      const response = await apiService.post(
        `/api/v1/salesRequests/item-delete`,
        {
          item_number: itemNumber,
          customer_id: customerId,
        },
      );

      if (response?.status === 200) {
        toast.success('Item Deleted!');
        onItemDeleted(response.data || []);
        onClose();
      } else {
        console.error('Failed to delete item:', response);
        toast.error('Failed to delete item.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item.');
    }
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
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-black">Delete Item!</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Do you really want to delete this {itemName}?
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 rounded-lg bg-[#C32033] text-white font-medium hover:bg-[#A91B2E] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
