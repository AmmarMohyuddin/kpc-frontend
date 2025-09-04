import { ChevronRight, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TitleValueRow from "../../components/TitleValueRow.js";

const DetailLead = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leadData = location.state?.lead;
  console.log('Lead Data:', leadData);

  return (
    <>
      <div className="flex flex-col py-1 px-5 gap-6 bg-white rounded-[20px]">
        <span className="text-[#161616] mt-5 text-[24px] font-semibold">
          {leadData.lead_id}
        </span>
        {/* Page Header */}
        <div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-md mt-0">
            <span className="text-[rgba(22,22,22,0.7)]">Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[rgba(22,22,22,0.7)]">Detail Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#161616]">{leadData.lead_id}</span>
          </div>
        </div>

        {/* Detail Card */}
        <div className="rounded-[10px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
          <div className="space-y-3">
            {/* Company */}

            <TitleValueRow title="Company" value={leadData.customer_type} />
            <hr className="custom-divider my-2" />

            {/* Name */}
            <TitleValueRow title="Name" value={leadData.customer_name} />
            <hr className="custom-divider my-2" />


            {/* Email */}
            <TitleValueRow title="Email" value={leadData.email_address} />
            <hr className="custom-divider my-2" />


            {/* Address */}
            <TitleValueRow title="Address" value={leadData.contact_address} />
            <hr className="custom-divider my-2" />
            <TitleValueRow title="City" value={leadData.city} />
            <hr className="custom-divider my-2" />



            {/* Contact Number */}
            <TitleValueRow title="Contact Number" value={leadData.contact_number} />
            <hr className="custom-divider my-2" />


            {/* Contact Job Role */}
            <TitleValueRow title="Contact Job Role:" value={leadData.contact_position} />
            <hr className="custom-divider my-2" />


            <TitleValueRow title="Source" value={leadData.source} />
            <hr className="custom-divider my-2" />


            {/* Sales Person */}
            <TitleValueRow title="Sales Person" value={leadData.salesperson_name} />
            <hr className="custom-divider my-2" />


            {/* Stage */}
            <TitleValueRow title="Stage" value={leadData.stage} />
            <hr className="custom-divider my-2" />


            {/* Status */}
            <TitleValueRow title="Status" value={leadData.status} />
            <hr className="custom-divider my-2" />


            {/* View Opportunity Button */}
            <div className="flex justify-center pt-4">
              {leadData.opportunity_id ? (
                <button
                  onClick={() =>
                    navigate(`/opportunities/${leadData.opportunity_id}`, {
                      state: { opportunity_id: leadData.opportunity_id },
                    })
                  }
                  className="flex items-center gap-2 text-[#C32033] hover:text-[#A91B2E] font-medium transition-colors"
                >
                  View Opportunity Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate(`/opportunities/create`, {
                      state: { lead_id: leadData.lead_id },
                    })
                  }
                  className="flex items-center gap-2 text-[#C32033] hover:text-[#A91B2E] font-medium transition-colors"
                >
                  Create Opportunity
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
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
