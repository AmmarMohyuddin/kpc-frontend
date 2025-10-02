import { ChevronRight } from 'lucide-react';
import { Stepper, Step } from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import { customSelectStyles } from '../../styles/selectStyle.ts';

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
  status: string;
  requested_ship_date: string;
};

interface ItemDetail {
  unit_of_measure: string;
  sub_cat: string;
  description: string;
  base_price?: number;
}

const CreateSalesRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { step, item_number, customer_id, mode } = location.state || {};
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [buttonMode, setButtonMode] = useState<'save' | 'update'>('save');

  // Consolidated item detail state like in CreateOpportunity
  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [price, setPrice] = useState<number>(0);

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
    status: 'Pending',
    requested_ship_date: new Date().toISOString().split('T')[0],
  });

  const [accountNumbers, setAccountNumbers] = useState([]);
  const [addressLine, setAddressLine] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

  const salesPersonOptions = salesPersons
    .filter(
      (person: any) => person.employee_number === loggedInUser.person_number,
    )
    .map((person: any) => ({
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

  // NEW: Auto-select when there's only one option for Account Number
  useEffect(() => {
    if (accountNumberOptions.length === 1 && !customerFormData.account_number) {
      setCustomerFormData((prev) => ({
        ...prev,
        account_number: accountNumberOptions[0].value,
      }));
    }
  }, [accountNumberOptions, customerFormData.account_number]);

  // NEW: Auto-select when there's only one option for Address
  useEffect(() => {
    if (addressLineOptions.length === 1 && !customerFormData.address) {
      setCustomerFormData((prev) => ({
        ...prev,
        address: addressLineOptions[0].value,
      }));
    }
  }, [addressLineOptions, customerFormData.address]);

  // NEW: Auto-select when there's only one option for Payment Term
  useEffect(() => {
    if (paymentTermOptions.length === 1 && !customerFormData.payment_term) {
      setCustomerFormData((prev) => ({
        ...prev,
        payment_term: paymentTermOptions[0].value,
      }));
    }
  }, [paymentTermOptions, customerFormData.payment_term]);

  // NEW: Auto-select salesperson if there's only one option
  useEffect(() => {
    if (salesPersonOptions.length === 1 && !customerFormData.salesperson_id) {
      setCustomerFormData((prev) => ({
        ...prev,
        salesperson_id: salesPersonOptions[0].value,
        salesperson_name: salesPersonOptions[0].label,
      }));
    }
  }, [salesPersonOptions, customerFormData.salesperson_id]);

  // Fixed: Auto-calculation for price and quantity changes
  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPrice(value);
    setCustomerFormData((prev) => ({
      ...prev,
      price: value,
      line_amount: prev.order_quantity * value,
    }));
  };

  // Fixed: Handle quantity change with auto-calculation
  const handleDetailsInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerFormData((prev) => ({
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
          : customerFormData.order_quantity;
      const priceValue =
        name === 'price' ? Number(value) : customerFormData.price;
      setCustomerFormData((prev) => ({
        ...prev,
        line_amount: quantity * priceValue,
      }));
    }
  };

  // Fixed: Handle item selection with auto-fill like CreateOpportunity
  const handleItemNumberSelect = async (selectedOption: any) => {
    if (!selectedOption) return;

    // First update with the selected item number
    setCustomerFormData((prevData) => ({
      ...prevData,
      item_number: selectedOption.value,
      item_detail: selectedOption.label,
      sub_category: '',
      description: '',
      unit_of_measure: '',
      price: 0,
      line_amount: 0,
    }));

    try {
      // Fetch item details and price in parallel like CreateOpportunity
      const [itemDetailRes, priceRes] = await Promise.all([
        apiService.get(`/api/v1/items/detail/${selectedOption.value}`, {}),
        apiService.get(`/api/v1/prices/detail/${selectedOption.value}`, {}),
      ]);

      const itemData = itemDetailRes.data[0];
      const priceData = priceRes.data;

      if (itemData) {
        setItemDetail(itemData);
        setCustomerFormData((prevData) => ({
          ...prevData,
          sub_category: itemData.sub_cat || '',
          description: itemData.description || '',
          unit_of_measure: itemData.unit_of_measure || '',
        }));
      }

      if (priceData && priceData.length > 0) {
        const basePrice = priceData[0].base_price || 0;
        setPrice(basePrice);
        setCustomerFormData((prevData) => ({
          ...prevData,
          price: basePrice,
          line_amount: prevData.order_quantity * basePrice,
        }));
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      toast.error('Failed to fetch item details');
    }
  };

  // Remove the old handleChange and use handleDetailsInputChange for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDetailsInputChange(e);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (step !== 1 || !mode) return;

      setActiveStep(1);
      setButtonMode(mode);

      if (mode === 'update' && item_number && customer_id) {
        try {
          const response = await apiService.post(
            `/api/v1/salesRequests/item-detail`,
            { item_number, customer_id },
          );

          if (response?.status === 200) {
            setCustomerFormData((prev) => ({
              ...prev,
              ...response.data,
            }));
            // Also set the price state for consistency
            if (response.data.price) {
              setPrice(response.data.price);
            }
          } else {
            console.error('Failed to fetch item details:', response);
          }
        } catch (error) {
          console.error('Error fetching item details:', error);
        }
      } else if (mode === 'save' && customer_id) {
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
    const fetchData = async () => {
      try {
        setLoading(true);

        const [customersRes, salesPersonsRes, itemsRes] = await Promise.all([
          apiService.get('/api/v1/customers/list', {}),
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get('/api/v1/items/list', {}),
        ]);

        setCustomers(customersRes.data || []);
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
        setCustomerFormData(response.data);
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
      console.log('Response:', response);
      if (response?.status === 201) {
        toast.success('Item Added');
        navigate('/item-listing', {
          state: {
            customer: response.data,
            order_header_id: response.data.order_header_id,
          },
        });
      } else {
        console.error('Failed to create sales request:', response);
        toast.error('Failed to create sales request.');
      }
    } catch (error) {
      console.error('Error creating sales request:', error);
    }
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

  // UPDATED: Handle customer select with auto-selection
  const handleCustomerSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        customer_id: selectedOption.value,
        customer_name: selectedOption.label,
        account_number: '', // Reset account number when customer changes
        address: '', // Reset address when customer changes
        payment_term: '', // Reset payment term when customer changes
      }));
      try {
        const response = await apiService.get(
          `/api/v1/customers/list?customer_name=${selectedOption.label}`,
          {},
        );
        setAccountNumbers(response.data || []);
        setAddressLine([]); // Reset address lines
        setPaymentTerm([]); // Reset payment terms

        // Auto-select if there's only one account number
        if (response.data && response.data.length === 1) {
          setCustomerFormData((prevData) => ({
            ...prevData,
            account_number: response.data[0],
          }));

          // Fetch address and payment terms for the auto-selected account
          try {
            const addressResponse = await apiService.get(
              `/api/v1/customers/list?customer_name=${selectedOption.label}&account_number=${response.data[0]}`,
              {},
            );
            setAddressLine(addressResponse.data?.addressLines || []);
            setPaymentTerm(addressResponse.data?.paymentTerms || []);
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching account numbers:', error);
      }
    }
  };

  // UPDATED: Handle account number select with auto-selection
  const handleAccountNumberSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        account_number: selectedOption.value,
        address: '', // Reset address when account changes
        payment_term: '', // Reset payment term when account changes
      }));
      try {
        const response = await apiService.get(
          `/api/v1/customers/list?customer_name=${customerFormData.customer_name}&account_number=${selectedOption.label}`,
          {},
        );
        console.log(response.data?.paymentTerms);
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

  const isCustomerFormValid = () => {
    return (
      customerFormData.customer_name &&
      customerFormData.account_number &&
      customerFormData.address &&
      customerFormData.payment_term &&
      customerFormData.salesperson_name
    );
  };

  // For Customer Name
  const MenuList = (props: any) => {
    const height = 35;
    const items = props.options;
    const itemCount = items.length;
    const maxHeight = 300;

    return (
      <components.MenuList {...props}>
        <List
          height={Math.min(maxHeight, itemCount * height)}
          itemCount={itemCount}
          itemSize={height}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>{props.children[index]}</div>
          )}
        </List>
      </components.MenuList>
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
    <div className="flex flex-col gap-10">
      <div className="rounded-3xl border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
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
          <div className="py-4">
            <Stepper activeStep={activeStep}>
              <Step
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
                      components={{ MenuList }}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Address
                    </label>
                    <Select
                      name="address"
                      isDisabled={!customerFormData.account_number}
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
                      placeholder={
                        addressLineOptions.length === 1
                          ? addressLineOptions[0].label
                          : 'Select Address'
                      }
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
                      placeholder={
                        salesPersonOptions.length === 1
                          ? salesPersonOptions[0].label
                          : 'Select Sales Person'
                      }
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
                      isDisabled={!customerFormData.customer_id}
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
                      placeholder={
                        accountNumberOptions.length === 1
                          ? accountNumberOptions[0].label
                          : 'Select Account Number'
                      }
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
                      isDisabled={true}
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
                      placeholder={
                        paymentTermOptions.length === 1
                          ? paymentTermOptions[0].label
                          : 'Select Payment Term'
                      }
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
                      className="custom-input"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, 1))}
                  disabled={!isCustomerFormValid()}
                  className={`px-15 py-3 rounded font-medium transition-colors 
    ${
      isCustomerFormValid()
        ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
        : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
    }
  `}
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
                      components={{ MenuList }}
                    />
                  </div>

                  {/* Fixed: Changed to read-only input since it's auto-filled */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      UOM
                    </label>
                    <input
                      type="text"
                      name="unit_of_measure"
                      readOnly
                      value={customerFormData.unit_of_measure}
                      onChange={handleDetailsInputChange}
                      placeholder="Unit of Measure"
                      className="custom-input"
                    />
                  </div>

                  {/* Fixed: Changed to read-only input since it's auto-filled */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      name="sub_category"
                      readOnly
                      value={customerFormData.sub_category}
                      onChange={handleDetailsInputChange}
                      placeholder="Sub Category"
                      className="custom-input"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={customerFormData.price}
                      onChange={handlePrice}
                      min={0}
                      step="any"
                      placeholder="Enter Price"
                      className="custom-input"
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
                      readOnly
                      className="custom-input"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Fixed: Changed to read-only input since it's auto-filled */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      readOnly
                      value={customerFormData.description}
                      onChange={handleDetailsInputChange}
                      placeholder="Description"
                      className="custom-input"
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
                      className="custom-input"
                    />
                  </div>

                  {/* Fixed: Added auto-calculation for quantity changes */}
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Order Quantity
                    </label>
                    <input
                      type="number"
                      name="order_quantity"
                      value={customerFormData.order_quantity}
                      onChange={handleDetailsInputChange}
                      min={0}
                      placeholder="Enter Order Quantity"
                      className="custom-input"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Requested Shipment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="requested_ship_date"
                        value={customerFormData.requested_ship_date}
                        onChange={handleChange}
                        className="custom-input"
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
                      value={customerFormData.status}
                      readOnly
                      onChange={handleChange}
                      placeholder="Enter Order Status"
                      className="custom-input"
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
