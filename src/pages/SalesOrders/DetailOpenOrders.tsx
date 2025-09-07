import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TitleValueRow from "../../components/TitleValueRow.js";
import React from 'react';

const DetailOrderOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order_no } = useParams();
  const { order } = location.state || {};

  console.log('Order', order);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <div className="text-red-500 text-lg">
          {`No data found for Order #${order_no}`}
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
  const columnOrder = [
    "CUSTOMER_NAME",
    "ACCOUNT_NUMBER",
    "ORDER_DATE",
    "ITEM",
    "ITEM_DESCRIPTION",
    "SALESPERSON_NAME",
    "ORDERED_UOM",
    "ERP_DELIVERY_DATE",
    "UNIT_LIST_PRICE",
    "ORDERED_QTY",
    "DELIVERED_QTY",
    "BALANCE_QTY",
  ];


  return (
    <div className="flex flex-col py-1 px-5 gap-6 bg-white rounded-[20px]">
      {/* Page Header */}
      <div className="animate-slideDown">
        <h1 className="text-[#161616] mt-5 mb-3 text-[24px] font-semibold">
          Open Order - {order.order_no} Details
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600">
          <span className="text-[rgba(22,22,22,0.7)]">Sales Orders</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[rgba(22,22,22,0.7)]">Open Orders</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#161616]">{order.order_no}</span>
        </div>
      </div>

      {/* Header Information */}
      <div className="rounded-[20px] border border-stroke  bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default animate-slideUp">
        {/* <h2 className="text-xl text-[#C32033] font-semibold mb-4">
          Header Information
        </h2> */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <span className="text-xl text-[#C32033] font-semibold text-center">Order Number:</span>
            <span>{order.order_no}</span>
          </div>
        </div>
      </div>

      {/* Order Lines */}
      <div className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-[#F9F9F9] px-5 pt-6 pb-6 shadow-default sm:px-7.5">
        <h2 className="text-xl text-[#C32033] font-semibold mb-4 text-center">
          Order Lines
        </h2>
        {order.lines && order.lines.length > 0 ? (
          <div className="overflow-x-auto mt-5">
            <table className="w-full">
              <thead>
                <tr className="bg-[#C32033] shadow-lg text-white">
                  <th className="px-4 py-2 text-left">No.</th>
                  {columnOrder.map((key) => (
                    <th key={key} className="px-4 py-2 text-left">
                      {key
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line: any, index: number) => (
                  <tr
                    key={line.ORDER_LINE_ID || index}
                    className="hover:bg-[#f1f1f1] shadow-lg bg-red-100 border-b text-[#1e1e1e] border-b-[#eeeaea] transition-colors"
                  >
                    <td className="px-4 py-2">{index + 1}</td>

                    {columnOrder.map((key) => (
                      <td key={key} className="px-4 py-2">
                        {/* Format specific fields */}
                        {key.includes("DATE") && line[key]
                          ? new Date(line[key]).toLocaleDateString("en-GB")
                          : key.includes("PRICE") || key.includes("AMOUNT")
                            ? Number(line[key] || 0).toFixed(2)
                            : String(line[key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No order lines available</p>
        )}
        {/* {order.lines && order.lines.length > 0 ? (
          <div className="space-y-2">            {
            order.lines.map((line: any, index: number) => (
              <div
                key={line.order_line_id || index}
                className="rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-white px-5 pt-6 pb-6 shadow-default sm:px-7.5"
              >
                <h3 className="font-semibold mb-6">                  Line {index + 1} - {line.item_code}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  {Object.entries(line).map(([key, value], index, arr) => (
                    <React.Fragment key={key}>
                      <TitleValueRow
                        title={key
                          .replace(/_/g, " ")                // replace underscores
                          .toLowerCase()                     // lowercase first
                          .replace(/\b\w/g, (c) => c.toUpperCase())} // Title Case
                        value={String(value ?? "-")}
                      />
                      {index < arr.length - 1 && (
                        <hr className="custom-divider my-2" />
                      )}
                    </React.Fragment>
                  ))}
                  {/* {Object.entries(line).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1 border-b border-gray"
                    >
                      <span className="font-bold text-lg !capitalize text-black dark:text-white">
                        {key.replace(/_/g, ' ')}:
                      </span>{' '}
                      {String(value)}
                    </div>
                  ))} */}
        {/* </div> */}
        {/* </div> */}
        {/* ))} */}
        {/* </div> */}
        {/* ) : ( */}
        {/* <p>No order lines available</p> */}
        {/* )} */}
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

export default DetailOrderOrders;
