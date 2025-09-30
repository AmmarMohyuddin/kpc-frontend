import { ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import toast from 'react-hot-toast';

interface AddressFormData {
  name: string;
  city: string;
  contactNumber: string;
  block: string;
  shippingAddress: string;
}

interface OptionType {
  value: string;
  label: string;
}

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '50px',
    height: '50px',
    borderColor: state.isFocused ? '#C32033' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #C32033' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? '#C32033' : provided.borderColor,
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '50px',
    padding: '0 8px',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor:
      state.isFocused || state.isSelected
        ? '#FFD7D7'
        : provided.backgroundColor,
    color: '#000',
    '&:active': { backgroundColor: '#FFD7D7' },
  }),
  singleValue: (provided: any) => ({ ...provided, color: '#C32033' }),
};

const ConfirmAddress = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log('ConfirmAddress State:', state);
  const customer_id = state?.customer_id;
  const lead_id = state?.lead_id;
  const opportunity_id = state?.opportunity_id;
  const opportunity_details = state?.opportunity_details;
  const customer_details = state?.customer_details;

  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [blockOptions, setBlockOptions] = useState<OptionType[]>([]);
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    name: '',
    city: '',
    contactNumber: '',
    block: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof AddressFormData, value: string) => {
      setAddressFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Fetch cities & blocks
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!customer_id) return;

      setLoading(true);
      try {
        const [cities, blocks] = await Promise.all([
          apiService.get('/api/v1/cities/list', {}),
          apiService.get('/api/v1/blocks/list', {}),
        ]);

        setCityOptions(mapToOptions(cities.data));
        setBlockOptions(mapToOptions(blocks.data));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [customer_id]);

  // Map API data to select options
  const mapToOptions = (data: any[]): OptionType[] =>
    Array.isArray(data)
      ? data.map((item) => ({ value: item.name, label: item.name }))
      : [];

  // Handle confirm button
  const handleConfirm = async () => {
    try {
      setLoading(true); // show loader

      const saveData = {
        lead_id,
        opportunity_id,
        opportunity_details,
        customer_details,
        address_details: addressFormData,
        order_status: 'Pending',
      };

      console.log('Saving data:', saveData);

      const response = await apiService.post(
        '/api/v1/opportunities/convertToSales',
        saveData,
      );

      if (response?.status === 201) {
        toast.success('Sales request created successfully from opportunity');
        navigate('/sales-request/manage');
      } else {
        console.error('Failed to create sales request:', response);
        toast.error('Failed to create sales request.');
      }
    } catch (error) {
      console.error('Error creating sales request:', error);
      toast.error('Failed to create sales request.');
    } finally {
      setLoading(false); // hide loader
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  const isFormValid = () =>
    addressFormData.name &&
    addressFormData.city &&
    addressFormData.contactNumber &&
    addressFormData.block &&
    addressFormData.shippingAddress;

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
          New Order
        </h2>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mt-5">
          <span>Sales Requests</span>
          <ChevronRight className="w-4 h-4" />
          <span>Items</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">Confirm Address</span>
        </div>

        <h1 className="text-xl font-bold mt-5">Confirm Address</h1>

        <form className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label className="block text-md text-black font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={addressFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter Name"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-md text-black font-medium mb-2">
                  City
                </label>
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (opt) => opt.value === addressFormData.city,
                    ) || null
                  }
                  onChange={(opt) =>
                    handleInputChange('city', opt?.value || '')
                  }
                  isSearchable
                  styles={customSelectStyles}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label className="block text-md text-black font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={addressFormData.contactNumber}
                  onChange={(e) =>
                    handleInputChange('contactNumber', e.target.value)
                  }
                  placeholder="Enter Contact Number"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-md text-black font-medium mb-2">
                  Block
                </label>
                <Select
                  options={blockOptions}
                  value={
                    blockOptions.find(
                      (opt) => opt.value === addressFormData.block,
                    ) || null
                  }
                  onChange={(opt) =>
                    handleInputChange('block', opt?.value || '')
                  }
                  isSearchable
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-md text-black font-medium mb-2">
              Shipping Address
            </label>
            <textarea
              rows={4}
              value={addressFormData.shippingAddress}
              onChange={(e) =>
                handleInputChange('shippingAddress', e.target.value)
              }
              placeholder="Enter Shipping Address"
              className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-gray-50"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-15 py-3 rounded-lg font-medium transition-colors 
                ${
                  isFormValid()
                    ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
                    : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
                }
              `}
              disabled={!isFormValid()}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmAddress;
