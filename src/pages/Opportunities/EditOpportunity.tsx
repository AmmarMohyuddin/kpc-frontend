import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';

interface OptionType {
  value: string;
  label: string;
}

interface OpportunityHeader {
  generation_date: string;
  close_date: string;
  status: string; // always keep it string for consistency
  salesperson_id: string;
  salesperson_name: string;
  remarks: string;
  // order_lines: any[];
}

const EditOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // /opportunities/edit/:id
  const [loading, setLoading] = useState(false);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [opportunityHeader, setOpportunityHeader] = useState<OpportunityHeader>(
    {
      generation_date: '',
      close_date: '',
      status: '',
      salesperson_id: '',
      salesperson_name: '',
      remarks: '',
      // order_lines: [],
    },
  );
  console.log('Opportunity Header:', opportunityHeader);

  // Status options
  const statusOptions: OptionType[] = [
    { value: '1', label: 'Open' },
    // { value: '2', label: 'New' },
  ];

  // Logged in user
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  // Salesperson options
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

  // Fetch sales persons + opportunity header
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [salesPersonsRes, oppRes] = await Promise.all([
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get(`/api/v1/opportunities/detailOpportunity/${id}`, {}),
        ]);

        setSalesPersons(salesPersonsRes.data || []);

        if (oppRes.data && oppRes.data[0]) {
          const opp = oppRes.data[0];
          setOpportunityHeader({
            generation_date: opp.GENERATION_DATE?.split('T')[0] || '',
            close_date: opp.CLOSE_DATE?.split('T')[0] || '',
            status: String(opp.STATUS || ''), // always string
            salesperson_id: opp.SALESPERSON_ID || '',
            salesperson_name: opp.SALESPERSON_NAME || '',
            remarks: opp.REMARKS || '',
            // order_lines: opp.ORDER_LINES || [],
          });
        }
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        toast.error('Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle input changes
  const handleHeaderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOpportunityHeader((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeaderSelectChange = (
    name: keyof OpportunityHeader,
    selectedOption: OptionType | null,
  ) => {
    const value = selectedOption?.value || '';
    setOpportunityHeader((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalesPersonChange = (selected: OptionType | null) => {
    setOpportunityHeader((prev) => ({
      ...prev,
      salesperson_id: selected?.value || '',
      salesperson_name: selected?.label || '',
    }));
  };

  // Save updated header
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.post(
        '/api/v1/opportunities/editOpportunity',
        { id, ...opportunityHeader },
      );
      if (response.status === 200) {
        toast.success('Opportunity updated!');
        navigate('/opportunities/manage');
      } else {
        toast.error('Failed to update.');
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Custom select styles (same as create)
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
      backgroundColor: state.isFocused
        ? '#FFD7D7'
        : state.isSelected
        ? '#FFD7D7'
        : provided.backgroundColor,
      color: '#000',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#C32033',
    }),
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
          <h2 className="text-2xl font-semibold mb-6 text-black">
            Edit Opportunity
          </h2>
          <button
            onClick={() =>
              navigate('/opportunities/listing', {
                state: { opportunity_id: id },
              })
            }
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-[#C32033] text-white hover:bg-[#A91B2E]"
          >
            Update Items
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-6">
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Generation Date
                </label>
                <input
                  type="date"
                  name="generation_date"
                  value={opportunityHeader.generation_date}
                  onChange={handleHeaderInputChange}
                  className="custom-input-date w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none focus:border-[#C32033]"
                />
              </div>

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

            {/* Right */}
            <div className="space-y-6">
              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  value={
                    statusOptions.find(
                      (o) => o.value === opportunityHeader.status,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    handleHeaderSelectChange('status', selectedOption)
                  }
                  isSearchable
                  styles={customSelectStyles}
                  placeholder="Select Status"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Close Date
                </label>
                <input
                  type="date"
                  name="close_date"
                  value={opportunityHeader.close_date}
                  onChange={handleHeaderInputChange}
                  className="custom-input-date w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none focus:border-[#C32033]"
                />
              </div>
            </div>
          </div>

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
              className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#c32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/opportunities/manage')}
              className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[160px] h-[50px] rounded bg-[#C32033] text-md font-medium text-white hover:bg-[#A91B2E] transition-colors"
              disabled={loading}
            >
              {loading ? 'Updating' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
