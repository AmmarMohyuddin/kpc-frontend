import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import TitleValueRow from "../../components/TitleValueRow.js";
import React from "react";


interface OrderLine {
  ORDER_LINE_ID: number;
  ORDER_HEADER_ID: number;
  INVENTORY_ITEM_ID: number;
  ITEM_NUMBER: string;
  DESCRIPTION: string;
  UOM: string;
  ORDER_QUANTITY: number;
  PRICE: number;
  AMOUNT: number;
  LINE_STATUS: string;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
  PAYMENT_TERM: string;
  REQUESTED_SHIP_DATE: string;
  INSTRUCTIONS: string;
}

interface SalesRequest {
  ORDER_HEADER_ID: number;
  OPPORTUNITY_ID: number | null;
  ORDER_NUMBER: string;
  ORDER_DATE: string;
  ORDER_CURRENCY: string;
  BUSINESS_UNIT: string;
  CUSTOMER_NAME: string;
  CUSTOMER_NUMBER: string;
  CUSTOMER_ACCOUNT_NAME: string | null;
  CUSTOMER_ACCOUNT_NUMBER: string;
  ACCOUNT_STATUS: string | null;
  SITE_NUMBER: string | null;
  SITE_NAME: string | null;
  SITE_ID: number;
  APPROVAL_STATUS: string;
  ORDER_STATUS: string;
  SALESPERSON: string;
  PAYMENT_TERM: string;
  CREDIT_LIMIT: number | null;
  CREATION_DATE: string;
  CREATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATED_BY: string;
  TOTAL_AMOUNT: number;
  INTERFACED: string;
  FUSION_FLAG: string;
  CUSTOMER_PO_NUMBER: string;
  ADDRESS_LINE_1: string;
  SITE_USE_ID: number;
  CUSTOMER_CITY: string;
  CUSTOMER_BLOCK: string;
  CUSTOMER_ADDRESS: string;
  CONTACT_PERSON: string;
  CONTACT_NUMBER: number;
  FUSION_SALES_ORDER_NUM: string | null;
  ORDER_LINES: OrderLine[];
}

const DetailSalesRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order_header_id } = location.state || {};
  console.log(
    'Navigated to DetailSalesRequest with order_header_id:',
    order_header_id,
  );
  console.log('Order Header ID:', order_header_id);
  const [salesRequest, setSalesRequest] = useState<SalesRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.post(
          '/api/v1/salesRequests/detail-sales-request',
          { order_header_id },
        );
        console.log(
          'Sales request details fetched successfully:',
          response.data,
        );
        if (response?.status === 200) {
          setSalesRequest(response.data);
        } else {
          setError('Failed to load sales request details');
          console.error('Failed to fetch sales request details:', response);
        }
      } catch (error) {
        setError('Error loading sales request details');
        console.error('Error fetching sales request details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (order_header_id) {
      fetchSalesRequestDetails();
    } else {
      setError('Order header ID is missing');
      setLoading(false);
    }
  }, [order_header_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  if (error || !salesRequest) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <div className="text-red-500 text-lg">
          {error || 'Sales request not found'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#C32033] text-white rounded hover:bg-[#A91B2E] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const excludeHeaderFields = [
    'ORDER_HEADER_ID',
    'OPPORTUNITY_ID',
    'CREATED_BY',
    'CUSTOMER_ACCOUNT_NAME',
    'LAST_UPDATED_BY',
    'INTERFACED',
    'SITE_NUMBER',
    'CREDIT_LIMIT',
    'ORDER_LINES',
    'CUSTOMER_ID',
    'SALESPERSON_ID',
    'SALESPERSON_NAME',
    'SITE_NAME',
    'FUSION_FLAG',
    'FUSION_SALES_ORDER_NUM',
    'SITE_USE_ID',
    'SITE_ID',
  ];

  const excludeLineFields = [
    'ORDER_HEADER_ID',
    'ORDER_LINE_ID',
    'INVENTORY_ITEM_ID',
    'LAST_UPDATED_BY',
    'CREATED_BY',
  ];

  const headerFields = Object.entries(salesRequest)
    .filter(([key]) => !excludeHeaderFields.includes(key))
    .map(([key, value]) => ({
      label: key.replace(/_/g, ' '),
      value: value ?? '-',
    }));

  return (
    <div className="flex flex-col py-1 px-5 gap-6 bg-white rounded-[20px]">
      {/* Page Header */}
      <div className="animate-slideDown">
        <h1 className="text-[#161616] mt-5 mb-2 text-[24px] font-semibold">
          Sales Request {salesRequest.ORDER_NUMBER} Details
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md mt-0">
          <span className="text-[rgba(22,22,22,0.7)]">Sales Request</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[rgba(22,22,22,0.7)]">Detail</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#161616]">
            {salesRequest.ORDER_NUMBER}
          </span>
        </div>
      </div>

      {/* Header Details */}
      <div className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        <h2 className="text-xl text-[#C32033] font-semibold mb-4 text-center">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {headerFields.map((field) => (
            <React.Fragment key={field.label}>
              <TitleValueRow title={field.label
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())} value={String(field.value)} />
              <hr className="custom-divider my-2" />
            </React.Fragment>
          ))}
        </div>
        {/* {headerFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between py-1 border-b border-gray"
            >
              <span className="font-bold text-md text-black dark:text-white">
                {field.label}:
              </span>
              <span className="text-black dark:text-gray-300">
                {String(field.value)}
              </span>
            </div>
          ))} */}
      </div>
      {/* </div> */}

      {/* Line Items */}
      <div className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        <h2 className="text-xl text-[#C32033] font-semibold mb-4">
          Order Lines
        </h2>
        {salesRequest.ORDER_LINES.length > 0 ? (
          <div className="space-y-6">
            {salesRequest.ORDER_LINES.map((line, index) => (
              <div
                key={line.ORDER_LINE_ID}
                className="p-4 border rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5"
              >
                
<h3 className="font-semibold mb-2 text-center">
                  Line {index + 1} - {line.ITEM_NUMBER}
                </h3>
                                        <hr className="custom-divider my-2" />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                  {Object.entries(line)
                    .filter(([key]) => !excludeLineFields.includes(key))
                    .map(([key, value]) => (
                      <React.Fragment key={key}>
                       <TitleValueRow
  key={key}
  title={key
    .replace(/_/g, " ")               // replace underscores with spaces
    .toLowerCase()                    // convert whole string to lowercase
    .replace(/\b\w/g, (c) => c.toUpperCase())} // capitalize each word
  value={String(value ?? "-")}
/>

                        <hr className="custom-divider my-2" />

                      </React.Fragment>



                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No order lines available</p>
        )}
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

export default DetailSalesRequest;
