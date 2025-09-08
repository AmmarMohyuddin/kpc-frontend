import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TitleValueRow from '../../components/TitleValueRow.js';

const DetailFollowUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const followupData = location.state?.followup;
  console.log('Follow Up Data:', followupData);

  if (!followupData) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-red-500">
          No Follow Up Data Found
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-1 px-5 gap-6 bg-white rounded-[20px]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl mt-5 font-semibold text-black dark:text-white mb-2">
          Follow Up #{followupData.followup_id}
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
          <span className="text-[rgba(22,22,22,0.7)]">Leads</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[rgba(22,22,22,0.7)]">Follow Up</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#161616]">
            Entry Details # {followupData.followup_id}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      {/* <div className="rounded-[10px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        <div className="space-y-3">
          {/* Follow Up ID */}
      {/* <TitleValueRow
            title="Follow Up ID"
            value={followupData.followup_id}
          />
          <hr className="custom-divider my-2" />

          {/* Source */}
      {/* <TitleValueRow title="Source" value={followupData.source} />
          <hr className="custom-divider my-2" /> */}

      {/* Lead ID */}
      {/* <TitleValueRow title="Lead ID" value={followupData.lead_id} />
          <hr className="custom-divider my-2" /> */}

      {/* Follow Up Date */}
      {/* <TitleValueRow
            title="Follow Up Date"
            value={
              followupData.followup_date
                ? new Date(followupData.followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'
            }
          />
          <hr className="custom-divider my-2" /> */}

      {/* Next Follow Up Date */}
      {/* <TitleValueRow
            title="Next Follow Up Date"
            value={
              followupData.next_followup_date
                ? new Date(followupData.next_followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'
            } */}
      {/* /> */}
      {/* <hr className="custom-divider my-2" /> */}

      {/* Status */}
      {/* <TitleValueRow title="Status" value={followupData.status} /> */}
      {/* <hr className="custom-divider my-2" /> */}

      {/* Comments */}
      {/* <TitleValueRow title="Comments" value={followupData.comments} /> */}
      {/* <hr className="custom-divider my-2" /> */}

      {/* Assigned To */}
      {/* <TitleValueRow title="Assigned To" value={followupData.assigned_to} />  */}
      {/* </div> */}
      {/* // </div> */}
      <div className='rounded-[20px] p-10 border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9]'>
      <div className="rounded-[20px] bg-white p-5 md:p-5 shadow-sm border border-[#00000019]">
        <div className="space-y-2">
          {(() => {
            const fields = [
              { label: "FOLLOW_UP_ID", value: followupData.followup_id },
              { label: "SOURCE", value: followupData.source },
              { label: "LEAD_ID", value: followupData.lead_id },
              {
                label: "FOLLOW_UP_DATE",
                value: followupData.followup_date
                  ? new Date(followupData.followup_date).toLocaleDateString('en-GB')
                  : 'N/A'
              },
              {
                label: "NEXT_FOLLOW_UP_DATE",
                value: followupData.next_followup_date
                  ? new Date(followupData.next_followup_date).toLocaleDateString('en-GB')
                  : 'N/A'
              },
              { label: "STATUS", value: followupData.status },
              { label: "COMMENTS", value: followupData.comments },
              { label: "ASSIGNED_TO", value: followupData.assigned_to }
            ];

            return Array.from({ length: Math.ceil(fields.length / 2) }).map((_, rowIndex) => (
              <div key={rowIndex}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {fields.slice(rowIndex * 2, rowIndex * 2 + 2).map((field) => (
                    <div key={field.label} className="detail-title flex items-center justify-between py-3">
                      <span className="detail-title">
                        {field.label
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ')
                        }:
                      </span>
                      {field.label.toLowerCase().includes("status") ? (
                        <span className="text-[#000000B2] text-[16px] font-light inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                          {field.value ?? "-"}
                        </span>
                      ) : (
                        <span className="text-[#000000B2] text-[16px] font-light">
                          {field.value ?? "-"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {rowIndex < Math.ceil(fields.length / 2) - 1 && (
                  <hr className="border-[#00000019] mt-2" />
                )}
              </div>
            ));
          })()}
        </div>
      </div>
      </div>

      {/* Back Button */}
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
  );
};

export default DetailFollowUp;
