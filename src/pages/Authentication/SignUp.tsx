import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import Select from 'react-select';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState('Sales Person');
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);

  const [salesPersonFormData, setSalesPersonFormData] = useState({
    email: '',
    person_number: '',
    full_name: '',
  });

  const [customerFormData, setCustomerFormData] = useState({
    customer_id: '',
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
    label: person.party_name,
  }));

  const customerOptions = customers.map((customer: any) => ({
    value: customer._id,
    label: customer.party_name,
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

  const handleCustomerSelect = async (selectedOption: any) => {
    if (selectedOption) {
      try {
        const response = await apiService.get(
          `/api/v1/customers/detail/${selectedOption.value}`,
          {},
        );
        const customerData = response.data;
        console.log(customerData);
        setCustomerFormData((prevData) => ({
          ...prevData,
          customer_id: selectedOption.value,
          account_number: customerData.account_number || '',
          address: customerData.address_line_1 || '',
        }));
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    } else {
      setCustomerFormData((prevData) => ({
        ...prevData,
        customer_id: '',
        account_number: '',
        address: '',
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
                        {/* <select
                          name="customer_name"
                          value={customerFormData.customer_name}
                          onChange={handleCustomerChange}
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        >
                          <option>Select Customer</option>
                          {customers.map((customer: any) => (
                            <option
                              key={customer._id}
                              value={customer.customer_name}
                            >
                              {customer.party_name}
                            </option>
                          ))}
                        </select> */}
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
                            <input
                              type="text"
                              name="account_number"
                              value={customerFormData.account_number}
                              onChange={handleCustomerChange}
                              placeholder="Enter account number"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              readOnly
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Address
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="address"
                              value={customerFormData.address}
                              onChange={handleCustomerChange}
                              placeholder="Enter address"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Sales Person
                        </label>
                        {/* <select
                          name="sales_person_id"
                          value={customerFormData.sales_person_id}
                          onChange={handleCustomerChange}
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        >
                          <option>Select Sales Person</option>
                          {salesPersons.map((salesPerson: any) => (
                            <option
                              key={salesPerson._id}
                              value={salesPerson._id}
                            >
                              {salesPerson?.party_name}
                            </option>
                          ))}
                        </select> */}
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
