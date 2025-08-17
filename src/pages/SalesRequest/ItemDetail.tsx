import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface SalesItem {
  item_detail: string;
  item_number: string;
  unit_of_measure: string;
  sub_category: string;
  description: string;
  instructions: string;
  order_quantity: number;
  price: number;
  line_amount: number;
}

const DetailItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item_number, customer_id } = location.state || {};
  const [itemData, setItemData] = useState<SalesItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!item_number) {
        setError('Item number not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.post(
          '/api/v1/salesRequests/item-detail',
          { item_number, customer_id },
        );

        if (response?.status === 200) {
          setItemData(response.data);
        } else {
          setError('Failed to load item details');
          console.error('Failed to fetch item details:', response);
        }
      } catch (error) {
        setError('Error loading item details');
        console.error('Error fetching item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [item_number, customer_id]);

  const detailFields = [
    { label: 'Item Number', value: itemData?.item_number },
    { label: 'Item Detail', value: itemData?.item_detail },
    { label: 'Unit of Measure', value: itemData?.unit_of_measure },
    { label: 'Sub Category', value: itemData?.sub_category },
    { label: 'Description', value: itemData?.description },
    { label: 'Order Quantity', value: itemData?.order_quantity },
    { label: 'Price', value: itemData?.price ? `${itemData.price} KWD` : null },
    {
      label: 'Line Amount',
      value: itemData?.line_amount ? `${itemData.line_amount} KWD` : null,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  if (error || !itemData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
        <div className="text-red-500 text-lg">{error || 'Item not found'}</div>
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
          {itemData.item_number} Details
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Sales Request</span>
          <ChevronRight className="w-4 h-4" />
          <span>Detail</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033] font-medium">
            {itemData.item_number}
          </span>
        </div>
      </div>

      {/* Detail Card */}
      <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default animate-slideUp">
        <div className="space-y-6">
          {detailFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between py-2"
            >
              <span className="font-bold text-lg text-black dark:text-white">
                {field.label}:
              </span>
              <span className="text-black dark:text-gray-300">
                {field.value || '-'}
              </span>
            </div>
          ))}
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
    </div>
  );
};

export default DetailItem;
