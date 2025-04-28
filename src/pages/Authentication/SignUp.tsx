import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import Select from 'react-select';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState('Sales Person');
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
  console.log(customerFormData);

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

  const navigate = useNavigate();

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
      const response = await apiService.post(
        '/api/v1/salesPersons/register',
        salesPersonFormData,
      );
      if (response?.status === 201) {
        toast.success('Sales person registered successfully!');
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
      if (response?.status === 200) {
        setCustomers(response.data);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  const fetchSalesPersonsData = async () => {
    try {
      const response = await apiService.get('/api/v1/salesPersons/list', {});
      if (response?.status === 200) {
        setSalesPersons(response.data);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchSalesPersonsData();
  }, []);

  // const handleCustomerSelect = async (selectedOption: any) => {
  //   if (selectedOption) {
  //     try {
  //       const response = await apiService.get(
  //         `/api/v1/customers/detail/${selectedOption.value}`,
  //         {},
  //       );
  //       const customerData = response.data;
  //       setCustomerFormData((prevData) => ({
  //         ...prevData,
  //         customer_id: selectedOption.value,
  //         account_number: customerData.account_number || '',
  //         address: customerData.address_line_1 || '',
  //       }));
  //     } catch (error) {
  //       console.error('Error fetching customer details:', error);
  //     }
  //   } else {
  //     setCustomerFormData((prevData) => ({
  //       ...prevData,
  //       customer_id: '',
  //       account_number: '',
  //       address: '',
  //     }));
  //   }
  // };

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
        const account_numbers = response.data;
        setAccountNumbers(account_numbers);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    }
  };

  const handleAccountNumberSelect = async (selectedOption: any) => {
    if (selectedOption) {
      console.log(selectedOption);
      setCustomerFormData((prevData) => ({
        ...prevData,
        account_number: selectedOption.value,
      }));
      try {
        const response = await apiService.get(
          `/api/v1/customers/list?customer_name=${customerFormData?.customer_name}&account_number=${selectedOption.label}`,
          {},
        );
        const address_line_1 = response.data;
        setAddressLine(address_line_1);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    }
  };

  const handleAddressLineSelect = async (selectedOption: any) => {
    if (selectedOption) {
      setCustomerFormData((prevData) => ({
        ...prevData,
        address: selectedOption.value,
      }));
    }
  };

  return (
    <div className="dark:bg-boxdark">
      <div className="flex flex-wrap justify-center items-center h-screen">
        <div className="w-full xl:w-1/2 rounded-sm border border-stroke bg-white shadow-lg">
          <ul
            className="relative flex flex-wrap px-1.5 py-1.5 list-none bg-[#f6f6f6] rounded-t-md"
            role="tablist"
          >
            {['Sales Person', 'Customer'].map((tab) => (
              <li key={tab} className="flex-auto text-center">
                <button
                  className={`w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#3c50e0] shadow-md text-white font-bold'
                      : 'text-slate-800 bg-inherit'
                  }`}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={tab}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
          <div className="" role="tabpanel">
            <div className="w-full pt-2 pl-4 pr-4 pb-4 sm:p-12.5 xl:pt-10 xl:pl-17.5 xl:pr-17.5 xl:pb-17.5  ">
              {activeTab === 'Sales Person' && (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="full_name"
                          value={salesPersonFormData.full_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={salesPersonFormData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Person Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="person_number"
                          value={salesPersonFormData.person_number}
                          onChange={handleChange}
                          placeholder="Enter your person number"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <input
                        type="submit"
                        value="Register"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      />
                    </div>

                    <div className="mt-6 text-center">
                      Already have an account?{' '}
                      <Link to="/auth/signin" className="text-primary">
                        Sign in
                      </Link>
                    </div>
                  </form>
                </>
              )}

              {activeTab === 'Customer' && (
                <>
                  <form onSubmit={handleCustomerSubmit}>
                    <div id="Customer" className="space-y-4">
                      <div>
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Customer
                        </label>
                        <Select
                          name="customer_id"
                          value={
                            customerOptions.find(
                              (option) =>
                                option.value === customerFormData.customer_id,
                            ) || null
                          }
                          onChange={handleCustomerSelect}
                          options={customerOptions}
                          placeholder="Select Customer"
                          isSearchable
                          className="react-select-container text-black dark:text-white"
                          classNamePrefix="react-select"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Account Number
                          </label>
                          <div className="relative">
                            <Select
                              name="account_number"
                              value={
                                accountNumberOptions.find(
                                  (option) =>
                                    option.value ===
                                    customerFormData.account_number,
                                ) || null
                              }
                              onChange={handleAccountNumberSelect}
                              options={accountNumberOptions}
                              placeholder="Select Account Number"
                              isSearchable
                              className="react-select-container text-black dark:text-white"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Address
                          </label>
                          <div className="relative">
                            <Select
                              name="address"
                              value={
                                addressLineOptions.find(
                                  (option) =>
                                    option.value === customerFormData.address,
                                ) || null
                              }
                              onChange={handleAddressLineSelect}
                              options={addressLineOptions}
                              placeholder="Select Address"
                              isSearchable
                              className="react-select-container text-black dark:text-white"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Sales Person
                        </label>
                        <Select
                          name="sales_person_id"
                          value={salesPersonOptions.find(
                            (option) =>
                              option.value === customerFormData.sales_person_id,
                          )}
                          onChange={(selectedOption) => {
                            handleCustomerChange({
                              target: {
                                name: 'sales_person_id',
                                value: selectedOption?.value || '',
                              },
                            });
                          }}
                          options={salesPersonOptions}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Sales Person"
                          isSearchable
                        />
                      </div>

                      <div className="bg-gray py-3 px-2 !mt-8 !mb-8 text-lg font-semibold text-black ">
                        Personal Details
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="customer_email"
                              value={customerFormData.customer_email}
                              onChange={handleCustomerChange}
                              placeholder="Enter email"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Contact Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="contact_number"
                              value={customerFormData.contact_number}
                              onChange={handleCustomerChange}
                              placeholder="Enter contact number"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Contact Person
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="contact_person"
                              value={customerFormData.contact_person}
                              onChange={handleCustomerChange}
                              placeholder="Enter contact person"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            City
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="city"
                              value={customerFormData.city}
                              onChange={handleCustomerChange}
                              placeholder="Enter city"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Shipping Address
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="shipping_address"
                            value={customerFormData.shipping_address}
                            onChange={handleCustomerChange}
                            placeholder="Enter shipping address"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-5">
                        <input
                          type="submit"
                          value="Register"
                          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        />
                      </div>

                      <div className="mt-6 text-center">
                        Already have an account?{' '}
                        <Link to="/auth/signin" className="text-primary">
                          Sign in
                        </Link>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
