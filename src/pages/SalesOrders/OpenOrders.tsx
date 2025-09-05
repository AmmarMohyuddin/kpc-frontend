import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronRight as CrRight,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SalesOrder {
  order_no: string;
  customer_name: string;
  salesperson: string;
  price: number | string;
  account_number?: string;
}

interface OriginalOrder {
  order_no: string;
  lines: any[];
}

interface PaginationInfo {
  limit: number;
  offset: number;
  hasMore: boolean;
  count: number;
}

interface ApiResponse {
  orders: OriginalOrder[];
  pagination: PaginationInfo;
}

// Filter Modal Props
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
            aria-label="Close filter modal"
          >
            <X className="w-5 h-5 text-[#c32033]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {['customerName', 'orderNumber', 'accountNumber'].map((filter) => (
            <label
              key={filter}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="filterOption"
                value={filter}
                checked={selectedFilter === filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-5 h-5 accent-[#c32033]"
              />
              <span
                className={`${
                  selectedFilter === filter
                    ? 'font-bold text-black'
                    : 'font-medium text-gray-700'
                }`}
              >
                {filter === 'customerName'
                  ? 'Customer Name'
                  : filter === 'orderNumber'
                  ? 'Order Number'
                  : 'Account Number'}
              </span>
            </label>
          ))}
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

const OpenOrders = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [originalOrders, setOriginalOrders] = useState<OriginalOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('customerName');

  useEffect(() => {
    fetchOpenOrders(currentPage);
  }, [currentPage]);

  const fetchOpenOrders = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const response = await apiService.get(`/api/v1/salesOrders/open-orders`, {
        limit: ITEMS_PER_PAGE,
        offset,
      });

      if (response?.status === 200) {
        const data: ApiResponse = response.data;
        setOriginalOrders(data.orders || []);

        const formatted: SalesOrder[] = data.orders.map((order: any) => ({
          order_no: String(order.order_no || '-'),
          customer_name: String(order.lines?.[0]?.CUSTOMER_NAME || '-'),
          salesperson: String(order.lines?.[0]?.SALESPERSON_NAME || '-'),
          account_number: String(order.lines?.[0]?.ACCOUNT_NUMBER || '-'),
          price: order.lines?.[0]?.UNIT_LIST_PRICE || 0,
        }));

        setSalesOrders(formatted);
        setPagination(data.pagination);

        if (data.pagination.hasMore) {
          setTotalItems(page * ITEMS_PER_PAGE + 1);
        } else {
          setTotalItems(data.pagination.offset + data.orders.length);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (orderNo: string) => {
    const originalOrder = originalOrders.find(
      (order) => order.order_no === orderNo,
    );
    navigate(`/sales-orders/open/${orderNo}`, {
      state: { order: originalOrder || null },
    });
  };

  const filteredItems = salesOrders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    if (selectedFilter === 'customerName') {
      return String(order.customer_name || '')
        .toLowerCase()
        .includes(term);
    } else if (selectedFilter === 'orderNumber') {
      return String(order.order_no || '')
        .toLowerCase()
        .includes(term);
    } else if (selectedFilter === 'accountNumber') {
      return String(order.account_number || '')
        .toLowerCase()
        .includes(term);
    }
    return true;
  });

  const handlePageChange = (page: number) => setCurrentPage(page);

  const totalPages = pagination?.hasMore ? currentPage + 1 : currentPage;

  const breadcrumbs = [
    { label: 'Sales Orders', path: '/' },
    { label: 'Open Orders', path: '', isActive: true },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#C32033] text-white rounded hover:bg-[#A91B2E] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h1 className="text-2xl font-semibold text-black">Open Orders</h1>
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

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search by ${
                    selectedFilter === 'customerName'
                      ? 'Customer Name'
                      : selectedFilter === 'orderNumber'
                      ? 'Order Number'
                      : 'Account Number'
                  }...`}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open filters"
              >
                <SlidersHorizontal />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-5">
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] text-white">
                  <th className="px-6 py-4 text-left">No.</th>
                  <th className="px-6 py-4 text-left">Order Number</th>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Account Number</th>
                  <th className="px-6 py-4 text-left">Salesperson</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((order, index) => (
                    <tr
                      key={`${order.order_no}-${pagination?.offset}-${index}`}
                      className="hover:bg-[#f1f1f1] shadow-lg bg-red-100 border-b-2 text-[#1e1e1e] border-b-[#eeeaea] transition-colors"
                    >
                      <td className="px-6 py-4">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        {String(order.order_no || '-')}
                      </td>
                      <td className="px-6 py-4">
                        {String(order.customer_name || '-')}
                      </td>
                      <td className="px-6 py-4">
                        {String(order.account_number || '-')}
                      </td>
                      <td className="px-6 py-4">
                        {String(order.salesperson || '-')}
                      </td>
                      <td className="px-6 py-4">
                        {Number(order.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleViewDetails(String(order.order_no))
                          }
                          className="px-4 py-2 border-2 border-[#C32033] text-[#C32033] rounded-lg font-medium hover:bg-[#C32033] hover:text-white transition-colors"
                        >
                          View Details
                        </button>
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
                        ? 'No matching Orders found'
                        : 'No Orders found'}
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
                aria-label="Previous page"
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

              {pagination?.hasMore && currentPage + 1 < totalPages && (
                <span className="px-2 text-gray-600">...</span>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination?.hasMore}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

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

export default OpenOrders;
