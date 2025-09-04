import { X } from 'lucide-react';
import Loader from '../../common/Loader';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: any | null;
  loading: boolean; // 👈 new prop for loading state
}

const NotificationModal = ({
  isOpen,
  onClose,
  notification,
  loading,
}: NotificationModalProps) => {
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
        <div className="px-6 py-8 space-y-6 text-center">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : (
            <>
              {/* Title */}
              <h2 className="text-xl font-semibold text-black">
                Notification Details
              </h2>

              {notification && (
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="text-lg font-semibold text-black">
                      {notification.NOTIFICATION_TYPE}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Message
                    </h3>
                    <p className="text-md text-black">{notification.MESSAGE}</p>
                  </div>

                  {notification.DETAILS && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Details
                      </h3>
                      <p className="text-md text-black bg-gray-50 p-3 rounded-md">
                        {notification.DETAILS}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="text-md text-black">
                      {new Date(notification.CREATION_DATE).toLocaleString()}
                    </p>
                  </div>

                  {notification.RELATED_ENTITY && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Related To
                      </h3>
                      <p className="text-md text-blue-600">
                        {notification.RELATED_ENTITY}
                        {notification.RELATED_ENTITY_ID &&
                          ` #${notification.RELATED_ENTITY_ID}`}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p className="text-md text-black">
                      {notification.READ_FLAG === 'Y' ? 'Read' : 'Unread'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="flex justify-end p-6 pt-4 border-t border-stroke">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#C32033] text-white rounded-md hover:bg-[#A91B2E] transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
