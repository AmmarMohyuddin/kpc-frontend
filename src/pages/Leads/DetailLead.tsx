import { ChevronRight, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailLead = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leadData = location.state?.lead;
  console.log('Lead Data:', leadData);

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            {leadData.id}
          </h1>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
            <span>Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span>Detail Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C32033]">{leadData.lead_id}</span>
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
              <span>{leadData.customer_type}</span>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Name:
              </span>
              <span>{leadData.customer_name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Email:
              </span>
              <span>{leadData.email_address}</span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Address:
              </span>
              <span>{leadData.contact_address}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                City:
              </span>
              <span>{leadData.city}</span>
            </div>

            {/* Contact Number */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Contact Number:
              </span>
              <span>{leadData.contact_number}</span>
            </div>

            {/* Contact Job Role */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Contact Job Role:
              </span>
              <span>{leadData.contact_position}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Source:
              </span>
              <span>{leadData.source}</span>
            </div>

            {/* Sales Person */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Sales Person:
              </span>
              <span>{leadData.salesperson_name}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="text-lg font-bold text-black">Status:</span>
              <div>{leadData.status}</div>
            </div>

            {/* View Opportunity Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() =>
                  navigate(`/leads/follow-up`, {
                    state: { lead_id: leadData.lead_id },
                  })
                }
                className="flex items-center gap-2 text-[#C32033] hover:text-[#A91B2E] font-medium transition-colors"
              >
                Follow Up
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-[#C32033] hover:text-white transition-colors duration-300"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailLead;
