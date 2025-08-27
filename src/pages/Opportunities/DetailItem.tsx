import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface OpportunityLine {
  OPPORTUNITY_DETAIL_ID: number;
  OPPORTUNITY_ID: number;
  ITEM_ID: number;
  DESCRIPTION: string;
  UOM: string;
  INSTRUCTIONS?: string;
  QUANTITY: number;
  PRICE: number;
  AMOUNT: number;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
}

const DetailItem = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // line passed via navigate state
  const line: OpportunityLine | undefined = location.state?.line;

  if (!line) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <div className="text-red-500 text-lg">Line item data not found</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#C32033] text-white rounded hover:bg-[#A91B2E] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const detailFields = [
    { label: 'Opportunity Detail ID', value: line.OPPORTUNITY_DETAIL_ID },
    { label: 'Opportunity ID', value: line.OPPORTUNITY_ID },
    { label: 'Item ID', value: line.ITEM_ID },
    { label: 'Description', value: line.DESCRIPTION },
    { label: 'Quantity', value: line.QUANTITY },
    { label: 'UOM', value: line.UOM },
    line.INSTRUCTIONS
      ? { label: 'Instructions', value: line.INSTRUCTIONS }
      : null,
    { label: 'Price', value: `${line.PRICE} KWD` },
    { label: 'Amount', value: `${line.AMOUNT} KWD` },
    { label: 'Created By', value: line.CREATED_BY },
    { label: 'Creation Date', value: line.CREATION_DATE },
    { label: 'Last Updated By', value: line.LAST_UPDATED_BY },
    { label: 'Last Update Date', value: line.LAST_UPDATE_DATE },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Page Header */}
      <div className="animate-slideDown">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Line #{line.OPPORTUNITY_DETAIL_ID} Details
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Opportunities</span>
          <ChevronRight className="w-4 h-4" />
          <span>Order Line</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033] font-medium">
            {line.OPPORTUNITY_DETAIL_ID}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default animate-slideUp dark:border-strokedark dark:bg-boxdark">
        <h2 className="text-xl font-semibold mb-4 text-[#C32033] dark:text-white">
          Item Details
        </h2>

        <div className="space-y-4">
          {detailFields.map((field) => (
            <div
              key={field!.label}
              className="flex items-center justify-between pb-2"
            >
              <span className="font-bold text-lg text-black dark:text-white">
                {field!.label}:
              </span>
              <span className="text-black dark:text-gray-300 text-right">
                {field!.value || '-'}
              </span>
            </div>
          ))}
        </div>

        {/* Back Button */}
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
  );
};

export default DetailItem;
