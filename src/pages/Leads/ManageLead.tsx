import { Search, Filter, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface Lead {
  lead_id: number;
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

const ManageLeads = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSalesRequest = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get(`/api/v1/leads/listLead`, {});

        if (response?.status === 200) {
          setLeadsData(response.data || []);
        }
      } catch (error) {
        console.error('❌ Error fetching sales requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesRequest();
  }, []);
  console.log('leadsData:', leadsData);

  // Filter leads based on lead_id search term
  const filteredLeads = leadsData.filter((lead) =>
    String(lead.lead_id || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(
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
    { label: 'Sales Requests', path: '/' },
    { label: 'Listing', path: '', isActive: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Manage Leads
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
                  placeholder="Search by Lead ID..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
              <button className="p-2  rounded-lg hover:bg-gray-50 transition-colors">
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
                <th className="tableTitle">No.</th>
                <th className="tableTitle">Lead Number</th>
                <th className="tableTitle">Company</th>
                <th className="tableTitle">Contact Job Role</th>
                <th className="tableTitle">Sales Person</th>
                <th className="tableTitle">Status</th>
                <th className="tableTitle">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={` hover:bg-gray-100 transition-colors`}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F5F5F5',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <td className="tableValues my-5">{startIndex + index + 1}</td>
                    <td className="tableValues my-5">{lead.lead_id}</td>
                    <td className="tableValues my-5">{lead.customer_type}</td>
                    <td className="tableValues my-5">{lead.contact_position}</td>
                    <td className="tableValues my-5">{lead.salesperson_name}</td>
                    <td className="tableValues my-5">{lead.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/leads/edit/${lead.lead_id}`, { state: { lead } })
                          }
                          className="hover:scale-110 transition-transform"
                        >
                          <Edit className="text-blue-600 hover:text-blue-800 w-5 h-5" />
                        </button>
                        <button
                          className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium"
                          onClick={() =>
                            navigate(`/leads/${lead.lead_id}`, { state: { lead } })
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
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No matching leads found' : 'No leads available'}
                  </td>
                </tr>
              )}
            </tbody>

            {/* <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead, index) => (
                  <tr
                    key={lead.lead_id}
                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4 text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{lead.lead_id}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {lead.customer_type}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {lead.contact_position}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {lead.salesperson_name}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{lead.status}</td>
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
                          className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium"
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
                    {searchTerm
                      ? 'No matching leads found'
                      : 'No leads available'}
                  </td>
                </tr>
              )}
            </tbody> */}
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
                className={`px-3 py-2 rounded font-medium transition-colors ${page === currentPage
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

export default ManageLeads;
