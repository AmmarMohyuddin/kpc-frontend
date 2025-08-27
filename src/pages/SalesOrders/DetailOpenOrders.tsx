import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Page Header */}
      <div className="animate-slideDown">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Open Order - {order.order_no} Details
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Sales Orders</span>
          <ChevronRight className="w-4 h-4" />
          <span>Open Orders</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033] font-medium">{order.order_no}</span>
        </div>
      </div>

      {/* Header Information */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default animate-slideUp">
        <h2 className="text-xl text-[#C32033] font-semibold mb-4">
          Header Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <b>Order Number:</b> {order.order_no}
          </div>
        </div>
      </div>

      {/* Order Lines */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default animate-slideUp">
        <h2 className="text-xl text-[#C32033] font-semibold mb-4">
          Order Lines
        </h2>
        {order.lines && order.lines.length > 0 ? (
          <div className="space-y-6">
            {order.lines.map((line: any, index: number) => (
              <div
                key={line.order_line_id || index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold mb-2">
                  Line {index + 1} - {line.item_code}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {Object.entries(line).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-1 border-b border-gray"
                    >
                      <span className="font-bold text-lg !capitalize text-black dark:text-white">
                        {key.replace(/_/g, ' ')}:
                      </span>{' '}
                      {String(value)}
                    </div>
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

export default DetailOrderOrders;
