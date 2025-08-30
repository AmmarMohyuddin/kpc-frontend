import { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Select from 'react-select';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface OptionType {
  value: string;
  label: string;
}

interface FollowUpFormData {
  reference_type: string;
  reference_id: string;
  salesperson_id: string;
  salesperson_name: string;
  followup_date: string;
  next_followup_date: string;
  notes: string;
}

const CreateFollowUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const leadId = location.state?.lead_id || '';
  const [salesPersons, setSalesPersons] = useState([]);
  const [formData, setFormData] = useState<FollowUpFormData>({
    reference_type: 'Lead',
    reference_id: leadId,
    salesperson_id: '',
    salesperson_name: '',
    followup_date: '',
    next_followup_date: '',
    notes: '',
  });

  // Memoized custom styles for react-select
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

  // Fetch salespersons
  useEffect(() => {
    const fetchSalesPersons = async () => {
      try {
        setLoading(true);
        const res = await apiService.get('/api/v1/salesPersons/list', {});
        setSalesPersons(res.data || []);
      } catch (error) {
        console.error('Error fetching salespersons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesPersons();
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

  // Handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleSelectChange = useCallback(
    (name: keyof FollowUpFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleSalesPersonChange = (selected: OptionType | null) => {
    setFormData((prev) => ({
      ...prev,
      salesperson_id: selected?.value || '',
      salesperson_name: selected?.label || '',
    }));
  };

  const handleSave = async () => {
    console.log('Form Data to be submitted:', formData);
    try {
      setLoading(true);
      const response = await apiService.post(
        `/api/v1/leads/createFollowup`,
        formData,
      );
      if (response?.status === 201) {
        toast.success(response.message || 'Follow-up Created');
        // navigate('/followups/manage');
      } else {
        toast.error(response?.data?.message || 'Failed to create follow-up.');
      }
    } catch (error: any) {
      console.error('Error creating follow-up:', error);
      toast.error(
        error.response?.data?.message ||
          'Error creating follow-up. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.reference_type &&
      formData.reference_id &&
      formData.salesperson_id &&
      formData.followup_date &&
      formData.notes
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
          Follow-Up Entry
        </h2>

        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Follow-Ups</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">Create</span>
        </div>

        <div className="py-4"></div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reference Type */}
            <div>
              <label className="block text-md font-medium text-black mb-2">
                Reference Type
              </label>
              <Select
                value={
                  formData.reference_type
                    ? {
                        value: formData.reference_type,
                        label: formData.reference_type,
                      }
                    : null
                }
                onChange={(selected) =>
                  handleSelectChange('reference_type', selected?.value || '')
                }
                options={[{ value: 'Lead', label: 'Lead' }]}
                placeholder="Select Reference Type"
                isSearchable={false}
                styles={customSelectStyles}
              />
            </div>

            {/* Reference ID */}
            <div>
              <label className="block text-md font-medium text-black mb-2">
                Reference Id
              </label>
              <input
                type="text"
                name="reference_id"
                value={formData.reference_id}
                onChange={handleChange}
                placeholder="Enter Reference Id"
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] 
                focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                required
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
                    (o) => o.value === formData.salesperson_id,
                  ) || null
                }
                onChange={handleSalesPersonChange}
                options={salesPersonOptions}
                placeholder="Select Sales Person"
                isSearchable
                styles={customSelectStyles}
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-md font-medium text-black mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                name="followup_date"
                value={formData.followup_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] 
                focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
                required
              />
            </div>

            {/* Next Follow-up Date */}
            <div>
              <label className="block text-md font-medium text-black mb-2">
                Next Follow-up Date
              </label>
              <input
                type="date"
                name="next_followup_date"
                value={formData.next_followup_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] 
                focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-md font-medium text-black mb-2">
                Follow-up Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter Notes"
                rows={4}
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] 
                focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
              />
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
              className={`px-15 py-3 rounded font-medium transition-colors 
                ${
                  isFormValid()
                    ? 'bg-[#C32033] text-white hover:bg-[#A91B2E]'
                    : 'bg-gray-400 border border-gray-400 text-gray-700 cursor-not-allowed'
                }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFollowUp;
