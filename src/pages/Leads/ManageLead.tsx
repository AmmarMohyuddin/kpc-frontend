import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight as CrRight,
  Edit,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface Lead {
  lead_id: number;
  lead_number: string;
  lead_type: string;
  customer_name: string;
  customer_type: string;
  country: string;
  city: string;
  contact_address: string;
  contact_number: string;
  email_address: string;
  contact_position: string;
  source: string;
  stage: string;
  status_id: number;
  status: string;
  created_by: string;
  salesperson_name: string;
  salesperson_id: string | { salesperson_id: string };
  last_updated_by: string;
  creation_date: string;
  last_update_date: string;
}

const ITEMS_PER_PAGE = 10;

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
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedFilter === 'DATE') {
      if (!fromDate || !toDate) {
        setError('Please select both From and To dates.');
        return;
      }
      setError('');
      onApply({ from: fromDate, to: toDate });
    } else {
      onApply();
    }
    onClose();
  };

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
              value="CUSTOMER_NAME"
              checked={selectedFilter === 'CUSTOMER_NAME'}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-5 h-5 accent-[#c32033]"
            />
            <span
              className={`${
                selectedFilter === 'CUSTOMER_NAME'
                  ? 'font-semibold text-black'
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
              {error && <p className="text-sm text-red-600">{error}</p>}
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
            onClick={handleApply}
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

const ManageLeads = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState<{ hasMore: boolean }>({
    hasMore: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('CUSTOMER_NAME');
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>();

  // 🔄 Debounce effect for text search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchLeads = async (page: number, overrideParams: any = null) => {
    try {
      setIsLoading(true);

      const params: any = overrideParams || {};

      if (!overrideParams) {
        if (selectedFilter === 'CUSTOMER_NAME' && debouncedSearch) {
          params.CUSTOMER_NAME = debouncedSearch;
        } else if (selectedFilter === 'LEAD_NUMBER' && debouncedSearch) {
          params.LEAD_NUMBER = debouncedSearch;
        } else if (selectedFilter === 'DATE' && dateFilter) {
          params.from_date = dateFilter.from;
          params.to_date = dateFilter.to;
        } else {
          params.limit = ITEMS_PER_PAGE;
          params.offset = (page - 1) * ITEMS_PER_PAGE;
        }
      }

      const response = await apiService.get(`/api/v1/leads/listLead`, {
        params,
      });

      if (response?.status === 200) {
        setLeadsData(response.data.leads || []);

        if (!params.CUSTOMER_NAME && !params.LEAD_NUMBER && !params.from_date) {
          const paginationData = response.data.pagination;
          if (paginationData) {
            setPagination(paginationData);
            setTotalPages(paginationData.hasMore ? page + 1 : page);
          }
        } else {
          setPagination({ hasMore: false });
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage, debouncedSearch, dateFilter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && (page <= totalPages || pagination?.hasMore)) {
      setCurrentPage(page);
    }
  };

  const breadcrumbs = [
    { label: 'Leads', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <div>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
            <h1 className="text-2xl font-semibold text-black">Manage Leads</h1>
          </div>

          {/* Breadcrumb + Search */}
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
                    selectedFilter === 'CUSTOMER_NAME'
                      ? 'Customer Name'
                      : selectedFilter === 'LEAD_NUMBER'
                      ? 'Lead Number'
                      : 'Lead ID'
                  }...`}
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-5">
          <table className="lead-table">
            <thead>
              <tr className="bg-[#C32033] text-white">
                <th className="text-left px-6 py-4">No.</th>
                <th className="text-left px-6 py-4">Lead Number</th>
                <th className="text-left px-6 py-4">Customer Name</th>
                <th className="text-left px-6 py-4">Contact Job Role</th>
                <th className="text-left px-6 py-4">Sales Person</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex justify-center items-center h-[200px]">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : leadsData.length > 0 ? (
                leadsData.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={`lead-row ${
                      index % 2 === 0 ? 'lead-row-even' : 'lead-row-odd'
                    }`}
                  >
                    <td className="px-6 py-4">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-6 py-4">{lead.lead_number}</td>
                    <td className="px-6 py-4">{lead.customer_name}</td>
                    <td className="px-6 py-4">{lead.contact_position}</td>
                    <td className="px-6 py-4">{lead.salesperson_name}</td>
                    <td className="px-6 py-4">{lead.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/leads/edit/${lead.lead_id}`, {
                              state: { lead },
                            })
                          }
                          className="hover:scale-110 transition-transform"
                        >
                          <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                        </button>
                        <button
                          className="btn-view-details"
                          onClick={() =>
                            navigate(`/leads/${lead.lead_id}`, {
                              state: { lead },
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
                      ? 'No matching leads found'
                      : 'No leads available'}
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
              className="px-3 py-2 rounded bg-[#C32033] text-white"
            >
              {currentPage}
            </button>

            {pagination?.hasMore && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-2 rounded text-gray-600 hover:bg-gray-100"
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
          setLeadsData([]); // clear old data
          setIsLoading(true); // show loader instantly
          setCurrentPage(1); // reset page
          setSearchTerm('');
          setDebouncedSearch('');

          if (selectedFilter === 'DATE' && dates) {
            setDateFilter({ from: dates.from, to: dates.to });
            fetchLeads(1, { from_date: dates.from, to_date: dates.to }); // ✅ API hit instantly
          } else {
            setDateFilter(undefined);
            fetchLeads(1); // ✅ API hit instantly
          }
        }}
      />
    </div>
  );
};

export default ManageLeads;
