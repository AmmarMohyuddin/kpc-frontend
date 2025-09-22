import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronRight as CrRight,
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
  CUSTOMER_ACCOUNT_NUMBER: string;
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
}

interface ApiResponse {
  orders: SalesRequest[];
  pagination: PaginationInfo;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onApply: () => void;
}

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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-black">Filters</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#c32033]" />
          </button>
        </div>
        <div className="p-6 space-y-4">
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
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="accountNumber"
              checked={selectedFilter === 'accountNumber'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'accountNumber'
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Account Number
            </span>
          </label>
        </div>
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

const ITEMS_PER_PAGE = 10;
let debounceTimer: NodeJS.Timeout;

const ManageSalesRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [salesRequests, setSalesRequests] = useState<SalesRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item_number: string;
    customer_id: string;
  } | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('orderNumber');

  useEffect(() => {
    fetchSalesRequests(currentPage, searchTerm);
  }, [currentPage]);

  const fetchSalesRequests = async (
    page: number,
    query: string = '',
    filter: string = selectedFilter,
  ) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const params: Record<string, any> = {};

      if (query) {
        if (filter === 'customerName') params.CUSTOMER_NAME = query;
        else if (filter === 'orderNumber') params.ORDER_NUMBER = query;
        else if (filter === 'accountNumber')
          params.CUSTOMER_ACCOUNT_NUMBER = query;
      } else {
        params.limit = ITEMS_PER_PAGE;
        params.offset = offset;
      }

      const response = await apiService.get(
        '/api/v1/salesRequests/list-sales-request',
        params,
      );

      if (response?.status === 200) {
        const data: ApiResponse = response.data;
        setSalesRequests(data.orders || []);
        setPagination(data.pagination);

        if (data.pagination?.hasMore) {
          setTotalItems(page * ITEMS_PER_PAGE + 1);
        } else {
          setTotalItems(data.pagination.offset + data.orders.length);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching sales requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchSalesRequests(1, value);
    }, 600);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const totalPages = pagination?.hasMore ? currentPage + 1 : currentPage;

  const breadcrumbs = [
    { label: 'Sales Requests', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemName="item"
        itemNumber={selectedItem?.item_number}
        customerId={selectedItem?.customer_id}
        onItemDeleted={(updatedItems) => {
          setSalesRequests(updatedItems);
          setCurrentPage(1);
        }}
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Sales Requests
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

            {/* Search + Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search by ${
                    selectedFilter === 'customerName'
                      ? 'Customer Name'
                      : selectedFilter === 'accountNumber'
                      ? 'Account Number'
                      : 'Order Number'
                  }...`}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
            <table className="lead-table">
              <thead>
                <tr className="bg-[#C32033] shadow-lg text-white">
                  <th className="px-6 py-4 text-left">No.</th>
                  <th className="px-6 py-4 text-left">Order Number</th>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Account Number</th>
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Total Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={7}>
                    <div className="flex justify-center items-center h-[200px]">
                      <Loader />
                    </div>
                  </td>
                ) : salesRequests.length > 0 ? (
                  salesRequests.map((request, index) => (
                    <tr
                      key={`${request.ORDER_NUMBER}-${pagination?.offset}-${index}`}
                      className={`lead-row ${
                        index % 2 === 0 ? 'lead-row-even' : 'lead-row-odd'
                      }`}
                    >
                      <td className="px-6 py-4">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        {request.ORDER_NUMBER || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.CUSTOMER_NAME || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.CUSTOMER_ACCOUNT_NUMBER || '-'}
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
                            className="btn-view-details"
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
                        : 'No items found'}
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

              <button
                onClick={() => handlePageChange(currentPage)}
                className="px-3 py-2 rounded font-medium transition-colors bg-[#C32033] text-white"
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
          setCurrentPage(1);
          setSearchTerm('');
          fetchSalesRequests(1, '', selectedFilter);
        }}
      />
    </>
  );
};

export default ManageSalesRequest;
