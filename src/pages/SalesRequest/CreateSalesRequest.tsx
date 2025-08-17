import { ChevronRight } from 'lucide-react';
import { Stepper, Step, button } from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
import toast from 'react-hot-toast';

type Address = string;

type Account = {
  account_number: string;
  addresses: Address[];
};

type Price = {
  base_price: number;
};

type Customer = {
  _id: string;
  party_id: string;
  party_name: string;
  accounts: Account[];
};

type CustomerFormData = {
  customer_id: string;
  customer_name: string;
  account_number: string;
  address: string;
  payment_term: string;
  customer_po_number: string;
  item_detail: string;
  item_number: string;
  unit_of_measure: string;
  sub_category: string;
  description: string;
  instructions: string;
  order_quantity: number;
  price: number;
  line_amount: number;
  salesperson_id: string;
  salesperson_name: string;
};

const CreateSalesRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { step, item_number, customer_id, mode } = location.state || {};
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [buttonMode, setButtonMode] = useState<'save' | 'update'>('save');

  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>({
    customer_id: '',
    customer_name: '',
    account_number: '',
    address: '',
    payment_term: '',
    customer_po_number: '',
    item_detail: '',
    item_number: '',
    unit_of_measure: '',
    sub_category: '',
    description: '',
    instructions: '',
    order_quantity: 0,
    price: 0.0,
    line_amount: 0.0,
    salesperson_id: '',
    salesperson_name: '',
  });
  console.log('CustomerFormData', customerFormData);

  const [accountNumbers, setAccountNumbers] = useState([]);
  const [addressLine, setAddressLine] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string[]>([]);
  const [itemDetail, setItemDetail] = useState<string[]>([]);
  const [price, setPrice] = useState<Price[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const salesPersonOptions = salesPersons.map((person: any) => ({
    value: person._id,
    label: person.salesperson_name,
  }));

  const customerOptions = customers.map((customer: any) => ({
    value: customer._id,
    label: customer.party_name,
  }));

  const accountNumberOptions = accountNumbers.map((account: any) => ({
    value: account,
    label: account,
  }));

  const addressLineOptions = addressLine.map((address: any) => ({
    value: address,
    label: address,
  }));

  const paymentTermOptions = paymentTerm.map((paymentTerm: any) => ({
    value: paymentTerm,
    label: paymentTerm,
  }));

  const itemsOptions = items.map((item: any) => ({
    value: item.item_number,
    label: item.item_detail,
  }));

  const unitOfMeasureOptions = itemDetail.map((item: any) => ({
    value: item.unit_of_measure,
    label: item.unit_of_measure,
  }));

  const subCategoryOptions = itemDetail.map((item: any) => ({
    value: item.sub_cat,
    label: item.sub_cat,
  }));

  const descriptionOptions = itemDetail.map((item: any) => ({
    value: item.description,
    label: item.description,
  }));

  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    setCustomerFormData((prevData) => ({
      ...prevData,
      price: newValue,
      line_amount: prevData.order_quantity * newValue,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (step !== 1 || !mode) return;

      setActiveStep(1);
      setButtonMode(mode);

      if (mode === 'update' && item_number && customer_id) {
        // Editing existing item
        try {
          const response = await apiService.post(
            `/api/v1/salesRequests/item-detail`,
            { item_number, customer_id },
          );

          if (response?.status === 200) {
            setCustomerFormData((prev) => ({
              ...prev,
              ...response.data, // Merge item fields with existing customer data
            }));
          } else {
            console.error('Failed to fetch item details:', response);
          }
        } catch (error) {
          console.error('Error fetching item details:', error);
        }
      } else if (mode === 'save' && customer_id) {
        // Pre-fill customer info from location.state (already passed from navigate)
        setCustomerFormData((prev) => ({
          ...prev,
          customer_id,
        }));
      }
    };

    fetchData();
  }, [step, item_number, mode, customer_id]);

  // Fetch all customers on page load
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiService.get('/api/v1/customers/list', {});
        setCustomers(response.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchSalesPersonsData = async () => {
      try {
        const response = await apiService.get('/api/v1/salesPersons/list', {});
        if (response?.status === 200) setSalesPersons(response.data);
      } catch (error: any) {
        console.error('Error fetching sales persons:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await apiService.get('/api/v1/items/list', {});
        if (response?.status === 200) setItems(response.data);
      } catch (error: any) {
        console.error('Error fetching items:', error);
      }
    };

    fetchCustomers();
    fetchSalesPersonsData();
    fetchItems();
  }, []);

  const handleClick = () => {
    if (buttonMode === 'save') {
      handleSave();
    } else {
      handleUpdate();
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await apiService.put(
        `/api/v1/salesRequests/item-update`,
        {
          customer_id: customer_id,
          item_number: item_number,
          item_detail: customerFormData.item_detail,
          description: customerFormData.description,
          instructions: customerFormData.instructions,
          sub_category: customerFormData.sub_category,
          order_quantity: customerFormData.order_quantity,
          unit_of_measure: customerFormData.unit_of_measure,
          price: customerFormData.price,
          line_amount: customerFormData.line_amount,
        },
      );

      if (response?.status === 200) {
        toast.success('Item Updated');
        setCustomerFormData(response.data); // refresh form with saved data
        navigate('/item-listing', {
          state: { customer: response.data },
        });
      } else {
        console.error('Failed to update sales request:', response);
        toast.error('Failed to update sales request.');
      }
    } catch (error) {
      console.error('Error updating sales request:', error);
      toast.error('Failed to update sales request.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiService.post(
        `/api/v1/salesRequests/create`,
        customerFormData,
      );
      console.log('RESPONSE', response);
      if (response?.status === 201) {
        toast.success('Item Added');
        navigate('/item-listing', {
          state: { customer: response.data },
        });
      } else {
        console.error('Failed to create sales request:', response);
        toast.error('Failed to create sales request.');
      }
    } catch (error) {
      console.error('Error creating sales request:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSalesPersonChange = (salesPerson: {
    id: string;
    name: string;
  }) => {
    setCustomerFormData({
      ...customerFormData,
      salesperson_id: salesPerson.id,
      salesperson_name: salesPerson.name,
    });
  };

  const handleCustomerSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        customer_id: selectedOption.value,
        customer_name: selectedOption.label,
      }));
      try {
        const response = await apiService.get(
          `/api/v1/customers/list?customer_name=${selectedOption.label}`,
          {},
        );
        setAccountNumbers(response.data);
      } catch (error) {
        console.error('Error fetching account numbers:', error);
      }
    }
  };

  const handleAccountNumberSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        account_number: selectedOption.value,
      }));
      try {
        const response = await apiService.get(
          `/api/v1/customers/list?customer_name=${customerFormData.customer_name}&account_number=${selectedOption.label}`,
          {},
        );
        setAddressLine(response.data?.addressLines || []);
        setPaymentTerm(response.data?.paymentTerms || []);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    }
  };

  const handleAddressLineSelect = (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        address: selectedOption.value,
      }));
    }
  };

  const handlePaymentTermSelect = (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        payment_term: selectedOption.value,
      }));
    }
  };

  const handleItemNumberSelect = async (selectedOption: any) => {
    if (!selectedOption) return;
    // First update with the selected item number
    setCustomerFormData((prevData) => ({
      ...prevData,
      item_number: selectedOption.value,
      item_detail: selectedOption.label,
    }));
    try {
      const response = await apiService.get(
        `/api/v1/items/detail/${selectedOption.value}`,
        {},
      );
      // If you still need itemDetail for other purposes
      setItemDetail(response.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
    try {
      const response = await apiService.get(
        `/api/v1/prices/detail/${selectedOption.value}`,
        {},
      );
      // If you still need itemDetail for other purposes
      setPrice(response.data.map((p: any) => ({ base_price: p.base_price })));
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleUnitOfMeasureSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        unit_of_measure: selectedOption.value,
      }));
    }
  };

  const handleSubCategorySelect = (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        sub_category: selectedOption.value,
      }));
    }
  };

  const handleDescriptionSelect = (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        description: selectedOption.value,
      }));
    }
  };

  const isFormValid = () => {
    return (
      customerFormData.item_detail &&
      customerFormData.item_number &&
      customerFormData.unit_of_measure &&
      customerFormData.sub_category &&
      customerFormData.description &&
      customerFormData.order_quantity > 0 &&
      customerFormData.price > 0
    );
  };

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
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#FFD7D7' // Selected option color
        : state.isFocused
        ? '#FFD7D7' // Hover color
        : provided.backgroundColor,
      color: '#000', // Always black text
      '&:active': {
        backgroundColor: state.isSelected ? '#FFD7D7' : '#FFD7D7',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#C32033', // selected value text color in main field
    }),
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          New Order
        </h2>
        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Sales Requests</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">Create</span>
        </div>
        {/* Stepper */}
        <div className="flex justify-center gap-6 text-center">
          <div
            className="py-4 
          "
          >
            <Stepper activeStep={activeStep}>
              <Step
                // onClick={() => setActiveStep(0)}
                className={`!px-4 !py-2 !rounded-full mx-50 !cursor-pointer ${
                  activeStep === 0
                    ? '!bg-[#C32033] !text-white'
                    : '!bg-[#9F9F9F] !text-white'
                }`}
                activeClassName="!bg-[#C32033]"
                completedClassName="!bg-[#9F9F9F]"
              >
                1
              </Step>
              <Step
                // onClick={() => setActiveStep(1)}
                className={`!px-4 !py-2 !rounded-full mx-50 !cursor-pointer ${
                  activeStep === 1
                    ? '!bg-[#C32033] !text-white'
                    : '!bg-[#9F9F9F] !text-white'
                }`}
                activeClassName="!bg-[#C32033]"
                completedClassName="!bg-[#9F9F9F]"
              >
                2
              </Step>
            </Stepper>
          </div>
        </div>

        {/* Form */}
        {activeStep === 0 ? (
          <>
            <div className="flex items-center gap-2 text-xl text-black font-bold">
              <h1>Customer Information</h1>
            </div>
            <form className="space-y-6 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Customer Name
                    </label>
                    <Select
                      name="customer_id"
                      value={
                        customerOptions.length > 0
                          ? customerOptions.find(
                              (o) => o.value === customerFormData.customer_id,
                            ) || null
                          : {
                              value: customerFormData.customer_id,
                              label: customerFormData.customer_id,
                            }
                      }
                      onChange={handleCustomerSelect}
                      options={customerOptions}
                      placeholder="Select Customer"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Address
                    </label>
                    <Select
                      name="address"
                      value={
                        addressLineOptions.length > 0
                          ? addressLineOptions.find(
                              (o) => o.value === customerFormData.address,
                            ) || null
                          : {
                              value: customerFormData.address,
                              label: customerFormData.address,
                            }
                      }
                      onChange={handleAddressLineSelect}
                      options={addressLineOptions}
                      placeholder="Select Address"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sales Person
                    </label>
                    <Select
                      name="salesperson_id"
                      value={
                        salesPersonOptions.length > 0
                          ? salesPersonOptions.find(
                              (o) =>
                                o.value === customerFormData.salesperson_id,
                            ) || null
                          : {
                              value: customerFormData.salesperson_id,
                              label: customerFormData.salesperson_id,
                            }
                      }
                      onChange={(selected) =>
                        handleSalesPersonChange({
                          id: selected?.value || '',
                          name: selected?.label || '',
                        })
                      }
                      options={salesPersonOptions}
                      placeholder="Select Sales Person"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Account Number */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Account Number
                    </label>
                    <Select
                      name="account_number"
                      value={
                        accountNumberOptions.length > 0
                          ? accountNumberOptions.find(
                              (o) =>
                                o.value === customerFormData.account_number,
                            ) || null
                          : {
                              value: customerFormData.account_number,
                              label: customerFormData.account_number,
                            }
                      }
                      onChange={handleAccountNumberSelect}
                      options={accountNumberOptions}
                      placeholder="Select Account Number"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  {/* Payment Term */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Payment Term
                    </label>
                    <Select
                      name="payment_term"
                      value={
                        paymentTermOptions.length > 0
                          ? paymentTermOptions.find(
                              (o) => o.value === customerFormData.payment_term,
                            ) || null
                          : {
                              value: customerFormData.payment_term,
                              label: customerFormData.payment_term,
                            }
                      }
                      onChange={handlePaymentTermSelect}
                      options={paymentTermOptions}
                      placeholder="Select Payment Term"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  {/* Customer PO Number */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Customer PO Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="customer_po_number"
                      value={customerFormData.customer_po_number}
                      onChange={handleChange}
                      placeholder="Enter Customer PO Number"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, 1))}
                  className="w-[160px] h-[50px] rounded bg-[#C32033] text-md font-medium text-white hover:bg-[#A91B2E] transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xl text-black font-bold">
              <h1>Add Item</h1>
            </div>
            <form className="space-y-6 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Item Number
                    </label>
                    <Select
                      name="item_number"
                      value={
                        itemsOptions.length > 0
                          ? itemsOptions.find(
                              (o) => o.value === customerFormData.item_number,
                            ) || null
                          : {
                              value: customerFormData.item_number,
                              label: customerFormData.item_number,
                            }
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
                    <Select
                      name="unit_of_measure"
                      value={
                        unitOfMeasureOptions.length > 0
                          ? unitOfMeasureOptions.find(
                              (o) =>
                                o.value === customerFormData.unit_of_measure,
                            ) || null
                          : {
                              value: customerFormData.unit_of_measure,
                              label: customerFormData.unit_of_measure,
                            }
                      }
                      onChange={handleUnitOfMeasureSelect}
                      options={unitOfMeasureOptions}
                      placeholder="Select Unit of Measure"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sub Category
                    </label>
                    <Select
                      name="sub_category"
                      value={
                        subCategoryOptions.length > 0
                          ? subCategoryOptions.find(
                              (o) => o.value === customerFormData.sub_category,
                            ) || null
                          : {
                              value: customerFormData.sub_category,
                              label: customerFormData.sub_category,
                            }
                      }
                      onChange={handleSubCategorySelect}
                      options={subCategoryOptions}
                      placeholder="Select Sub Category"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={
                        (customerFormData.price === 0
                          ? price[0]?.base_price
                          : customerFormData.price) || ''
                      }
                      min={0}
                      step="any"
                      onChange={handlePrice}
                      placeholder="Enter Price"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
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
                      value={customerFormData.line_amount}
                      onChange={handleChange}
                      placeholder="Select Line Amount"
                      readOnly
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Description
                    </label>
                    <Select
                      name="description"
                      value={
                        descriptionOptions.length > 0
                          ? descriptionOptions.find(
                              (o) => o.value === customerFormData.description,
                            ) || null
                          : {
                              value: customerFormData.description,
                              label: customerFormData.description,
                            }
                      }
                      onChange={handleDescriptionSelect}
                      options={descriptionOptions}
                      placeholder="Select Description"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="instructions"
                      value={customerFormData.instructions}
                      onChange={handleChange}
                      placeholder="Enter Instructions"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Order Quantity
                    </label>
                    <input
                      type="number"
                      name="order_quantity"
                      value={customerFormData.order_quantity}
                      onChange={handleChange}
                      min={0}
                      placeholder="Enter Order Quantity"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Requested Shipment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="custom-input-date custom-input-date-1 w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5  outline-none transition focus:border-[#C32033] active:border-[#C32033] dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#C32033]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      name="status"
                      value={'Pending'}
                      readOnly
                      onChange={handleChange}
                      placeholder="Enter Order Status"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {buttonMode === 'save' && !customer_id && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStep((prev) => Math.max(prev - 1, 0))
                    }
                    className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={!isFormValid()}
                  className={`px-15 py-3 rounded-lg font-medium transition-colors 
    ${
      isFormValid()
        ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
        : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
    }
  `}
                >
                  {buttonMode === 'save' ? 'Save' : 'Update'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateSalesRequest;
