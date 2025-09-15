import { useState, useEffect, useMemo, useCallback } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../services/ApiService';
import Loader from '../../common/Loader';
import { customSelectStyles } from "../../styles/selectStyle.ts";


interface OptionType {
  value: string;
  label: string;
  stage?: string;
}

interface OpportunityHeader {
  generation_date: string;
  close_date: string;
  status: string;
  salesperson_id: string;
  salesperson_name: string;
  remarks: string;
  stage: string;
}

const EditOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('');
  const [opportunityHeader, setOpportunityHeader] = useState<OpportunityHeader>(
    {
      generation_date: '',
      close_date: '',
      status: '',
      salesperson_id: '',
      salesperson_name: '',
      remarks: '',
      stage: '',
    },
  );
  console.log('Opportunity Header:', opportunityHeader);

  // Status flow for opportunities
  const getNextStatusOptions = useCallback((status: string): OptionType[] => {
    switch (status) {
      case 'Open':
        return [
          { value: 'Negotiating', label: 'Negotiating', stage: 'Engagement' },
          { value: 'On Hold', label: 'On Hold', stage: 'Decision' },
          { value: 'Closed', label: 'Closed', stage: 'Closure' },
        ];

      case 'Negotiating':
        return [
          {
            value: 'Proposal Sent',
            label: 'Proposal Sent',
            stage: 'Engagement',
          },
          { value: 'On Hold', label: 'On Hold', stage: 'Decision' },
          { value: 'Closed', label: 'Closed', stage: 'Closure' },
        ];

      case 'Proposal Sent':
        return [
          { value: 'Won', label: 'Won', stage: 'Decision' },
          { value: 'Lost', label: 'Lost', stage: 'Decision' },
          { value: 'On Hold', label: 'On Hold', stage: 'Decision' },
        ];

      case 'Won':
        return [
          {
            value: 'Won - Converted to Sales Request',
            label: 'Won - Converted to Sales Request',
            stage: 'Closure',
          },
        ];

      case 'Lost':
        return [{ value: 'Closed', label: 'Closed', stage: 'Closure' }];

      case 'On Hold':
        return [
          {
            value: 'Follow-up with Customer',
            label: 'Follow-up with Customer',
            stage: 'Decision',
          },
        ];

      case 'Closed':
      case 'Won - Converted to Sales Request':
        return []; // terminal states

      default:
        return [];
    }
  }, []);

  const currentStatusOption = useMemo(() => {
    if (!opportunityHeader.status) return null;
    return { value: opportunityHeader.status, label: opportunityHeader.status };
  }, [opportunityHeader.status]);

  const nextStatusOptions = useMemo(
    () => getNextStatusOptions(status),
    [status, getNextStatusOptions],
  );

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
          console.log(opp);
          setOpportunityHeader({
            generation_date: opp.GENERATION_DATE?.split('T')[0] || '',
            close_date: opp.CLOSE_DATE?.split('T')[0] || '',
            status: opp.STATUS || '',
            salesperson_id: opp.SALESPERSON_ID || '',
            salesperson_name: opp.SALESPERSON_NAME || '',
            remarks: opp.REMARKS || '',
            stage: opp.STAGE || '',
          });
          setStatus(opp.STATUS || '');
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

  // Handle status change - updated to set both status and stage
  const handleStatusChange = useCallback((selectedOption: any) => {
    setOpportunityHeader((prev) => ({
      ...prev,
      status: selectedOption?.value || '',
      stage: selectedOption?.stage || '', // Set the stage from the selected option
    }));
  }, []);

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
        <h2 className="text-2xl font-semibold mb-3 text-black dark:text-white">
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
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
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
                          (o) => o.value === opportunityHeader.salesperson_id,
                        ) || null
                      : {
                          value: opportunityHeader.salesperson_id,
                          label: opportunityHeader.salesperson_name,
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

            {/* Right */}
            <div className="space-y-6">
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
                  value={opportunityHeader.stage}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-600"
                />
              </div> */}

              <div>
                <label className="block text-md font-medium text-black mb-2">
                  Close Date
                </label>
                <input
                  type="date"
                  name="close_date"
                  value={opportunityHeader.close_date}
                  onChange={handleHeaderInputChange}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
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
                  className="w-full px-4 py-3 bg-[#F4F4F4] border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200"
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
