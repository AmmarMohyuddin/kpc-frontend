'use client';

import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageOpportunity = () => {
  const opportunityData = [
    {
      no: 1,
      leadNumber: '12345',
      generationDate: '2023-10-01',
      latestRemarks: 'Initial contact made',
      salesPerson: 'John Smith',
    },
    {
      no: 2,
      leadNumber: '123456',
      generationDate: '2023-10-02',
      latestRemarks: 'Follow-up email sent',
      salesPerson: 'Jane Doe',
    },
    {
      no: 1,
      leadNumber: '12345',
      generationDate: '2023-10-01',
      latestRemarks: 'Initial contact made',
      salesPerson: 'John Smith',
    },
    {
      no: 2,
      leadNumber: '123456',
      generationDate: '2023-10-02',
      latestRemarks: 'Follow-up email sent',
      salesPerson: 'Jane Doe',
    },
    {
      no: 2,
      leadNumber: '123456',
      generationDate: '2023-10-02',
      latestRemarks: 'Follow-up email sent',
      salesPerson: 'Jane Doe',
    },
    {
      no: 1,
      leadNumber: '12345',
      generationDate: '2023-10-01',
      latestRemarks: 'Initial contact made',
      salesPerson: 'John Smith',
    },
    {
      no: 2,
      leadNumber: '123456',
      generationDate: '2023-10-02',
      latestRemarks: 'Follow-up email sent',
      salesPerson: 'Jane Doe',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Manage Opportunities
          </h1>

          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
            <nav>
              <ol className="flex items-center gap-2 text-md">
                <li>
                  <Link to="/" className="text-gray-600 hover:underline">
                    Dashboard /
                  </Link>
                </li>
                <li className="text-[#C32033] font-medium">
                  Manage Opportunities
                </li>
              </ol>
            </nav>

            <div className="mt-1 text-md text-gray-700">
              Total Opportunities:{' '}
              <span className="font-semibold text-[#C32033]">42</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:border-transparent w-72"
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
                <th className="px-6 py-4 text-left font-medium">Lead Number</th>
                <th className="px-6 py-4 text-left font-medium">
                  Generation Date
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Sales Person
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Latest Remarks
                </th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunityData.map((opportunity, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-6 py-4 text-gray-900">{opportunity.no}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {opportunity.leadNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {opportunity.generationDate}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {opportunity.salesPerson}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {opportunity.latestRemarks}
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium">
                      <Link to={`/opportunities/${opportunity.leadNumber}`}>
                        View Details
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button className="p-2 rounded hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="px-3 py-2 bg-[#C32033] text-white rounded font-medium">
            1
          </button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            2
          </button>
          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            3
          </button>
          <button className="p-2 rounded hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOpportunity;
