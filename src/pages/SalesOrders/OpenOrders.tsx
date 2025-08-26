import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronRight as CrRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SalesOrder {
  order_no: string;
  customer_name: string;
  salesperson: string;
  price: number | string;
}

interface OriginalOrder {
  order_no: string;
  lines: any[];
  // Add other properties that might be in the original response
}

const ITEMS_PER_PAGE = 10;

const OpenOrders = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [originalOrders, setOriginalOrders] = useState<OriginalOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.get(
          `/api/v1/salesOrders/open-orders`,
          {},
        );
        console.log('Response:', response.data);

        if (response?.status === 200) {
          const orders = response.data || [];

          // Store original orders
          setOriginalOrders(orders);

          // Format one row per order, using line data with proper validation
          const formatted: SalesOrder[] = orders.map((order: any) => {
            try {
              const orderNo = String(order.order_no || '-');
              const customerName = String(
                order.lines?.[0]?.CUSTOMER_NAME || '-',
              );
              const salesperson = String(
                order.lines?.[0]?.SALESPERSON_NAME || '-',
              );

              const price = order.lines?.[0]?.UNIT_LIST_PRICE || 0;

              return {
                order_no: orderNo,
                customer_name: customerName,
                salesperson: salesperson,
                price: price,
              };
            } catch (error) {
              console.error('Error formatting order:', order, error);
              return {
                order_no: 'ERROR',
                customer_name: 'ERROR',
                salesperson: 'ERROR',
                price: 0,
              };
            }
          });
          setSalesOrders(formatted);
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Debug: Check for object values
  useEffect(() => {
    if (salesOrders.length > 0) {
      salesOrders.forEach((order, index) => {
        Object.entries(order).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            console.error(`Object found at index ${index}, key ${key}:`, value);
          }
        });
      });
    }
  }, [salesOrders]);

  // Function to handle view details click
  const handleViewDetails = (orderNo: string) => {
    // Find the original order with all data
    const originalOrder = originalOrders.find(
      (order) => order.order_no === orderNo,
    );

    if (originalOrder) {
      navigate(`/sales-orders/open/${orderNo}`, {
        state: {
          order: originalOrder,
        },
      });
    } else {
      console.error('Original order not found for:', orderNo);
      navigate(`/sales-orders/open/${orderNo}`);
    }
  };

  // Filter items
  const filteredItems = salesOrders.filter(
    (order) =>
      String(order.order_no || '')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      String(order.customer_name || '')
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Open Orders
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

          <div className="text-md text-gray-700">
            Total Orders:{' '}
            <span className="font-semibold text-[#C32033]">
              {salesOrders.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
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
                <th className="px-6 py-4 text-left">Salesperson</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((order, index) => (
                  <tr
                    key={`${order.order_no}-${index}`}
                    className={`border-b ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4">{startIndex + index + 1}</td>
                    <td className="px-6 py-4">
                      {String(order.order_no || '-')}
                    </td>
                    <td className="px-6 py-4">
                      {String(order.customer_name || '-')}
                    </td>
                    <td className="px-6 py-4">
                      {String(order.salesperson || '-')}
                    </td>
                    <td className="px-6 py-4">
                      {Number(order.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleViewDetails(String(order.order_no))
                          }
                          className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors"
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
                    colSpan={6}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#C32033] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenOrders;
