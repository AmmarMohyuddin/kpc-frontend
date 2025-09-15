import { ChevronRight, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TitleValueRow from '../../components/TitleValueRow.js';
import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

const DetailLead = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leadData = location.state?.lead;
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFollowUps, setHasFollowUps] = useState(false);

  console.log('Lead Data:', leadData);

  useEffect(() => {
    // Automatically fetch follow-ups when component mounts
    fetchFollowUps();
  }, [leadData?.lead_id]);

  const fetchFollowUps = async () => {
    if (!leadData?.lead_id) return;

    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.get(
        `/api/v1/leads/leadFollowups?LEAD_ID=${leadData.lead_id}`,
        {},
      );
      console.log('RESPONSE', response);
      if (response?.status === 200) {
        console.log('Follow-ups data:', response.data.followups);
        const followUpsData = response.data.followups || [];
        setFollowUps(followUpsData);
        setHasFollowUps(followUpsData.length > 0);
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('Failed to fetch follow-ups');
      setHasFollowUps(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFollowUps = () => {
    setShowFollowUps(!showFollowUps);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

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
        {/* <div className="rounded-[10px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
          <div className="space-y-3">
            {/* Company */}

        {/* <TitleValueRow title="Company" value={leadData.customer_type} />
            <hr className="custom-divider my-2" /> */}

        {/* Name */}
        {/* <TitleValueRow title="Name" value={leadData.customer_name} /> */}
        {/* <hr className="custom-divider my-2" /> */}

        {/* Email */}
        {/* <TitleValueRow title="Email" value={leadData.email_address} />
            <hr className="custom-divider my-2" /> */}

        {/* Address */}
        {/* <TitleValueRow title="Address" value={leadData.contact_address} />
            <hr className="custom-divider my-2" />
            <TitleValueRow title="City" value={leadData.city} />
            <hr className="custom-divider my-2" /> */}

        {/* Contact Number */}
        {/* <TitleValueRow title="Contact Number" value={leadData.contact_number} />
            <hr className="custom-divider my-2" /> */}

        {/* Contact Job Role */}
        {/* <TitleValueRow title="Contact Job Role:" value={leadData.contact_position} />
            <hr className="custom-divider my-2" /> */}

        {/* <TitleValueRow title="Source" value={leadData.source} />
            <hr className="custom-divider my-2" /> */}

        {/* Sales Person */}
        {/* <TitleValueRow title="Sales Person" value={leadData.salesperson_name} />
            <hr className="custom-divider my-2" /> */}

        {/* Stage */}
        {/* <TitleValueRow title="Stage" value={leadData.stage} />
            <hr className="custom-divider my-2" /> */}

        {/* Status */}
        {/* <TitleValueRow title="Status" value={leadData.status} />
            <hr className="custom-divider my-2" /> */}

        {/* View Opportunity Button */}
        {/* <div className="flex justify-center pt-4">
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
            </div> */}
        <div className="rounded-[20px] p-10 m-2 border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9]">
          <div className="rounded-[20px] bg-white p-3 md:p-5 shadow-sm border border-[#00000019]">
            <div className="space-y-2">
              {(() => {
                const fields = [
                  { label: 'COMPANY', value: leadData.customer_type },
                  { label: 'NAME', value: leadData.customer_name },
                  { label: 'EMAIL', value: leadData.email_address },
                  { label: 'ADDRESS', value: leadData.contact_address },
                  { label: 'CITY', value: leadData.city },
                  { label: 'CONTACT_NUMBER', value: leadData.contact_number },
                  {
                    label: 'CONTACT_JOB_ROLE',
                    value: leadData.contact_position,
                  },
                  { label: 'SOURCE', value: leadData.source },
                  { label: 'SALES_PERSON', value: leadData.salesperson_name },
                  { label: 'STAGE', value: leadData.stage },
                  { label: 'STATUS', value: leadData.status },
                ];

                return Array.from({ length: Math.ceil(fields.length / 2) }).map(
                  (_, rowIndex) => (
                    <div key={rowIndex}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {fields
                          .slice(rowIndex * 2, rowIndex * 2 + 2)
                          .map((field) => (
                            <div
                              key={field.label}
                              className="detail-title flex items-center justify-between py-3"
                            >
                              <span className="detail-title">
                                {field.label
                                  .split('_')
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1).toLowerCase(),
                                  )
                                  .join(' ')}
                                :
                              </span>
                              {field.label.toLowerCase().includes('status') ? (
                                <span className="text-[#000000B2] text-[16px] font-light inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                  {field.value ?? '-'}
                                </span>
                              ) : (
                                <span className="text-[#000000B2] text-[16px] font-light">
                                  {field.value ?? '-'}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                      {rowIndex < Math.ceil(fields.length / 2) - 1 && (
                        <hr className="border-[#00000019] mt-2" />
                      )}
                    </div>
                  ),
                );
              })()}

              {/* View Opportunity Button */}
              <div className="flex justify-center pt-4 mt-4 border-t border-[#00000019]">
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
      </div>
      {/* </div> */}
    </>
  );
};

export default DetailLead;
