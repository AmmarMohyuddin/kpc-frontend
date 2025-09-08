import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight as CrRight,
  X,
  Edit,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface Opportunity {
  OPPORTUNITY_ID: number;
  LEAD_ID: number | null;
  GENERATION_DATE: string;
  STAGE: string;
  AMOUNT: number;
  CLOSE_DATE: string;
  STATUS_ID: number;
  STATUS: string;
  REMARKS: string;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
  SALESPERSON_NAME: string;
  LEAD_NUMBER: number | null;
}

interface PaginationInfo {
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface ApiResponse {
  opportunities: Opportunity[];
  pagination: PaginationInfo;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onApply: (dates?: { from: string; to: string }) => void;
}

const FilterModal = ({
  isOpen,
  onClose,
  selectedFilter,
  onFilterChange,
  onApply,
}: FilterModalProps) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="OPPORTUNITY_ID"
              checked={selectedFilter === 'OPPORTUNITY_ID'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'OPPORTUNITY_ID'
                  ? 'font-semibold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Opportunity ID
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="LEAD_NUMBER"
              checked={selectedFilter === 'LEAD_NUMBER'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'LEAD_NUMBER'
                  ? 'font-semibold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Lead Number
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="filterOption"
              value="DATE"
              checked={selectedFilter === 'DATE'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'DATE'
                  ? 'font-semibold text-black'
                  : 'font-medium text-gray-700'
              }`}
            >
              Date
            </span>
          </label>

          {selectedFilter === 'DATE' && (
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-black">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#c32033] focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-black">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#c32033] focus:outline-none"
                />
              </div>
            </div>
          )}
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
              if (selectedFilter === 'DATE') {
                onApply({ from: fromDate, to: toDate });
              } else {
                onApply();
              }
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

const ManageOpportunities = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPPORTUNITY_ID');
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>();

  // 🔄 Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchOpportunities = async (page: number) => {
    try {
      setIsLoading(true);

      const params: any = {};

      if (selectedFilter === 'OPPORTUNITY_ID' && debouncedSearch) {
        params.OPPORTUNITY_ID = debouncedSearch;
      } else if (selectedFilter === 'LEAD_NUMBER' && debouncedSearch) {
        params.LEAD_NUMBER = debouncedSearch;
      } else if (selectedFilter === 'DATE' && dateFilter) {
        params.from_date = dateFilter.from;
        params.to_date = dateFilter.to;
      } else {
        params.limit = ITEMS_PER_PAGE;
        params.offset = (page - 1) * ITEMS_PER_PAGE;
      }

      const response = await apiService.get(
        `/api/v1/opportunities/listOpportunities`,
        { params },
      );

      if (response?.status === 200) {
        setOpportunities(response.data.opportunities || []);

        if (
          !params.OPPORTUNITY_ID &&
          !params.LEAD_NUMBER &&
          !params.from_date
        ) {
          setPagination(response.data.pagination);
        } else {
          setPagination(null); // no pagination when filters are applied
        }
      }
    } catch (error) {
      console.error('❌ Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(currentPage);
  }, [currentPage, debouncedSearch, dateFilter]);

  const handlePageChange = (page: number) => {
    if (
      page >= 1 &&
      (page <= (pagination?.offset || 1) || pagination?.hasMore)
    ) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  const totalPages = pagination?.hasMore ? currentPage + 1 : currentPage;

  const breadcrumbs = [
    { label: 'Opportunities', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
          <h1 className="text-2xl font-semibold text-black">
            Manage Opportunities
          </h1>
        </div>

        {/* Breadcrumbs */}
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

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={
                  selectedFilter === 'OPPORTUNITY_ID'
                    ? 'Search by Opportunity ID...'
                    : selectedFilter === 'LEAD_NUMBER'
                    ? 'Search by Lead Number...'
                    : 'Disabled for Date'
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={selectedFilter === 'DATE'}
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
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]">
              <Loader />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] shadow-lg text-white">
                  <th className="text-left px-6 py-4">No.</th>
                  <th className="text-left px-6 py-4">Opportunity ID</th>
                  <th className="text-left px-6 py-4">Generation Date</th>
                  <th className="text-left px-6 py-4">Stage</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Salesperson</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.length > 0 ? (
                  opportunities.map((opp, index) => (
                    <tr
                      key={opp.OPPORTUNITY_ID}
                      className="hover:bg-[#f1f1f1] shadow-lg bg-red-100 border-b-2 text-[#1e1e1e] border-b-[#eeeaea] transition-colors"
                    >
                      <td className="px-6 py-4">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">{opp.OPPORTUNITY_ID}</td>
                      <td className="px-6 py-4">
                        {opp.GENERATION_DATE || '-'}
                      </td>
                      <td className="px-6 py-4">{opp.STAGE}</td>
                      <td className="px-6 py-4">{opp.STATUS}</td>
                      <td className="px-6 py-4">{opp.SALESPERSON_NAME}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/opportunities/edit/${opp.OPPORTUNITY_ID}`,
                                {
                                  state: { opportunity_id: opp.OPPORTUNITY_ID },
                                },
                              )
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                          </button>
                          <button
                            className="px-4 py-2 border-2 border-[#C32033] text-[#C32033] rounded-lg font-medium hover:bg-[#C32033] hover:text-white transition-colors"
                            onClick={() =>
                              navigate(`/opportunities/${opp.OPPORTUNITY_ID}`, {
                                state: { opportunity_id: opp.OPPORTUNITY_ID },
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
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {debouncedSearch || dateFilter
                        ? 'No matching opportunities found'
                        : 'No opportunities available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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
              className="px-3 py-2 rounded font-medium bg-[#C32033] text-white"
            >
              {currentPage}
            </button>

            {pagination?.hasMore && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-2 rounded font-medium text-gray-600 hover:bg-gray-100"
              >
                {currentPage + 1}
              </button>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination?.hasMore}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <CrRight className="w-4 h-4 text-gray-600" />
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
        onApply={(dates) => {
          setOpportunities([]); // clear table instantly
          setIsLoading(true);
          setCurrentPage(1);
          setSearchTerm('');
          setDebouncedSearch('');

          if (selectedFilter === 'DATE' && dates) {
            setDateFilter({ from: dates.from, to: dates.to });
          } else {
            setDateFilter(undefined);
          }

          fetchOpportunities(1);
        }}
      />
    </div>
  );
};

export default ManageOpportunities;
