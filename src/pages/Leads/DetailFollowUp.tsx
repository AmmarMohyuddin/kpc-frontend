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
      <div className="rounded-[10px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        <div className="space-y-3">
          {/* Follow Up ID */}
          <TitleValueRow
            title="Follow Up ID"
            value={followupData.followup_id}
          />
          <hr className="custom-divider my-2" />

          {/* Source */}
          <TitleValueRow title="Source" value={followupData.source} />
          <hr className="custom-divider my-2" />

          {/* Lead ID */}
          <TitleValueRow title="Lead ID" value={followupData.lead_id} />
          <hr className="custom-divider my-2" />

          {/* Follow Up Date */}
          <TitleValueRow
            title="Follow Up Date"
            value={
              followupData.followup_date
                ? new Date(followupData.followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'
            }
          />
          <hr className="custom-divider my-2" />

          {/* Next Follow Up Date */}
          <TitleValueRow
            title="Next Follow Up Date"
            value={
              followupData.next_followup_date
                ? new Date(followupData.next_followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'
            }
          />
          <hr className="custom-divider my-2" />

          {/* Status */}
          <TitleValueRow title="Status" value={followupData.status} />
          <hr className="custom-divider my-2" />

          {/* Comments */}
          <TitleValueRow title="Comments" value={followupData.comments} />
          <hr className="custom-divider my-2" />

          {/* Assigned To */}
          <TitleValueRow title="Assigned To" value={followupData.assigned_to} />
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
