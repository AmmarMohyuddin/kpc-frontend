import { ChevronRight, ArrowRight } from 'lucide-react';

const DetailOpportunity = () => {
  const opportunityData = {
    id: '123434',
    company: 'abc',
    name: 'Robbert Greene',
    email: 'abc@gmail.com',
    address: 'abc, street 122324',
    contactNumber: 'xxxxxxxxxx',
    contactJobRole: 'xyz',
    salesPerson: 'John Smith',
    status: 'Pending',
    statusColor: 'yellow',
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            {opportunityData.id}
          </h1>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
            <span>Opportunities</span>
            <ChevronRight className="w-4 h-4" />
            <span>Manage Opportunities</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C32033]">{opportunityData.id}</span>
          </div>
        </div>

        {/* Detail Card */}
        <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="space-y-6">
            {/* Company */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Company:
              </span>
              <span className="text-black">{opportunityData.company}</span>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Name:
              </span>
              <span className="text-black">{opportunityData.name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Email:
              </span>
              <span className="text-black">{opportunityData.email}</span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Address:
              </span>
              <span className="text-black">{opportunityData.address}</span>
            </div>

            {/* Contact Number */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Contact Number:
              </span>
              <span className="text-black">
                {opportunityData.contactNumber}
              </span>
            </div>

            {/* Contact Job Role */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Contact Job Role:
              </span>
              <span className="text-black">
                {opportunityData.contactJobRole}
              </span>
            </div>

            {/* Sales Person */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Sales Person:
              </span>
              <span className="text-black">{opportunityData.salesPerson}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="text-lg font-bold text-black">Status:</span>
              <div>
                {opportunityData.status === 'Approved' ? (
                  <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                    Approved
                  </p>
                ) : (
                  <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                    Pending
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOpportunity;
