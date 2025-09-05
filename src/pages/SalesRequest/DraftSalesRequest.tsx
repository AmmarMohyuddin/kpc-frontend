import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  ChevronRight as CrRight,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DeleteModal from './DeleteModal';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SalesRequest {
  APPROVAL_STATUS: string;
  CUSTOMER_NAME: string;
  ORDER_HEADER_ID: string;
  ORDER_NUMBER: string;
  ORDER_DATE: string;
  SALESPERSON: string;
  TOTAL_AMOUNT: number | string;
  CUSTOMER_ID: string;
}

interface PaginationInfo {
  limit: number;
  offset: number;
  hasMore: boolean;
  count: number;
}

interface ApiResponse {
  orders: SalesRequest[];
  pagination: PaginationInfo;
}

// Filter Modal Props Interface
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onApply: () => void;
}

// Filter Modal Component
const FilterModal = ({
  isOpen,
  onClose,
  selectedFilter,
  onFilterChange,
  onApply,
}: FilterModalProps) => {
  if (!isOpen) return null;

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
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-black">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#c32033]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Radio buttons */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="customerName"
              checked={selectedFilter === 'customerName'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'customerName'
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Customer Name
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="orderNumber"
              checked={selectedFilter === 'orderNumber'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'orderNumber'
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Order Number
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#c32033] text-[#c32033] font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="px-6 py-2 bg-[#c32033] text-white font-semibold rounded-md hover:bg-[#a91b2e] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const ITEMS_PER_PAGE = 7;

const DraftSalesRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    order_header_id: string;
  } | null>(null);
  const [salesRequests, setSalesRequests] = useState<SalesRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Filter modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('orderNumber');

  useEffect(() => {
    fetchDraftSalesRequest(currentPage);
  }, [currentPage]);

  const fetchDraftSalesRequest = async (page: number) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const response = await apiService.get(
        `/api/v1/salesRequests/draft-sales-request`,
        {
          limit: ITEMS_PER_PAGE,
          offset: offset,
        },
      );

      if (response?.status === 200) {
        const data: ApiResponse = response.data;
        setSalesRequests(data.orders || []);
        setPagination(data.pagination);

        // Estimate total items based on current page and hasMore flag
        if (data.pagination.hasMore) {
          setTotalItems(page * ITEMS_PER_PAGE + 1);
        } else {
          setTotalItems(data.pagination.offset + data.orders.length);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching draft sales requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemDeleted = (updatedItems: SalesRequest[]) => {
    setSalesRequests(updatedItems);
    setCurrentPage(1);
    fetchDraftSalesRequest(1); // Refresh the data after deletion
  };

  // Filter items based on selected filter (client-side filtering for search)
  const filteredItems = salesRequests.filter((request) => {
    if (selectedFilter === 'customerName') {
      return String(request.CUSTOMER_NAME || '')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
    } else if (selectedFilter === 'orderNumber') {
      return String(request.ORDER_NUMBER || '')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
    }
    return true;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages based on whether there are more items
  const totalPages = pagination?.hasMore
    ? currentPage + 1 // If there are more items, show at least one more page
    : currentPage; // If no more items, current page is the last page

  const breadcrumbs = [
    { label: 'Draft Sales Requests', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemName="item"
        orderHeaderId={selectedItem?.order_header_id}
        onItemDeleted={handleItemDeleted}
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Draft Sales Request
            </h1>
          </div>

          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
            <div className="flex items-center gap-2 text-md text-gray-600">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <CrRight className="w-4 h-4 mx-2" />}
                  <span className={crumb.isActive ? 'text-[#C32033]' : ''}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </div>

            {/* <div className="text-md text-gray-700">
              Total Sales Request:{' '}
              <span className="font-semibold text-[#C32033]">
                {pagination?.hasMore ? `${totalItems}+` : totalItems}
              </span>
            </div> */}

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search by ${
                    selectedFilter === 'customerName'
                      ? 'Customer Name'
                      : 'Order Number'
                  }...`}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <SlidersHorizontal />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-5">
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] shadow-lg text-white">
                  <th className="px-6 py-4 text-left">No.</th>
                  <th className="px-6 py-4 text-left">Order Number</th>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Total Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((request, index) => (
                    <tr
                      key={`${request.ORDER_NUMBER}-${pagination?.offset}-${index}`}
                      className={`hover:bg-[#f1f1f1] shadow-lg bg-red-100 border-b-2 text-[#1e1e1e] border-b-[#eeeaea] transition-colors`}
                    >
                      <td className="px-6 py-4">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        {index}
                      </td>
                      <td className="px-6 py-4">
                        {request.ORDER_NUMBER || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.CUSTOMER_NAME || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.ORDER_DATE
                          ? new Date(request.ORDER_DATE).toLocaleDateString(
                              'en-GB',
                            )
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {Number(request.TOTAL_AMOUNT || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {request.APPROVAL_STATUS ? (
                          <span
                            className={`inline-flex rounded-full py-1 px-3 text-sm font-medium
        ${
          request.APPROVAL_STATUS === 'Pending'
            ? 'bg-warning bg-opacity-10 text-warning'
            : request.APPROVAL_STATUS === 'Active'
            ? 'bg-success bg-opacity-10 text-success'
            : 'bg-gray-200 text-gray-700'
        }`}
                          >
                            {request.APPROVAL_STATUS}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedItem({
                                order_header_id: request.ORDER_HEADER_ID,
                              });
                              setIsModalOpen(true);
                            }}
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="text-[#C32033] hover:text-red-800 w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/sales-request/edit/${request.ORDER_HEADER_ID}`,
                                {
                                  state: {
                                    order_header_id: request.ORDER_HEADER_ID,
                                  },
                                },
                              )
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/sales-request/details/${request.ORDER_HEADER_ID}`,
                                {
                                  state: {
                                    order_header_id: request.ORDER_HEADER_ID,
                                  },
                                },
                              )
                            }
                            className="px-4 py-2 border-2 border-[#C32033] text-[#C32033] rounded-lg font-medium hover:bg-[#C32033] hover:text-white transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? 'No matching items found'
                        : 'No Draft Orders found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(totalPages > 1 || pagination?.hasMore) && (
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {/* Show page numbers - we don't know exact total pages, so show current and next if hasMore */}
              <button
                onClick={() => handlePageChange(currentPage)}
                className={`px-3 py-2 rounded font-medium transition-colors ${'bg-[#C32033] text-white'}`}
              >
                {currentPage}
              </button>

              {pagination?.hasMore && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-2 rounded font-medium transition-colors text-gray-600 hover:bg-gray-100"
                >
                  {currentPage + 1}
                </button>
              )}

              {pagination?.hasMore && currentPage + 1 < totalPages && (
                <span className="px-2 text-gray-600">...</span>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination?.hasMore}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onApply={() => {
          setSearchTerm('');
          setCurrentPage(1);
        }}
      />
    </>
  );
};

export default DraftSalesRequest;
