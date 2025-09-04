import { useState, useMemo, useEffect, useCallback } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import { customSelectStyles } from "../../styles/selectStyle.ts";


interface OptionType {
  value: string;
  label: string;
}

interface OpportunityHeader {
  lead_id: string;
  generation_date: string;
  close_date: string;
  status_id: number;
  salesperson_id: string;
  salesperson_name: string;
  remarks: string;
  order_lines: OpportunityDetails[];
}

interface OpportunityDetails {
  item_number: string;
  item_detail: string;
  sub_category: string;
  description: string;
  unit_of_measure: string;
  order_quantity: number;
  price: number;
  line_amount: number;
  instructions: string;
  requested_ship_date: string;
}

interface ItemDetail {
  unit_of_measure: string;
  sub_cat: string;
  description: string;
  base_price?: number;
}

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(
    location.state?.step || 1, // 👈 default is 1, but will be 2 if passed
  ); // 1: Header, 2: Details
  const opportunityId = location.state?.opportunityId || null;
  const lead_id = location.state?.lead_id || null;
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [price, setPrice] = useState<number>(0);

  const [opportunityHeader, setOpportunityHeader] = useState<OpportunityHeader>(
    {
      lead_id: lead_id ? lead_id : '',
      generation_date: new Date().toISOString().split('T')[0],
      close_date: new Date().toISOString().split('T')[0],
      status_id: 0,
      salesperson_id: '',
      salesperson_name: '',
      remarks: '',
      order_lines: [],
    },
  );

  const [opportunityDetails, setOpportunityDetails] =
    useState<OpportunityDetails>({
      item_number: '',
      item_detail: '',
      sub_category: '',
      description: '',
      unit_of_measure: '',
      order_quantity: 0,
      price: 0,
      line_amount: 0,
      instructions: '',
      requested_ship_date: new Date().toISOString().split('T')[0],
    });

  console.log('Opportunity Header:', opportunityHeader);
  console.log('Opportunity Details:', opportunityDetails);

  // Status options
  const statusOptions: OptionType[] = [{ value: '1', label: 'Open' }];

  const itemsOptions = items.map((item: any) => ({
    value: item.item_number,
    label: item.item_detail,
  }));

  // Fetch sales persons and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesPersonsRes, itemsRes] = await Promise.all([
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get('/api/v1/items/list', {}),
        ]);
        setSalesPersons(salesPersonsRes.data || []);
        setItems(itemsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Logged in user
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  // Filter salesperson options
  const salesPersonOptions = useMemo(() => {
    return salesPersons
      .filter(
        (person: any) => person.employee_number === loggedInUser.person_number,
      )
      .map((person: any) => ({
        value: person._id,
        label: person.salesperson_name,
      }));
  }, [salesPersons, loggedInUser.person_number]);

  // Handle salesperson change
  const handleSalesPersonChange = useCallback((selected: OptionType | null) => {
    setOpportunityHeader((prev) => ({
      ...prev,
      salesperson_id: selected?.value || '',
      salesperson_name: selected?.label || '',
    }));
  }, []);

  // Custom Select styles
  // const customSelectStyles = useMemo(
  //   () => ({
  //     control: (provided: any, state: any) => ({
  //       ...provided,
  //       minHeight: '50px',
  //       height: '50px',
  //       borderColor: state.isFocused ? '#C32033' : provided.borderColor,
  //       boxShadow: state.isFocused ? '0 0 0 1px #C32033' : provided.boxShadow,
  //       '&:hover': {
  //         borderColor: state.isFocused ? '#C32033' : provided.borderColor,
  //       },
  //     }),
  //     valueContainer: (provided: any) => ({
  //       ...provided,
  //       height: '50px',
  //       padding: '0 8px',
  //     }),
  //     input: (provided: any) => ({
  //       ...provided,
  //       margin: '0px',
  //     }),
  //     option: (provided: any, state: any) => ({
  //       ...provided,
  //       backgroundColor: state.isSelected
  //         ? '#FFD7D7'
  //         : state.isFocused
  //         ? '#FFD7D7'
  //         : provided.backgroundColor,
  //       color: '#000',
  //     }),
  //     singleValue: (provided: any) => ({
  //       ...provided,
  //       color: '#C32033',
  //     }),
  //   }),
  //   [],
  // );

  // Handle header input changes
  const handleHeaderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOpportunityHeader((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle header select changes
  const handleHeaderSelectChange = (
    name: keyof OpportunityHeader,
    selectedOption: OptionType | null,
  ) => {
    const value = selectedOption?.value || '';
    setOpportunityHeader((prev) => ({
      ...prev,
      [name]: name === 'status_id' ? Number(value) : value,
    }));
  };

  // Handle details input changes
  const handleDetailsInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOpportunityDetails((prev) => ({
      ...prev,
      [name]:
        name === 'order_quantity' || name === 'price' || name === 'line_amount'
          ? Number(value)
          : value,
    }));

    // Recalculate line amount if quantity or price changes
    if (name === 'order_quantity' || name === 'price') {
      const quantity =
        name === 'order_quantity'
          ? Number(value)
          : opportunityDetails.order_quantity;
      const priceValue =
        name === 'price' ? Number(value) : opportunityDetails.price;
      setOpportunityDetails((prev) => ({
        ...prev,
        line_amount: quantity * priceValue,
      }));
    }
  };

  // Handle price change specifically
  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPrice(value);
    setOpportunityDetails((prev) => ({
      ...prev,
      price: value,
      line_amount: prev.order_quantity * value,
    }));
  };

  // Handle item number selection
  const handleItemNumberSelect = async (selectedOption: any) => {
    if (!selectedOption) return;

    setOpportunityDetails((prevData) => ({
      ...prevData,
      item_number: selectedOption.value,
      item_detail: selectedOption.label,
    }));

    try {
      // Fetch item details
      const [itemDetailRes, priceRes] = await Promise.all([
        apiService.get(`/api/v1/items/detail/${selectedOption.value}`, {}),
        apiService.get(`/api/v1/prices/detail/${selectedOption.value}`, {}),
      ]);

      const itemData = itemDetailRes.data[0];
      console.log('Item Data:', itemData);
      const priceData = priceRes.data;

      if (itemData) {
        setItemDetail(itemData);
        setOpportunityDetails((prevData) => ({
          ...prevData,
          sub_category: itemData.sub_cat || '',
          description: itemData.description || '',
          unit_of_measure: itemData.unit_of_measure || '',
        }));
      }

      if (priceData && priceData.length > 0) {
        const basePrice = priceData[0].base_price || 0;
        setPrice(basePrice);
        setOpportunityDetails((prevData) => ({
          ...prevData,
          price: basePrice,
          line_amount: prevData.order_quantity * basePrice,
        }));
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  // Handle next button click
  const handleNext = () => {
    setCurrentStep(2);
  };

  // Handle back button click
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Submit header + details (new) OR only details (add more)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (opportunityId) {
        // 👉 Add details to existing opportunity
        const detailPayload = {
          OPPORTUNITY_ID: opportunityId,
          ...opportunityDetails,
        };
        console.log('Adding detail:', detailPayload);

        const response = await apiService.post(
          '/api/v1/opportunities/createOpportunity',
          detailPayload,
        );

        if (response.status === 201) {
          toast.success('Opportunity Detail added!');
          navigate(`/opportunities/listing`, {
            state: { opportunity_id: opportunityId },
          });
        } else {
          toast.error('Failed to add opportunity detail.');
        }
      } else {
        // 👉 Create new opportunity (header + details)
        const completeOpportunity = {
          ...opportunityHeader,
          ...opportunityDetails,
        };
        console.log('Complete Opportunity Data:', completeOpportunity);

        const response = await apiService.post(
          '/api/v1/opportunities/createOpportunity',
          completeOpportunity,
        );

        if (response.status === 201) {
          toast.success('Opportunity created!');
          navigate('/opportunities/manage');
        } else {
          toast.error('Failed to create opportunity.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      opportunityHeader.generation_date &&
      opportunityHeader.close_date &&
      opportunityHeader.status_id &&
      opportunityHeader.salesperson_id &&
      opportunityHeader.remarks
    );
  };

  const isItemFormValid = () => {
    return (
      opportunityDetails.item_number &&
      opportunityDetails.item_detail &&
      opportunityDetails.sub_category &&
      opportunityDetails.description &&
      opportunityDetails.unit_of_measure &&
      opportunityDetails.order_quantity &&
      opportunityDetails.price &&
      opportunityDetails.line_amount &&
      opportunityDetails.requested_ship_date
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
            Create Opportunity{' '}
            {currentStep === 1 ? '(Step 1 of 2)' : '(Step 2 of 2)'}
          </h2>

          {currentStep === 1 ? (
            // Opportunity Header Form
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Generation Date */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Generation Date
                    </label>
                    <input
                      type="date"
                      name="generation_date"
                      value={opportunityHeader.generation_date}
                      onChange={handleHeaderInputChange}
                      className='custom-input'
                      // className="custom-input-date w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none focus:border-[#C32033]"
                    />
                  </div>

                  {/* Sales Person */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sales Person
                    </label>
                    <Select
                      name="salesperson_id"
                      value={
                        salesPersonOptions.find(
                          (o) => o.value === opportunityHeader.salesperson_id,
                        ) || null
                      }
                      onChange={handleSalesPersonChange}
                      options={salesPersonOptions}
                      placeholder="Select Sales Person"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Status
                    </label>
                    <Select
                      options={statusOptions}
                      value={
                        statusOptions.find(
                          (o) =>
                            Number(o.value) === opportunityHeader.status_id,
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleHeaderSelectChange('status_id', selectedOption)
                      }
                      isSearchable
                      styles={customSelectStyles}
                      placeholder="Select Status"
                      required
                    />
                  </div>

                  {/* Close Date */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Close Date
                    </label>
                    <input
                      type="date"
                      name="close_date"
                      value={opportunityHeader.close_date}
                      onChange={handleHeaderInputChange}
                      className='custom-input'
                      // className="custom-input-date w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none focus:border-[#C32033]"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-md font-medium text-black mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={opportunityHeader.remarks}
                  onChange={handleHeaderInputChange}
                  placeholder="Write your remarks here..."
                  rows={2}
                  className='custom-input'
                  // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#c32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] resize-none"
                />
              </div>

              {/* Next Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isFormValid()}
                  className={`w-[160px] h-[50px] rounded font-medium transition-colors 
    ${
      isFormValid()
        ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
        : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
    }`}
                >
                  Next
                </button>
              </div>
            </form>
          ) : (
            // Opportunity Details Form
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Add Item Section */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
                    Add Item
                  </h1>
                </div>
                <div className="space-y-6 mt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          onChange={handleDetailsInputChange}
                          placeholder="Unit of Measure"
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                          onChange={handleDetailsInputChange}
                          placeholder="Sub Category"
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                        />
                      </div>
                    </div>

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
                          onChange={handleDetailsInputChange}
                          placeholder="Description"
                          className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                           className='custom-input'
                          // className="custom-input-date w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none focus:border-[#C32033]"
                        />
                      </div>

                      <div>
                        <label className="block text-md font-medium text-black mb-1">
                          Status
                        </label>
                        <input
                          type="text"
                          value={'Pending'}
                          readOnly
                           className='custom-input'
                          // className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-2 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isItemFormValid()}
                  className={`w-[160px] h-[50px] rounded font-medium transition-colors 
    ${
      isItemFormValid()
        ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
        : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
    }`}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateOpportunity;
