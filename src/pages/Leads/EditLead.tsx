import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import Select from 'react-select';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface OptionType {
  value: string;
  label: string;
  stage?: string;
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
  status_id: string;
  stage: string;
  salesperson_id: string;
  salesperson_name: string;
}

interface LeadDetail {
  lead_id: number;
  customer_name: string;
  customer_type: string;
  country: string;
  city: string;
  contact_address: string | null;
  contact_number: string;
  email_address: string;
  contact_position: string;
  source: string;
  status_id: number;
  status: string;
  stage: string;
  salesperson_id: string | null;
  salesperson_name: string | null;
}

const EditLead = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lead } = location.state;
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState<OptionType[]>([]);
  const [status, setStatus] = useState('');
  const [leadsFormData, setLeadsFormData] = useState<FormData>({
    customer_name: '',
    customer_type: '',
    city: '',
    address: '',
    contact_number: '',
    customer_email: '',
    contact_position: '',
    source: '',
    stage: '',
    status: '',
    status_id: '',
    salesperson_id: '',
    salesperson_name: '',
  });

  console.log('Leads Form Data:', leadsFormData);

  // ---- Hard-coded status flow ----
  const getNextStatusOptions = useCallback((status: string): OptionType[] => {
    switch (status) {
      case 'New':
        return [
          { value: 'Contacted', label: 'Contacted', stage: 'Prospecting' },
          { value: 'Qualified', label: 'Qualified', stage: 'Evaluation' },
          { value: 'Unqualified', label: 'Unqualified', stage: 'Evaluation' },
        ];
      case 'Contacted':
        return [
          { value: 'Qualified', label: 'Qualified', stage: 'Evaluation' },
          { value: 'Unqualified', label: 'Unqualified', stage: 'Evaluation' },
        ];
      case 'Qualified':
        return [
          {
            value: 'Converted to Opportunity',
            label: 'Converted to Opportunity',
            stage: 'Closure',
          },
        ];
      case 'Unqualified':
        return [{ value: 'Closed', label: 'Closed', stage: 'Closure' }];
      case 'Closed':
      case 'Converted to Opportunity':
        return []; // terminal states
      default:
        return [];
    }
  }, []);

  const currentStatusOption = useMemo(() => {
    if (!leadsFormData.status) return null;
    return { value: leadsFormData.status, label: leadsFormData.status };
  }, [leadsFormData.status]);

  const nextStatusOptions = useMemo(
    () => getNextStatusOptions(status),
    [status, getNextStatusOptions],
  );

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
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? '#FFD7D7'
          : state.isFocused
          ? '#FFD7D7'
          : provided.backgroundColor,
        color: '#000',
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: '#C32033',
      }),
    }),
    [],
  );

  const mapCitiesToOptions = useCallback(
    (data: any[]): OptionType[] =>
      Array.isArray(data)
        ? data.map((item) => ({ value: item.name, label: item.name }))
        : [],
    [],
  );

  const mapSourcesToOptions = useCallback(
    (data: any[]): OptionType[] =>
      Array.isArray(data)
        ? data.map((item) => ({
            value: item.lead_source,
            label: item.lead_source,
          }))
        : [],
    [],
  );

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const salesPersonOptions = useMemo(() => {
    return salesPersons
      .filter(
        (person: any) => person.employee_number === loggedInUser.person_number,
      )
      .map((person: any) => ({
        value: person.salesperson_id,
        label: person.salesperson_name,
      }));
  }, [salesPersons, loggedInUser.person_number]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [salesPersonsRes, citiesRes, leadSourcesRes, leadDetailsRes] =
          await Promise.all([
            apiService.get('/api/v1/salesPersons/list', {}),
            apiService.get('/api/v1/cities/list', {}),
            apiService.get('/api/v1/leadSources/list', {}),
            apiService.get(`/api/v1/leads/detailLead`, {
              customer_name: lead.customer_name,
            }),
          ]);

        setSalesPersons(salesPersonsRes.data || []);
        setCityOptions(mapCitiesToOptions(citiesRes.data));
        setLeadSourceOptions(mapSourcesToOptions(leadSourcesRes.data));

        if (leadDetailsRes?.status === 200) {
          const leadDetail = leadDetailsRes.data.find(
            (item: LeadDetail) => item.lead_id === lead.lead_id,
          );
          if (leadDetail) {
            setLeadsFormData({
              customer_name: leadDetail.customer_name || '',
              customer_type: leadDetail.customer_type || '',
              city: leadDetail.city || '',
              address: leadDetail.contact_address || '',
              contact_number: leadDetail.contact_number || '',
              customer_email: leadDetail.email_address || '',
              contact_position: leadDetail.contact_position || '',
              stage: leadDetail.stage || '',
              source: leadDetail.source || '',
              status: leadDetail.status || '',
              status_id: leadDetail.status_id.toString() || '',
              salesperson_id: leadDetail.salesperson_id || '',
              salesperson_name: leadDetail.salesperson_name || '',
            });
            setStatus(leadDetail.status || '');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lead, mapCitiesToOptions, mapSourcesToOptions]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadsFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback(
    (name: keyof FormData, selectedOption: any) => {
      setLeadsFormData((prev) => ({
        ...prev,
        [name]: selectedOption?.value || '',
      }));
    },
    [],
  );

  const handleSalesPersonChange = useCallback((selectedOption: any) => {
    setLeadsFormData((prev) => ({
      ...prev,
      salesperson_id: selectedOption?.value || '',
      salesperson_name: selectedOption?.label || '',
    }));
  }, []);

  // Updated to set both status and stage
  const handleStatusChange = useCallback((selectedOption: any) => {
    setLeadsFormData((prev) => ({
      ...prev,
      status: selectedOption?.value || '',
      stage: selectedOption?.stage || '', // Set the stage from the selected option
    }));
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiService.put(`/api/v1/leads/updateLead`, {
        ...leadsFormData,
        lead_id: lead.lead_id,
      });

      if (response?.status === 200) {
        toast.success(response.data?.message || 'Lead updated successfully');
        navigate('/leads/manage');
      } else {
        toast.error(response?.data?.message || 'Failed to update lead.');
      }
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error(error.response?.data?.message || 'Error updating lead.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    leadsFormData.customer_type &&
    leadsFormData.customer_email &&
    leadsFormData.customer_name &&
    leadsFormData.contact_number &&
    leadsFormData.source &&
    leadsFormData.salesperson_name;

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
        <h2 className="text-2xl font-semibold mb-3 text-black">Edit Lead</h2>

        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Leads</span>
          <ChevronRight className="w-4 h-4" />
          <span>Edit</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">{lead.lead_id}</span>
        </div>

        <form className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
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
                  onChange={(opt) => handleSelectChange('customer_type', opt)}
                  options={[
                    { value: 'Customer', label: 'Customer' },
                    { value: 'Individual', label: 'Individual' },
                  ]}
                  placeholder="Select Type"
                  isSearchable={false}
                  styles={customSelectStyles}
                />
              </div>

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
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:ring-2 focus:ring-[#C32033]"
                  required
                />
              </div>

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
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:ring-2 focus:ring-[#C32033]"
                />
              </div>

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
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:ring-2 focus:ring-[#C32033]"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Source
                </label>
                <Select
                  options={leadSourceOptions}
                  value={
                    leadSourceOptions.find(
                      (o) => o.value === leadsFormData.source,
                    ) || null
                  }
                  onChange={(opt) => handleSelectChange('source', opt)}
                  styles={customSelectStyles}
                  placeholder="Select Source"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:ring-2 focus:ring-[#C32033]"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  City
                </label>
                <Select
                  options={cityOptions}
                  value={
                    cityOptions.find((o) => o.value === leadsFormData.city) ||
                    null
                  }
                  onChange={(opt) => handleSelectChange('city', opt)}
                  styles={customSelectStyles}
                  placeholder="Select City"
                />
              </div>

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
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:ring-2 focus:ring-[#C32033]"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Status
                </label>
                <Select
                  name="status"
                  value={currentStatusOption}
                  onChange={handleStatusChange}
                  options={nextStatusOptions}
                  placeholder="Select Status"
                  isSearchable={false}
                  styles={customSelectStyles}
                  isDisabled={nextStatusOptions.length === 0}
                />
              </div>

              {/* <div>
                <label className="block text-md font-medium text-black mb-2">
                  Stage
                </label>
                <input
                  type="text"
                  name="stage"
                  value={leadsFormData.stage}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-600"
                />
              </div> */}

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Sales Person
                </label>
                <Select
                  name="salesperson_id"
                  value={
                    salesPersonOptions.find(
                      (o) => o.value === leadsFormData.salesperson_id,
                    ) || {
                      value: leadsFormData.salesperson_id,
                      label: leadsFormData.salesperson_name,
                    }
                  }
                  onChange={handleSalesPersonChange}
                  options={salesPersonOptions}
                  placeholder="Select Sales Person"
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/leads/manage')}
              className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid()}
              className={`px-15 py-3 rounded-lg font-medium ${
                isFormValid()
                  ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
                  : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;
