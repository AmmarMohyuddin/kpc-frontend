import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  ChevronRight as CrRight,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DeleteModal from './DeleteModal';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SalesItem {
  item_detail: string;
  item_number: string;
  unit_of_measure: string;
  sub_category: string;
  description: string;
  instructions: string;
  order_quantity: number;
  price: number;
  line_amount: number;
}

const ITEMS_PER_PAGE = 5;

const ItemListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item_number: string;
    customer_id: string;
  } | null>(null);
  const [items, setItems] = useState<SalesItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      if (!customer?.customer_id) {
        setIsLoading(false);
        console.error('No customer_id provided');
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiService.get(
          `/api/v1/salesRequests/item-list/${customer.customer_id}`,
          {},
        );

        if (response?.status === 200) {
          setItems(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [customer?.customer_id]);

  const handleItemDeleted = (updatedItems: SalesItem[]) => {
    setItems(updatedItems);
    setCurrentPage(1);
  };

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.item_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
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
    { label: 'Sales Requests', path: '/' },
    { label: 'Items', path: '/items' },
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
        itemNumber={selectedItem?.item_number}
        customerId={selectedItem?.customer_id}
        onItemDeleted={handleItemDeleted}
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              Items Listing
            </h1>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate('/sales-request/create', {
                    state: {
                      step: 1,
                      customer_id: customer.customer_id,
                      mode: 'save',
                    },
                  })
                }
                className="px-4 py-2 rounded border border-[#C32033] text-[#C32033] hover:bg-[#C32033] hover:text-white transition-colors font-medium"
              >
                Add More Items
              </button>
              <Link
                to="/sales-request/confirm-address"
                state={{ customer_id: customer.customer_id }}
              >
                <button className="px-4 py-2 rounded bg-[#C32033] text-white hover:bg-[#a91b2e] transition-colors font-medium">
                  Confirm Address
                </button>
              </Link>
            </div>
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
              Total Items:{' '}
              <span className="font-semibold text-[#C32033]">
                {filteredItems.length}
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

          {/* Table with loading skeleton */}
          <div className="overflow-x-auto mt-5">
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] text-white">
                  <th className="px-6 py-4 text-left">No.</th>
                  <th className="px-6 py-4 text-left">Item Number</th>
                  <th className="px-6 py-4 text-left">Order Quantity</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item, index) => (
                    <tr
                      key={item.item_number}
                      className={`border-b ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
                      <td className="px-6 py-4">{item.item_number || '-'}</td>
                      <td className="px-6 py-4">{item.order_quantity || 0}</td>
                      <td className="px-6 py-4">
                        {item.price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        {item.line_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedItem({
                                item_number: item.item_number,
                                customer_id: customer.customer_id,
                              });
                              setIsModalOpen(true);
                            }}
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="text-[#C32033] hover:text-red-800 w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate('/sales-request/create', {
                                state: {
                                  step: 1,
                                  item_number: item.item_number,
                                  customer_id: customer.customer_id,
                                  mode: 'update',
                                },
                              })
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                          </button>
                          <Link
                            to={`/sales-request/details/${item.item_number}`}
                            state={{
                              item_number: item.item_number,
                              customer_id: customer.customer_id,
                            }}
                          >
                            <button className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors">
                              View Details
                            </button>
                          </Link>
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
                        : 'No items found'}
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

export default ItemListing;
