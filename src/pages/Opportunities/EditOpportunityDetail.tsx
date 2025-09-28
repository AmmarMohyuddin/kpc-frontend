import { useState, useEffect } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../common/Loader';
import apiService from '../../services/ApiService';
import { customSelectStyles } from '../../styles/selectStyle.ts';

const EditOpportunityDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const opportunityDetail = location.state?.line;
  console.log('Location State:', location.state);
  console.log('Editing Opportunity Detail:', opportunityDetail);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [opportunityDetails, setOpportunityDetails] = useState({
    item_number: '',
    description: '',
    sub_category: '',
    unit_of_measure: '',
    order_quantity: 0,
    price: 0,
    line_amount: 0,
    instructions: '',
    requested_ship_date: '',
    status: 'Pending',
  });

  // Fetch Items for Select Dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiService.get('/api/v1/items/list', {});
        setItems(res.data || []);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pre-fill from location.state
  useEffect(() => {
    if (opportunityDetail) {
      setOpportunityDetails({
        item_number: opportunityDetail.ITEM_NUMBER || '',
        description: opportunityDetail.DESCRIPTION || '',
        sub_category: opportunityDetail.SUB_CAT || '',
        unit_of_measure: opportunityDetail.UOM || '',
        order_quantity: opportunityDetail.QUANTITY || 0,
        price: opportunityDetail.PRICE || 0,
        line_amount: opportunityDetail.AMOUNT || 0,
        instructions: opportunityDetail.INSTRUCTIONS || '',
        requested_ship_date: opportunityDetail.REQUESTED_SHIP_DATE || '',
        status: opportunityDetail.STATUS || 'Pending',
      });
    }
  }, [opportunityDetail]);

  // Handle input changes
  const handleDetailsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOpportunityDetails((prev) => ({
      ...prev,
      [name]: value,
      line_amount:
        name === 'order_quantity' || name === 'price'
          ? (name === 'order_quantity' ? Number(value) : prev.order_quantity) *
            (name === 'price' ? Number(value) : prev.price)
          : prev.line_amount,
    }));
  };

  // Handle price separately
  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setOpportunityDetails((prev) => ({
      ...prev,
      price: value,
      line_amount: prev.order_quantity * value,
    }));
  };

  // Item selection
  const handleItemNumberSelect = async (selectedOption: any) => {
    if (!selectedOption) return;

    setOpportunityDetails((prev) => ({
      ...prev,
      item_number: selectedOption.value,
    }));

    try {
      const [itemDetailRes, priceRes] = await Promise.all([
        apiService.get(`/api/v1/items/detail/${selectedOption.value}`, {}),
        apiService.get(`/api/v1/prices/detail/${selectedOption.value}`, {}),
      ]);

      const itemData = itemDetailRes.data[0];
      const priceData = priceRes.data;

      if (itemData) {
        setOpportunityDetails((prev) => ({
          ...prev,
          sub_category: itemData.sub_cat || '',
          description: itemData.description || '',
          unit_of_measure: itemData.unit_of_measure || '',
        }));
      }

      if (priceData && priceData.length > 0) {
        const basePrice = priceData[0].base_price || 0;
        setOpportunityDetails((prev) => ({
          ...prev,
          price: basePrice,
          line_amount: prev.order_quantity * basePrice,
        }));
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const itemsOptions = items.map((item: any) => ({
    value: item.item_number,
    label: item.item_detail,
  }));

  // Submit updated data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunityDetail?.OPPORTUNITY_ID) {
      toast.error('Missing Opportunity ID');
      return;
    }
    try {
      setLoading(true);
      // Adjust payload as your API expects (likely UPPERCASE keys)
      const payload = {
        opportunity_id: opportunityDetail.OPPORTUNITY_ID,
        opportunity_detail_id: opportunityDetail.OPPORTUNITY_DETAIL_ID,
        item_number: opportunityDetails.item_number,
        description: opportunityDetails.description,
        sub_category: opportunityDetails.sub_category,
        unit_of_measure: opportunityDetails.unit_of_measure,
        order_quantity: Number(opportunityDetails.order_quantity),
        price: Number(opportunityDetails.price),
        line_amount: Number(opportunityDetails.line_amount),
        instructions: opportunityDetails.instructions,
        requested_ship_date: opportunityDetails.requested_ship_date,
        status: opportunityDetails.status,
      };

      const response = await apiService.post(
        '/api/v1/opportunities/editOpportunity',
        payload,
      );
      console.log('Response:', response.status);
      if (response.status === 200) {
        toast.success('Opportunity updated!');
        navigate('/opportunities/listing', {
          state: { opportunity_id: opportunityDetail.OPPORTUNITY_ID },
        });
      } else {
        toast.error('Failed to update.');
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
          Edit Opportunity
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Item Number
                </label>
                <Select
                  name="item_number"
                  value={
                    itemsOptions.find(
                      (o) => o.value === opportunityDetails.item_number,
                    ) || null
                  }
                  onChange={handleItemNumberSelect}
                  options={itemsOptions}
                  placeholder="Select Item Number"
                  isSearchable
                  styles={customSelectStyles}
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  UOM
                </label>
                <input
                  type="text"
                  name="unit_of_measure"
                  readOnly
                  value={opportunityDetails.unit_of_measure}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="sub_category"
                  readOnly
                  value={opportunityDetails.sub_category}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={opportunityDetails.price}
                  onChange={handlePrice}
                  min={0}
                  step="any"
                  placeholder="Enter Price"
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-1">
                  Line Amount
                </label>
                <input
                  type="number"
                  name="line_amount"
                  step="any"
                  value={opportunityDetails.line_amount}
                  readOnly
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  readOnly
                  value={opportunityDetails.description}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="instructions"
                  value={opportunityDetails.instructions}
                  onChange={handleDetailsInputChange}
                  placeholder="Enter Instructions"
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Order Quantity
                </label>
                <input
                  type="number"
                  name="order_quantity"
                  value={opportunityDetails.order_quantity}
                  onChange={handleDetailsInputChange}
                  min={0}
                  placeholder="Enter Order Quantity"
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Requested Shipment Date
                </label>
                <input
                  type="date"
                  name="requested_ship_date"
                  value={opportunityDetails.requested_ship_date}
                  onChange={handleDetailsInputChange}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={opportunityDetails.status}
                  readOnly
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() =>
                navigate('/opportunities/listing', {
                  state: { opportunity_id: opportunityDetail.OPPORTUNITY_ID },
                })
              }
              className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[160px] h-[50px] rounded bg-[#C32033] text-md font-medium text-white hover:bg-[#A91B2E] transition-colors"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunityDetail;
