import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  ChevronRight as CrRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchSalesRequest = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(
          `/api/v1/salesRequests/draft-sales-request`,
          {},
        );

        if (response?.status === 200) {
          // backend sends { message, total, orders }
          setSalesRequests(response.data || []);
        }
      } catch (error) {
        console.error('❌ Error fetching sales requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesRequest();
  }, []);

  const handleItemDeleted = (updatedItems: SalesRequest[]) => {
    setSalesRequests(updatedItems);
    setCurrentPage(1);
  };

  // Filter items
  const filteredItems = salesRequests.filter(
    (request) =>
      request.ORDER_NUMBER?.toLowerCase().includes(
        searchTerm.trim().toLowerCase(),
      ),
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

            <div className="text-md text-gray-700">
              Total Sales Request:{' '}
              <span className="font-semibold text-[#C32033]">
                {salesRequests.length}
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
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Total Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((request, index) => (
                    <tr
                      key={request.ORDER_NUMBER}
                      className={`border-b ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
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
                        ? 'No matching items found'
                        : 'No Draft Orders found'}
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                ),
              )}

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
    </>
  );
};

export default DraftSalesRequest;
