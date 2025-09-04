import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import apiService from '../services/ApiService';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface Notification {
  NID: number;
  NOTIFICATION_TYPE: string;
  OBJECT_NAME?: string;
  MESSAGE: string;
  CREATION_DATE: string;
  READ_FLAG: string;
  DETAILS?: string;
  RELATED_ENTITY?: string;
  RELATED_ENTITY_ID?: number;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

const NotificationModal = ({
  isOpen,
  onClose,
  notification,
}: NotificationModalProps) => {
  if (!isOpen || !notification) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-stroke">
          <h2 className="text-xl font-semibold text-black">
            Notification Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#c32033]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Type */}
          <div>
            <h3 className="text-md font-medium text-gray-500">Type</h3>
            <p className="text-lg font-semibold text-black">
              {notification.NOTIFICATION_TYPE}
            </p>
          </div>

          {/* Object Name */}
          {notification.OBJECT_NAME && (
            <div>
              <h3 className="text-md font-medium text-gray-500">Object Name</h3>
              <p className="text-lg text-black">{notification.OBJECT_NAME}</p>
            </div>
          )}

          {/* Message */}
          <div>
            <h3 className="text-md font-medium text-gray-500">Message</h3>
            <p className="text-lg text-black">{notification.MESSAGE}</p>
          </div>

          {/* Date */}
          <div>
            <h3 className="text-md font-medium text-gray-500">Date</h3>
            <p className="text-lg text-black">
              {new Date(notification.CREATION_DATE).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await apiService.get(
        '/api/v1/notifications/listNotifications',
        {},
      );
      setNotifications(res.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // ESC key to close dropdown and modal
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (keyCode !== 27) return;
      if (isModalOpen) setIsModalOpen(false);
      else if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // Handle clicking a notification (update flag + open modal instantly)
  const handleNotificationClick = (notification: Notification) => {
    // Open modal instantly
    setSelectedNotification(notification);
    setIsModalOpen(true);
    setDropdownOpen(false);

    // If unread, mark as read in background
    if (notification.READ_FLAG === '') {
      apiService
        .post('/api/v1/notifications/updateNotification', {
          NID: notification.NID,
        })
        .then((response) => {
          if (response?.status === 200) {
            setNotifications((prev) =>
              prev.map((n) =>
                n.NID === notification.NID ? { ...n, READ_FLAG: 'Y' } : n,
              ),
            );
            // update local copy for modal
            setSelectedNotification((prev) =>
              prev ? { ...prev, READ_FLAG: 'Y' } : prev,
            );
          }
        })
        .catch((error) => {
          console.error(
            'Error updating notification:',
            error?.response?.data?.message || error,
          );
        });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <>
      <li className="relative">
        {/* Trigger */}
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <svg
            className="fill-current text-[#C32033] duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z" />
          </svg>
        </Link>

        {/* Dropdown */}
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
            dropdownOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="px-4.5 py-3 border-b border-stroke">
            <h5 className="text-sm font-medium text-bodydark2">
              All Notifications
            </h5>
          </div>

          <ul className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.NID}>
                  <button
                    className={`w-full text-left flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 cursor-pointer hover:bg-gray-50`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p className="text-sm">
                      <span
                        className={`font-semibold ${
                          notification.READ_FLAG === ''
                            ? 'text-[#C32033]'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {notification.NOTIFICATION_TYPE}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.MESSAGE}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        notification.CREATION_DATE,
                      ).toLocaleDateString()}
                    </p>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4.5 py-3 text-sm text-gray-500">
                No notifications
              </li>
            )}
          </ul>
        </div>
      </li>

      {/* Modal */}
      <NotificationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        notification={selectedNotification}
      />
    </>
  );
};

export default DropdownNotification;
