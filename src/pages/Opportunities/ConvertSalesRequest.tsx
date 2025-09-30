import { useState, useMemo, useEffect } from 'react';
import Select, { components } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
// import toast from 'react-hot-toast';
import Loader from '../../common/Loader';
import { customSelectStyles } from '../../styles/selectStyle.ts';

interface OptionType {
  value: string;
  label: string;
}

type Customer = {
  _id: string;
  party_id: string;
  party_name: string;
  accounts: Account[];
};

type Account = {
  account_number: string;
  addresses: Address[];
};

type Address = string;

const ConvertToSalesRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get state passed from previous screen
  const { lead_id, opportunity_id, opportunity_details } = location.state || {};
  console.log('Lead ID:', lead_id);
  console.log('Opportunity ID:', opportunity_id);
  console.log('Opportunity Details:', opportunity_details);

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [addressLine, setAddressLine] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string[]>([]);

  // Form state
  const [customerFormData, setCustomerFormData] = useState({
    customer_id: '',
    customer_name: '',
    address: '',
    account_number: '',
    payment_term: '',
    salesperson_id: '',
    salesperson_name: '',
    customer_po_number: '',
  });

  // Fetch sales persons and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, salesPersonsRes] = await Promise.all([
          apiService.get('/api/v1/customers/list', {}),
          apiService.get('/api/v1/salesPersons/list', {}),
        ]);

        setCustomers(customersRes.data || []);
        setSalesPersons(salesPersonsRes.data || []);
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

  // Options for dropdowns
  const customerOptions = useMemo(() => {
    return customers.map((customer: any) => ({
      value: customer._id,
      label: customer.party_name,
    }));
  }, [customers]);

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

  const accountNumberOptions = useMemo(() => {
    return accountNumbers.map((account: any) => ({
      value: account,
      label: account,
    }));
  }, [accountNumbers]);

  const addressLineOptions = useMemo(() => {
    return addressLine.map((address: any) => ({
      value: address,
      label: address,
    }));
  }, [addressLine]);

  const paymentTermOptions = useMemo(() => {
    return paymentTerm.map((paymentTerm: any) => ({
      value: paymentTerm,
      label: paymentTerm,
    }));
  }, [paymentTerm]);

  // Handle save functionality
  // const handleSave = async () => {
  //   try {
  //     // Prepare the data to be saved
  //     const saveData = {
  //       lead_id,
  //       opportunity_id,
  //       opportunity_details,
  //       customer_details: customerFormData,
  //       order_status: 'Pending',
  //     };

  //     console.log('Saving data:', saveData);

  //     // Make API call to save the converted sales request
  //     const response = await apiService.post(
  //       '/api/v1/opportunities/convertToSales',
  //       saveData,
  //     );

  //     if (response?.status === 201) {
  //       toast.success('Sales request created successfully from opportunity');
  //       navigate('/sales-request/manage');
  //     } else {
  //       console.error('Failed to create sales request:', response);
  //       toast.error('Failed to create sales request.');
  //     }
  //   } catch (error) {
  //     console.error('Error creating sales request:', error);
  //     toast.error('Failed to create sales request.');
  //   }
  // };
  const handleSave = async () => {
    // Prepare the data to be passed
    const saveData = {
      lead_id,
      opportunity_id,
      opportunity_details,
      customer_details: customerFormData,
      order_status: 'Pending',
    };

    console.log('Passing data in state (not calling API):', saveData);

    // Navigate to opportunities listing with state
    navigate('/opportunities/listing', {
      state: {
        ...saveData,
        from: 'convert',
        customer_id: customerFormData.customer_id,
      },
    });
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        customer_id: selectedOption.value,
        customer_name: selectedOption.label,
        address: '',
        payment_term: '',
        account_number: '',
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

  const handleSalesPersonChange = (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        salesperson_id: selectedOption.value,
        salesperson_name: selectedOption.label,
      }));
    }
  };

  // Custom react-select styles
  // const customSelectStyles = {
  //   control: (provided: any, state: any) => ({
  //     ...provided,
  //     minHeight: '50px',
  //     height: '50px',
  //     borderColor: state.isFocused ? '#C32033' : provided.borderColor,
  //     boxShadow: state.isFocused ? '0 0 0 1px #C32033' : provided.boxShadow,
  //     '&:hover': {
  //       borderColor: state.isFocused ? '#C32033' : provided.borderColor,
  //     },
  //   }),
  //   valueContainer: (provided: any) => ({
  //     ...provided,
  //     height: '50px',
  //     padding: '0 8px',
  //   }),
  //   input: (provided: any) => ({
  //     ...provided,
  //     margin: '0px',
  //   }),
  //   option: (provided: any, state: any) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected
  //       ? '#FFD7D7'
  //       : state.isFocused
  //       ? '#FFD7D7'
  //       : provided.backgroundColor,
  //     color: '#000',
  //     '&:active': {
  //       backgroundColor: state.isSelected ? '#FFD7D7' : '#FFD7D7',
  //     },
  //   }),
  //   singleValue: (provided: any) => ({
  //     ...provided,
  //     color: '#C32033',
  //   }),
  // };

  // For Customer Name dropdown virtualization
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
        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
          Convert Opportunity to Sales Request
        </h2>

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
                          (o) => o.value === customerFormData.salesperson_id,
                        ) || null
                      : {
                          value: customerFormData.salesperson_id,
                          label: customerFormData.salesperson_id,
                        }
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
                          (o) => o.value === customerFormData.account_number,
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
                  isDisabled={!customerFormData.account_number}
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
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-[#999999]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-[160px] h-[50px] rounded bg-[#C32033] text-md font-medium text-white hover:bg-[#A91B2E] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToSalesRequest;
