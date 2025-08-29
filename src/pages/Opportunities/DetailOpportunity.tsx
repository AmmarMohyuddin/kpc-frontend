import { ChevronRight, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Opportunity {
  OPPORTUNITY_ID: number;
  LEAD_ID: number | null;
  GENERATION_DATE: string;
  STAGE: string;
  AMOUNT: number;
  CLOSE_DATE: string;
  STATUS_ID: number;
  STATUS: string;
  REMARKS: string;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
  SALESPERSON_NAME: string;
  LEAD_NUMBER: number | null;
  ORDER_LINES: Array<{
    OPPORTUNITY_DETAIL_ID: number;
    OPPORTUNITY_ID: number;
    ITEM_ID: number;
    DESCRIPTION: string;
    UOM: string;
    INSTRUCTIONS: string;
    QUANTITY: number;
    PRICE: number;
    AMOUNT: number;
    SUB_CAT: string;
    ITEM_DETAIL: string;
    ITEM_NUMBER: string;
    CREATION_DATE: string;
    CREATED_BY: string;
    LAST_UPDATE_DATE: string;
    LAST_UPDATED_BY: string;
  }>;
}

const DetailOpportunity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const opportunityData: Opportunity = location.state?.opportunity;
  console.log('Opportunity Data:', opportunityData);

  if (!opportunityData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-red-500 text-lg">Opportunity data not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Opportunity #{opportunityData.OPPORTUNITY_ID}
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
          <span>Opportunities</span>
          <ChevronRight className="w-4 h-4" />
          <span>Detail</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">
            {opportunityData.OPPORTUNITY_ID}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="space-y-6">
          {/* Opportunity ID */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Opportunity ID:
            </span>
            <span>{opportunityData.OPPORTUNITY_ID}</span>
          </div>

          {/* Generation Date */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Generation Date:
            </span>
            <span>{opportunityData.GENERATION_DATE}</span>
          </div>

          {/* Stage */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Stage:
            </span>
            <span>{opportunityData.STAGE}</span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Status:
            </span>
            <span>{opportunityData.STATUS}</span>
          </div>

          {/* Sales Person */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Sales Person:
            </span>
            <span>{opportunityData.SALESPERSON_NAME}</span>
          </div>

          {/* Remarks */}
          <div className="flex items-center justify-between py-1 border-b border-gray">
            <span className="font-bold text-lg text-black dark:text-white">
              Remarks:
            </span>
            <span>{opportunityData.REMARKS || 'N/A'}</span>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button
            onClick={() =>
              navigate(`/opportunities/follow-up`, {
                state: { opportunity_id: opportunityData.OPPORTUNITY_ID },
              })
            }
            className="flex items-center gap-2 text-[#C32033] hover:text-[#A91B2E] font-medium transition-colors"
          >
            Follow Up
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Order Lines Section */}
      {opportunityData.ORDER_LINES &&
        opportunityData.ORDER_LINES.length > 0 && (
          <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default">
            <h2 className="text-xl font-semibold mb-4 text-[#C32033] dark:text-white">
              Order Items
            </h2>
            <div className="space-y-4">
              {opportunityData.ORDER_LINES.map((line, index) => (
                <div
                  key={line.OPPORTUNITY_DETAIL_ID}
                  className="rounded-lg border border-stroke p-4"
                >
                  <h3 className="font-semibold text-lg mb-3">
                    Item #{index + 1}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        Item Number:
                      </span>
                      <span>{line.ITEM_NUMBER}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        Item Detail:
                      </span>
                      <span>{line.ITEM_DETAIL}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        Sub Category:
                      </span>
                      <span>{line.SUB_CAT}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        Description:
                      </span>
                      <span>{line.DESCRIPTION}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        Quantity:
                      </span>
                      <span>{line.QUANTITY}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-gray">
                      <span className="font-bold text-black dark:text-white">
                        UOM:
                      </span>
                      <span>{line.UOM}</span>
                    </div>

                    {line.INSTRUCTIONS && (
                      <div className="flex items-center justify-between py-1 border-b border-gray">
                        <span className="font-bold text-black dark:text-white">
                          Instructions:
                        </span>
                        <span>{line.INSTRUCTIONS}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

export default DetailOpportunity;
