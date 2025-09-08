import { ChevronRight, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import TitleValueRow from '../../components/TitleValueRow.js';

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
  const [opportunityData, setOpportunityData] = useState<Opportunity | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if opportunity data is passed via state or need to fetch from API
  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);

        // If full opportunity data is passed via state, use it
        if (location.state?.opportunity) {
          setOpportunityData(location.state.opportunity);
          setLoading(false);
          return;
        }

        // If only opportunity_id is provided in state, fetch from API
        if (location.state?.opportunity_id) {
          const response = await apiService.get(
            `/api/v1/opportunities/detailOpportunity/${location.state.opportunity_id}`,
            {},
          );

          if (response.data) {
            setOpportunityData(response.data[0]);
          } else {
            setError('Opportunity not found');
          }
        } else {
          setError('Opportunity ID is required');
        }
      } catch (err) {
        console.error('Error fetching opportunity details:', err);
        setError('Failed to fetch opportunity details');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityData();
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  if (error || !opportunityData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-red-500 text-lg">
          {error || 'Opportunity data not found'}
        </div>
      </div>
    );
  }

  const columnOrder = [
  "DESCRIPTION",
  "UOM",
  "INSTRUCTIONS",
  "QUANTITY",
  "PRICE",
  "AMOUNT",
  "CREATION_DATE",
  "CREATED_BY",
  "LAST_UPDATE_DATE",
  "LAST_UPDATED_BY",
];


  return (
    <div className="flex flex-col py-1 px-5 gap-6 bg-white rounded-[20px]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl mt-5 font-semibold text-black dark:text-white mb-2">
          Opportunity #{opportunityData.OPPORTUNITY_ID}
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
          <span className="text-[rgba(22,22,22,0.7)]">Opportunities</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[rgba(22,22,22,0.7)]">Detail</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#161616]">
            {opportunityData.OPPORTUNITY_ID}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded-[10px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        {/* <div className="space-y-3">
          {/* Lead ID */}
          {/* {opportunityData.LEAD_ID && (
            <TitleValueRow title="Lead ID" value={opportunityData.LEAD_ID} />
          )} */}

          {/* <TitleValueRow
            title="Opportunity ID"
            value={opportunityData.OPPORTUNITY_ID}
          />
          <hr className="custom-divider my-2" />
          <TitleValueRow
            title="Generation Date"
            value={opportunityData.GENERATION_DATE}
          />
          <hr className="custom-divider my-2" />
          <TitleValueRow title="Stage" value={opportunityData.STAGE} />
          <hr className="custom-divider my-2" />
          <TitleValueRow title="Status" value={opportunityData.STATUS} />
          <hr className="custom-divider my-2" />
          <TitleValueRow
            title="Sales Person"
            value={opportunityData.SALESPERSON_NAME}
          />
          <hr className="custom-divider my-2" />
          <TitleValueRow
            title="Remarks"
            value={opportunityData.REMARKS || 'N/A'}
          /> */}
        {/* </div> */} 
            <div className="rounded-[10px] bg-white p-3 md:p-5 shadow-sm border border-[#00000019]">
  <div className="space-y-2">
    {/* Create array of all fields */}
    {(() => {
      const fields = [
        opportunityData.LEAD_ID ? { label: "Lead ID", value: opportunityData.LEAD_ID } : null,
        { label: "Opportunity ID", value: opportunityData.OPPORTUNITY_ID },
        { label: "Generation Date", value: opportunityData.GENERATION_DATE },
        { label: "Stage", value: opportunityData.STAGE },
        { label: "Status", value: opportunityData.STATUS },
        { label: "Sales Person", value: opportunityData.SALESPERSON_NAME },
        { label: "Remarks", value: opportunityData.REMARKS || 'N/A' }
      ].filter((field): field is { label: string; value: string } => field !== null);

      return Array.from({ length: Math.ceil(fields.length / 2) }).map((_, rowIndex) => (
        <div key={rowIndex}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {fields.slice(rowIndex * 2, rowIndex * 2 + 2).map((field) => (
              <div key={field.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 md:py-3 space-y-1 sm:space-y-0">
                <span className="detail-title text-sm md:text-base font-medium">
                  {field.label}:
                </span>
                {field.label.toLowerCase().includes("status") ? (
                  <span className="text-[#000000B2] text-sm md:text-base font-normal inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 self-start sm:self-auto">
                    {field.value ?? "-"}
                  </span>
                ) : (
                  <span className="text-[#000000B2] text-sm md:text-base font-normal break-words">
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
    
        <div className="flex flex-col items-center pt-4 gap-3">
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

          <button
            onClick={() =>
              navigate(`/opportunities/convert`, {
                state: {
                  lead_id: opportunityData.LEAD_ID,
                  opportunity_id: opportunityData.OPPORTUNITY_ID,
                  opportunity_details: opportunityData.ORDER_LINES,
                },
              })
            }
            className="flex items-center gap-2 text-[#C32033] hover:text-[#A91B2E] font-medium transition-colors"
          >
            Convert to Sales Request
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Order Lines Section */}
      {opportunityData.ORDER_LINES && opportunityData.ORDER_LINES.length > 0 ? (
  <div className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
    <h2 className="text-xl font-semibold mb-4 text-[#C32033] dark:text-white">
      Order Items
    </h2>

    <div className="overflow-x-auto mt-5">
      <table className="w-full">
        <thead>
          <tr className="bg-[#C32033] shadow-lg text-white">
            <th className="px-6 py-4 text-left">No.</th>
            {columnOrder.map((key) => (
              <th key={key} className="px-6 py-4 text-left">
                {key
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {opportunityData.ORDER_LINES.map((line, index) => (
            <tr
              key={line.OPPORTUNITY_DETAIL_ID || index}
              className="hover:bg-[#f1f1f1] shadow-lg bg-white border-b-2 text-[#1e1e1e] border-b-[#eeeaea] transition-colors"
            >
              <td className="px-6 py-4">{index + 1}</td>

              {columnOrder.map((key) => (
                <td key={key} className="px-6 py-4">
                  {String(line[key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
) : (
  <p>No order lines available</p>
)}

      {/* {opportunityData.ORDER_LINES &&
        opportunityData.ORDER_LINES.length > 0 && (
          <div className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
            <h2 className="text-xl font-semibold mb-4 text-[#C32033] dark:text-white">
              Order Items
            </h2>
            <div className="space-y-4">
              {opportunityData.ORDER_LINES.map((line, index) => (
                <div
                  key={line.OPPORTUNITY_DETAIL_ID}
                  className="rounded-[20px] border border-stroke p-4 bg-white"
                >
                  <h3 className="font-semibold text-lg mb-3">
                    Item #{index + 1}
                  </h3>
                  <div className="space-y-2">
                    <TitleValueRow
                      title="Item Number"
                      value={line.ITEM_NUMBER}
                    />
                    <hr className="custom-divider my-2" />

                    <TitleValueRow
                      title="Item Detail"
                      value={line.ITEM_DETAIL}
                    />
                    <hr className="custom-divider my-2" />

                    <TitleValueRow title="Sub Category" value={line.SUB_CAT} />
                    <hr className="custom-divider my-2" />

                    <TitleValueRow
                      title="Description"
                      value={line.DESCRIPTION}
                    />
                    <hr className="custom-divider my-2" />

                    <TitleValueRow title="Quantity" value={line.QUANTITY} />
                    <hr className="custom-divider my-2" />

                    <TitleValueRow title="UOM" value={line.UOM} />
                    <hr className="custom-divider my-2" />

                    {line.INSTRUCTIONS && (
                      <TitleValueRow
                        title="Instructions"
                        value={line.INSTRUCTIONS}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

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
