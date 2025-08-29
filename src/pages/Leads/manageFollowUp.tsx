import { Search, Filter, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface FollowUp {
  followup_id: number;
  source: string;
  lead_id: number | null;
  opportunity_id: number;
  followup_date: string;
  next_followup_date: string;
  status: string;
  comments: string;
  assigned_to: string;
  created_by: string;
  last_updated_by: string;
  creation_date: string;
  last_update_date: string;
}

const ITEMS_PER_PAGE = 10;

const ManageFollowUp = () => {
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(`/api/v1/leads/listFollowup`, {});

        if (response?.status === 200) {
          setFollowUps(response.data || []);
        }
      } catch (error) {
        console.error('❌ Error fetching follow-ups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  // Filter followups based on followup_id
  const filteredFollowUps = followUps.filter((fu) =>
    String(fu.followup_id || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredFollowUps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFollowUps = filteredFollowUps.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Follow Ups', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Manage Follow Ups
          </h1>

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

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by FollowUp ID..."
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-5">
          <table className="w-full">
            <thead>
              <tr className="bg-[#C32033] text-white">
                <th className="px-6 py-4 text-left font-medium">No.</th>
                <th className="px-6 py-4 text-left font-medium">FollowUp ID</th>
                <th className="px-6 py-4 text-left font-medium">Source</th>
                <th className="px-6 py-4 text-left font-medium">Assigned To</th>
                <th className="px-6 py-4 text-left font-medium">
                  FollowUp Date
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Next FollowUp
                </th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFollowUps.length > 0 ? (
                paginatedFollowUps.map((fu, index) => (
                  <tr
                    key={fu.followup_id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4">{startIndex + index + 1}</td>
                    <td className="px-6 py-4">{fu.followup_id}</td>
                    <td className="px-6 py-4">{fu.source}</td>
                    <td className="px-6 py-4">{fu.assigned_to}</td>
                    <td className="px-6 py-4">
                      {new Date(fu.followup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(fu.next_followup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{fu.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium"
                          onClick={() =>
                            navigate(
                              `/opportunities/follow-up/detail/${fu.followup_id}`,
                              {
                                state: { followup: fu },
                              },
                            )
                          }
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
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm
                      ? 'No matching follow-ups found'
                      : 'No follow-ups available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
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

export default ManageFollowUp;
