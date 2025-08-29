import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Follow Up #{followupData.followup_id}
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
          <span>Leads</span>
          <ChevronRight className="w-4 h-4" />
          <span>Follow Up</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">{followupData.followup_id}</span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="space-y-6">
          {/* Follow Up ID */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Follow Up ID:
            </span>
            <span>{followupData.followup_id}</span>
          </div>

          {/* Source */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Source:
            </span>
            <span>{followupData.source}</span>
          </div>

          {/* Opportunity ID */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Opportunity ID:
            </span>
            <span>{followupData.opportunity_id}</span>
          </div>

          {/* Follow Up Date */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Follow Up Date:
            </span>
            <span>
              {followupData.followup_date
                ? new Date(followupData.followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'}
            </span>
          </div>

          {/* Next Follow Up Date */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Next Follow Up Date:
            </span>
            <span>
              {followupData.next_followup_date
                ? new Date(followupData.next_followup_date).toLocaleDateString(
                    'en-GB',
                  )
                : 'N/A'}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Status:
            </span>
            <span>{followupData.status}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Comments:
            </span>
            <span>{followupData.comments}</span>
          </div>

          {/* Assigned To */}
          <div className="flex items-center justify-between py-1">
            <span className="font-bold text-lg text-black dark:text-white">
              Assigned To:
            </span>
            <span>{followupData.assigned_to}</span>
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
