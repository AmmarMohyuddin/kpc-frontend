import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import Select from 'react-select';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface OptionType {
  value: string;
  label: string;
}

interface FormData {
  customer_name: string;
  customer_type: string;
  city: string;
  address: string;

  contact_number: string;
  customer_email: string;
  contact_position: string;
  source: string;
  status: string;
  salesperson_id: string;
  salesperson_name: string;
}

const CreateLead = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [salesPersons, setSalesPersons] = useState([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState<OptionType[]>([]);
  const [leadsFormData, setLeadsFormData] = useState<FormData>({
    customer_name: '',
    customer_type: '',
    city: '',
    address: '',
    contact_number: '',
    customer_email: '',
    contact_position: '',
    source: '',
    status: '',
    salesperson_id: '',
    salesperson_name: '',
  });

  console.log('Leads Form Data:', leadsFormData);

  // Memoize custom styles to prevent recreation on every render
  const customSelectStyles = useMemo(
    () => ({
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
          ? '#FFD7D7'
          : state.isFocused
          ? '#FFD7D7'
          : provided.backgroundColor,
        color: '#000',
        '&:active': {
          backgroundColor: state.isSelected ? '#FFD7D7' : '#FFD7D7',
        },
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: '#C32033',
      }),
    }),
    [],
  );

  // Memoize data transformation functions
  const mapCitiesToOptions = useCallback((data: any[]): OptionType[] => {
    return Array.isArray(data)
      ? data.map((item) => ({ value: item.name, label: item.name }))
      : [];
  }, []);

  const mapSourcesToOptions = useCallback((data: any[]): OptionType[] => {
    return Array.isArray(data)
      ? data.map((item) => ({
          value: item.lead_source,
          label: item.lead_source,
        }))
      : [];
  }, []);

  // Get logged in user only once
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  // Memoize salesperson options
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [salesPersonsRes, citiesRes, leadSourcesRes] = await Promise.all([
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get('/api/v1/cities/list', {}),
          apiService.get('/api/v1/leadSources/list', {}),
        ]);

        setSalesPersons(salesPersonsRes.data || []);
        setCityOptions(mapCitiesToOptions(citiesRes.data));
        setLeadSourceOptions(mapSourcesToOptions(leadSourcesRes.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mapCitiesToOptions, mapSourcesToOptions]);

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadsFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Handle select changes
  const handleSelectChange = useCallback(
    (name: keyof FormData, value: string) => {
      setLeadsFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  // Handle sales person change
  const handleSalesPersonChange = useCallback((selected: OptionType | null) => {
    setLeadsFormData((prev) => ({
      ...prev,
      salesperson_id: selected?.value || '',
      salesperson_name: selected?.label || '',
    }));
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiService.post(
        `/api/v1/leads/createLead`,
        leadsFormData,
      );
      console.log('Create Lead Response:', response);
      // Check based on your API response structure
      if (response?.status === 201) {
        console.log('..........................................');
        toast.success(response.message || 'Lead Created');
        navigate('/leads/manage');
      } else {
        console.error('Failed to create lead:', response);
        toast.error(response?.data?.message || 'Failed to create lead.');
      }
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast.error(
        error.response?.data?.message ||
          'Error creating lead. Please try again.',
      );
    }
  };

  const isFormValid = () => {
    return (
      leadsFormData.customer_type &&
      leadsFormData.customer_email &&
      leadsFormData.customer_name &&
      leadsFormData.contact_number &&
      leadsFormData.source &&
      leadsFormData.salesperson_name
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
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
          Create Lead
        </h2>

        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Leads</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">Create</span>
        </div>

        <div className="py-4"></div>

        <form className="space-y-6">
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Choose a Type */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Customer Type
                </label>
                <Select
                  name="customer_type"
                  value={
                    leadsFormData.customer_type
                      ? {
                          value: leadsFormData.customer_type,
                          label: leadsFormData.customer_type,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange(
                      'customer_type',
                      selectedOption?.value || '',
                    )
                  }
                  options={[
                    { value: 'Company', label: 'Company' },
                    { value: 'Individual', label: 'Individual' },
                  ]}
                  placeholder="Select Type"
                  isSearchable={false}
                  styles={customSelectStyles}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={leadsFormData.customer_email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={leadsFormData.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact_number"
                  value={leadsFormData.contact_number}
                  onChange={handleChange}
                  placeholder="Enter Contact Number"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  required
                />
              </div>

              {/* Source */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Source
                </label>
                <Select
                  options={leadSourceOptions}
                  value={
                    leadSourceOptions.find(
                      (opt) => opt.value === leadsFormData.source,
                    ) || null
                  }
                  onChange={(opt) =>
                    handleSelectChange('source', opt?.value || '')
                  }
                  isSearchable
                  styles={customSelectStyles}
                  placeholder="Select Source"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Customer Name */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={leadsFormData.customer_name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  City
                </label>
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (opt) => opt.value === leadsFormData.city,
                    ) || null
                  }
                  onChange={(opt) =>
                    handleSelectChange('city', opt?.value || '')
                  }
                  isSearchable
                  styles={customSelectStyles}
                  placeholder="Select City"
                />
              </div>

              {/* Contact Job Role */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Contact Job Role
                </label>
                <input
                  type="text"
                  name="contact_position"
                  value={leadsFormData.contact_position}
                  onChange={handleChange}
                  placeholder="Enter Contact Job Role"
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Status
                </label>
                <Select
                  name="status"
                  value={
                    leadsFormData.status
                      ? {
                          value: leadsFormData.status,
                          label: leadsFormData.status,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange('status', selectedOption?.value || '')
                  }
                  options={[{ value: 'New', label: 'New' }]}
                  placeholder="Select Status"
                  isSearchable={false}
                  styles={customSelectStyles}
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
                    salesPersonOptions.length > 0
                      ? salesPersonOptions.find(
                          (o) => o.value === leadsFormData.salesperson_id,
                        ) || null
                      : {
                          value: leadsFormData.salesperson_id,
                          label: leadsFormData.salesperson_name,
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid()}
              className={`px-15 py-3 rounded-lg font-medium transition-colors 
    ${
      isFormValid()
        ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
        : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
    }
  `}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLead;
