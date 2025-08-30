import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import DeleteModal from './DeleteModal';

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
  ORDER_LINES: OpportunityLine[];
}

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
  SUB_CAT: string;
  ITEM_DETAIL: string;
  ITEM_NUMBER: string;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
}

const ITEMS_PER_PAGE = 10;

const ManageOpportunity = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Opportunity | null>(null);
  const [opportunityData, setOpportunityData] = useState<Opportunity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  console.log('opportunityData', opportunityData);
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(
          `/api/v1/opportunities/listOpportunities`,
          {},
        );

        if (response?.status === 200) {
          setOpportunityData(response.data || []);
        }
      } catch (error) {
        console.error('❌ Error fetching opportunities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities based on opportunity_id search term
  const filteredOpportunities = opportunityData.filter((opportunity) =>
    String(opportunity.OPPORTUNITY_ID || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOpportunities = filteredOpportunities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleViewDetails = (opportunityId: number) => {
    navigate(`/opportunities/${opportunityId}`, {
      state: {
        opportunity: opportunityData.find(
          (opp) => opp.OPPORTUNITY_ID === opportunityId,
        ),
      },
    });
  };

  const handleEdit = (opportunityId: number) => {
    navigate(`/opportunities/edit/${opportunityId}`, {
      state: {
        opportunity: opportunityData.find(
          (opp) => opp.OPPORTUNITY_ID === opportunityId,
        ),
      },
    });
  };

  const handleDelete = (opportunityId: number) => {
    setSelectedItem(
      opportunityData.find((opp) => opp.OPPORTUNITY_ID === opportunityId) ||
        null,
    );
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Opportunities', path: '/' },
    { label: 'Manage Opportunities', path: '', isActive: true },
  ];

  return (
    <>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedItem?.OPPORTUNITY_ID}
        type="header"
        onItemDeleted={() => {
          // refresh list after delete
          setOpportunityData((prev) =>
            prev.filter(
              (opp) => opp.OPPORTUNITY_ID !== selectedItem?.OPPORTUNITY_ID,
            ),
          );
        }}
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
              Manage Opportunities
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

              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by Opportunity ID..."
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
              {/* Table Header */}
              <thead>
                <tr className="bg-[#C32033] text-white">
                  <th className="px-6 py-4 text-left font-medium">No.</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Opportunity ID
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Generation Date
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Stage</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>

                  <th className="px-6 py-4 text-left font-medium">
                    Sales Person
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {paginatedOpportunities.length > 0 ? (
                  paginatedOpportunities.map((opportunity, index) => (
                    <tr
                      key={opportunity.OPPORTUNITY_ID}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {opportunity.OPPORTUNITY_ID}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {opportunity.GENERATION_DATE || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {opportunity.STAGE}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {opportunity.STATUS}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {opportunity.SALESPERSON_NAME}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleDelete(opportunity.OPPORTUNITY_ID)
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <Trash2 className="text-[#C32033] hover:text-red-800 w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleEdit(opportunity.OPPORTUNITY_ID)
                            }
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                          </button>
                          <button
                            className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium"
                            onClick={() =>
                              handleViewDetails(opportunity.OPPORTUNITY_ID)
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
                        ? 'No matching opportunities found'
                        : 'No opportunities available'}
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

export default ManageOpportunity;
