import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';

const ShowSalesPersons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const response = await apiService.post('/api/v1/salesPersons/register', {
        person_number: user?.employee_number,
        full_name: user?.salesperson_name,
        email: formData.email,
      });

      if (response.status === 201) {
        toast.success(response?.message);
        navigate('/sales');
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        (error as { message?: string })?.message || 'Registration failed';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sales Persons" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <h3 className="text-[22px] font-semibold text-black dark:text-white border-b border-[#eee] py-3 dark:border-strokedark">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-5 p-4">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Sales Person Id:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.salesperson_id}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Sales Person Name:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.salesperson_name}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Person Number:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.employee_number}
                </span>
              </div>

              {/* Only show these fields and the register button if user is not registered */}
              {!user?.registered && (
                <>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Sales Person Email:
                    </h5>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex justify-start p-4">
                    <button
                      onClick={handleRegister}
                      className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
                    >
                      Register
                    </button>
                  </div>
                </>
              )}

              {/* Show a message if the user is already registered */}
              {user?.registered && (
                <div className="p-4">
                  <p className="text-green-500">You are already registered.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowSalesPersons;
