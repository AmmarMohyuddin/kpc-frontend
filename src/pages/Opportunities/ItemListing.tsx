import {
  ChevronLeft,
  ChevronRight,
  // Edit,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
import DeleteModal from './DeleteModal';
import Loader from '../../common/Loader';

interface OpportunityLine {
  OPPORTUNITY_DETAIL_ID: number;
  OPPORTUNITY_ID: number;
  ITEM_ID: number;
  DESCRIPTION: string;
  UOM: string;
  INSTRUCTIONS: string;
  QUANTITY: number;
  PRICE: number;
  AMOUNT: number;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
}

const ITEMS_PER_PAGE = 10;

const ItemListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const opportunityId = location.state?.opportunity_id || null;
  console.log('Opportunity ID:', opportunityId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OpportunityLine | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Local state for filtering & deletion
  const [lines, setLines] = useState<OpportunityLine[]>([]);

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiService.get(
          `/api/v1/opportunities/detailOpportunity/${opportunityId}`,
          {},
        );
        setLines(res.data[0]?.ORDER_LINES || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (opportunityId) fetchData();
  }, [opportunityId]);

  // Filtered & paginated lines
  const filteredLines = lines.filter(
    (line) =>
      line.DESCRIPTION.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.OPPORTUNITY_ID.toString().includes(searchTerm),
  );

  const totalPages = Math.ceil(filteredLines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLines = filteredLines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleDelete = (line: OpportunityLine) => {
    setSelectedItem(line);
    setIsModalOpen(true);
  };

  // const handleEdit = (line: OpportunityLine) => {
  //   console.log('Editing line:', line);
  //   navigate(`/opportunities/detail/edit/${line.OPPORTUNITY_DETAIL_ID}`, {
  //     state: { line },
  //   });
  // };

  const handleDetails = (line: OpportunityLine) => {
    navigate(`/opportunities/details/${line.OPPORTUNITY_DETAIL_ID}`, {
      state: { line },
    });
  };

  const breadcrumbs = [
    { label: 'Opportunities', path: '/' },
    { label: 'Opportunity Details', path: '', isActive: true },
  ];

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[calc(100vh-200px)]">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedItem?.OPPORTUNITY_DETAIL_ID}
        type="detail"
        onItemDeleted={() => {
          setLines((prev) =>
            prev.filter(
              (l) =>
                l.OPPORTUNITY_DETAIL_ID !== selectedItem?.OPPORTUNITY_DETAIL_ID,
            ),
          );
          setIsModalOpen(false);
        }}
      />

      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-30">
          <Loader />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Opportunity Details
            </h2>
            <button
              onClick={() =>
                navigate('/opportunities/create', {
                  state: { step: 2, opportunityId: opportunityId },
                })
              }
              className="px-6 py-3 rounded-lg font-medium transition-colors bg-[#C32033] text-white hover:bg-[#A91B2E]"
            >
              Add More Items
            </button>
          </div>

          {/* Breadcrumbs & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
            <div className="flex items-center gap-2 text-md text-gray-600">
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
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
                  placeholder="Search by description or ID..."
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
          <div className="overflow-x-auto mt-6">
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] text-white">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Item Description</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">UOM</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLines.length > 0 ? (
                  paginatedLines.map((line, index) => (
                    <tr
                      key={line.OPPORTUNITY_DETAIL_ID}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
                      <td className="px-6 py-4">{line.DESCRIPTION}</td>
                      <td className="px-6 py-4">{line.QUANTITY}</td>
                      <td className="px-6 py-4">{line.UOM}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDelete(line)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="text-[#C32033] hover:text-red-800 w-5 h-5" />
                          </button>
                          {/* <button
                            onClick={() => handleEdit(line)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                          </button> */}
                          <button
                            className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium"
                            onClick={() => handleDetails(line)}
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
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No order lines available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
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
