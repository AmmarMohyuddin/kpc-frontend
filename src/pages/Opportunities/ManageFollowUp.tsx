import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

interface PaginationInfo {
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface ApiResponse {
  followups: FollowUp[];
  pagination: PaginationInfo | null;
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
              value="followupId"
              checked={selectedFilter === 'followupId'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'followupId'
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              FollowUp ID
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="opportunityId"
              checked={selectedFilter === 'opportunityId'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'opportunityId'
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Opportunity ID
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

const ITEMS_PER_PAGE = 10;
let debounceTimer: NodeJS.Timeout;

const ManageFollowUp = () => {
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Filter modal states
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('followupId');

  useEffect(() => {
    fetchFollowUps(currentPage, searchTerm);
  }, [currentPage]);

  const fetchFollowUps = async (page: number, query: string = '') => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const params: Record<string, any> = {
        limit: ITEMS_PER_PAGE,
        offset,
      };

      // Apply search filters if present
      if (query) {
        if (selectedFilter === 'followupId') {
          params.FOLLOWUP_ID = query;
        } else if (selectedFilter === 'opportunityId') {
          params.OPPORTUNITY_ID = query;
        }
      }

      const response = await apiService.get(
        `/api/v1/opportunities/listFollowup`,
        params,
      );

      if (response?.status === 200) {
        const data: ApiResponse = response.data;
        setFollowUps(data.followups || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('❌ Error fetching follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchFollowUps(1, value);
    }, 600); // 600ms debounce
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = pagination?.hasMore ? currentPage + 1 : currentPage;

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
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-black mb-2">
          Manage Follow Ups
        </h1>

        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
          <div className="flex items-center gap-2 text-md text-gray-600">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <ChevronRightIcon className="w-4 h-4 mx-2" />}
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
                  selectedFilter === 'followupId'
                    ? 'FollowUp ID'
                    : 'Opportunity ID'
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
                <th className="px-6 py-4 text-left">FollowUp ID</th>
                <th className="px-6 py-4 text-left">Source</th>
                <th className="px-6 py-4 text-left">Opportunity ID</th>
                <th className="px-6 py-4 text-left">Assigned To</th>
                <th className="px-6 py-4 text-left">FollowUp Date</th>
                <th className="px-6 py-4 text-left">Next FollowUp</th>
                {/* <th className="px-6 py-4 text-left">Status</th> */}
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {followUps.length > 0 ? (
                followUps.map((fu, index) => (
                      //  key={fu.followup_id}
                   <tr
                    key={fu.followup_id}
                    className={`lead-row ${index % 2 === 0 ? "lead-row-even" : "lead-row-odd"}`}
                  >
                    <td className="px-6 py-4">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-6 py-4">{fu.followup_id}</td>
                    <td className="px-6 py-4">{fu.source}</td>
                    <td className="px-6 py-4">{fu.opportunity_id}</td>
                    <td className="px-6 py-4">{fu.assigned_to}</td>
                    <td className="px-6 py-4">
                      {new Date(fu.followup_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(fu.next_followup_date).toLocaleDateString()}
                    </td>
                    {/* <td className="px-6 py-4">{fu.status}</td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                        className="btn-view-details"
                          onClick={() =>
                            navigate(`/follow-up/detail/${fu.followup_id}`, {
                              state: { followup: fu },
                            })
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
    </div>
  );
};

export default ManageFollowUp;
