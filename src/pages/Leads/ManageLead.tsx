'use client';

import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageLeads = () => {
  const leadsData = [
    {
      no: 1,
      leadNumber: '12345',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Approved',
      statusColor: 'green',
    },
    {
      no: 2,
      leadNumber: '123456',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Pending',
      statusColor: 'yellow',
    },
    {
      no: 1,
      leadNumber: '12345',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Approved',
      statusColor: 'green',
    },
    {
      no: 2,
      leadNumber: '123456',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Accepted',
      statusColor: 'green',
    },
    {
      no: 1,
      leadNumber: '12345',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Approved',
      statusColor: 'green',
    },
    {
      no: 1,
      leadNumber: '12345',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Approved',
      statusColor: 'green',
    },
    {
      no: 1,
      leadNumber: '12345',
      company: 'abc',
      contactJobRole: 'xxxxxxxxx',
      salesPerson: 'John Smith',
      status: 'Approved',
      statusColor: 'green',
    },
  ];

  // const getStatusBadge = (status: string, color: string) => {
  //   const baseClasses =
  //     'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1';

  //   switch (color) {
  //     case 'green':
  //       return `${baseClasses} bg-green-100 text-green-800`;
  //     case 'yellow':
  //       return `${baseClasses} bg-yellow-100 text-yellow-800`;
  //     default:
  //       return `${baseClasses} bg-gray-100 text-gray-800`;
  //   }
  // };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Manage Leads
          </h1>

          {/* Top Bar: Breadcrumb + Search/Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
            {/* Breadcrumb */}
            <nav>
              <ol className="flex items-center gap-2 text-md">
                <li>
                  <Link to="/" className="text-gray-600 hover:underline">
                    Dashboard /
                  </Link>
                </li>
                <li className="text-[#C32033] font-medium">Manage Leads</li>
              </ol>
            </nav>

            {/* Search and Filter */}
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
            {/* Table Header */}
            <thead>
              <tr className="bg-[#C32033] text-white">
                <th className="px-6 py-4 text-left font-medium">No.</th>
                <th className="px-6 py-4 text-left font-medium">Lead Number</th>
                <th className="px-6 py-4 text-left font-medium">Company</th>
                <th className="px-6 py-4 text-left font-medium">
                  Contact Job Role
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Sales Person
                </th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {leadsData.map((lead, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-6 py-4 text-gray-900">{lead.no}</td>
                  <td className="px-6 py-4 text-gray-900">{lead.leadNumber}</td>
                  <td className="px-6 py-4 text-gray-900">{lead.company}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {lead.contactJobRole}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {lead.salesPerson}
                  </td>
                  <td className="px-6 py-4">
                    {lead.status === 'Approved' ? (
                      <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        Approved
                      </p>
                    ) : (
                      <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 border border-[#C32033] text-[#C32033] rounded hover:bg-[#C32033] hover:text-white transition-colors font-medium">
                      <Link to={`/leads/${lead.leadNumber}`}>View Details</Link>
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

export default ManageLeads;
