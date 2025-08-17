import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import Select from 'react-select';
import splashImage from '../../images/KPC-image.png';
import kpcLogo from '../../images/KPC-logo.png';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<'Employee' | 'Customer'>(
    'Employee',
  );
  const [customers, setCustomers] = useState([]);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [addressLine, setAddressLine] = useState<string[]>([]);
  const [salesPersons, setSalesPersons] = useState([]);

  const [salesPersonFormData, setSalesPersonFormData] = useState({
    email: '',
    person_number: '',
    full_name: '',
  });

  const [customerFormData, setCustomerFormData] = useState({
    customer_id: '',
    customer_name: '',
    account_number: '',
    address: '',
    customer_email: '',
    contact_number: '',
    contact_person: '',
    city: '',
    shipping_address: '',
    sales_person_id: '',
  });

  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalesPersonFormData({
      ...salesPersonFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerChange = (e: {
    target: { name: string; value: any };
  }) => {
    setCustomerFormData({
      ...customerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...salesPersonFormData,
        role: 'sales_person', // ✅ Always send 'sales_person' role
      };
      const response = await apiService.post(
        '/api/v1/salesPersons/register',
        payload,
      );
      if (response?.status === 201) {
        toast.success('Employee registered successfully!');
        navigate('/auth/signin');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.post(
        '/api/v1/customers/register',
        customerFormData,
      );
      if (response?.status === 201) {
        toast.success('Customer registered successfully!');
        navigate('/auth/signin');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await apiService.get('/api/v1/customers/list', {});
      if (response?.status === 200) setCustomers(response.data);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const fetchSalesPersonsData = async () => {
    try {
      const response = await apiService.get('/api/v1/salesPersons/list', {});
      if (response?.status === 200) setSalesPersons(response.data);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchSalesPersonsData();
  }, []);

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
        setAddressLine(response.data);
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

  return (
    <div className="flex h-screen bg-[#C32033] relative overflow-hidden">
      {/* Left Splash */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col items-center justify-center">
        <img src={kpcLogo} alt="KPC Logo" className="w-32 mb-6" />
        <div className="h-150 w-150">
          <img src={splashImage} alt="Splash" />
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 w-full max-w-[900px] shadow-2xl min-h-auto lg:min-h-[680px]">
          <h2 className="text-3xl font-bold text-black mb-2 text-left mt-5">
            Welcome to Kuwait Paint
          </h2>
          <h2 className="text-3xl font-bold text-black text-left">Company!</h2>
          <div className="flex gap-2 my-6">
            {['Employee', 'Customer'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as 'Employee' | 'Customer')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#C32033] text-white shadow-lg'
                    : 'bg-gray text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Employee' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter Full Name"
                  value={salesPersonFormData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={salesPersonFormData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Person Number
                </label>
                <input
                  type="text"
                  name="person_number"
                  placeholder="Enter Person Number"
                  value={salesPersonFormData.person_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] placeholder-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
              >
                Register
              </button>
              <div className="text-center mt-6">
                Already have an account?{' '}
                <Link
                  to="/auth/signin"
                  className="text-[#C32033] font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Customer
                    </label>
                    <Select
                      name="customer_id"
                      value={customerOptions.find(
                        (o) => o.value === customerFormData.customer_id,
                      )}
                      onChange={handleCustomerSelect}
                      options={customerOptions}
                      placeholder="Select Customer"
                      isSearchable
                    />
                  </div>
                </div>
                <div className="">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sales Person
                    </label>
                    <Select
                      name="sales_person_id"
                      value={salesPersonOptions.find(
                        (o) => o.value === customerFormData.sales_person_id,
                      )}
                      onChange={(selected) =>
                        handleCustomerChange({
                          target: {
                            name: 'sales_person_id',
                            value: selected?.value || '',
                          },
                        })
                      }
                      options={salesPersonOptions}
                      placeholder="Select Sales Person"
                      isSearchable
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Account Number
                  </label>
                  <Select
                    name="account_number"
                    value={accountNumberOptions.find(
                      (o) => o.value === customerFormData.account_number,
                    )}
                    onChange={handleAccountNumberSelect}
                    options={accountNumberOptions}
                    placeholder="Select Account Number"
                    isSearchable
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Address
                  </label>
                  <Select
                    name="address"
                    value={addressLineOptions.find(
                      (o) => o.value === customerFormData.address,
                    )}
                    onChange={handleAddressLineSelect}
                    options={addressLineOptions}
                    placeholder="Select Address"
                    isSearchable
                  />
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium text-black mb-2">
                  Personal Details
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    placeholder="Enter Email Address"
                    value={customerFormData.customer_email}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033]"
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    placeholder="Enter Contact Number"
                    value={customerFormData.contact_number}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033]"
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    placeholder="Enter Contact Person"
                    value={customerFormData.contact_person}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033]"
                  />
                </div>

                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    value={customerFormData.city}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-md font-medium text-black mb-2">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    placeholder="Enter Shipping Address"
                    value={customerFormData.shipping_address}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
              >
                Register
              </button>
              <div className="text-center mt-6">
                Already have an account?{' '}
                <Link
                  to="/auth/signin"
                  className="text-[#C32033] font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
