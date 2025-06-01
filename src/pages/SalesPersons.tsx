import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';
import Loader from '../common/Loader';

interface SalesPerson {
  _id: string;
  salesperson_id: string;
  salesperson_name: string;
  employee_number: string;
  registered: boolean;
  last_update_date: string;
  createdAt: string;
  updatedAt: string;
}

const SalesPersons = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<SalesPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/api/v1/salesPersons/list', {});
        if (response?.status === 200) {
          setUsers(response?.data || []);
          console.log('Sales Persons:', response?.data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <Breadcrumb pageName="Sales Persons" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Sales Person Name
                  </th>
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Sales Person ID
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Person Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      <Loader />
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td
                        className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                        onClick={() =>
                          navigate(`/sales/${user._id}`, { state: { user } })
                        }
                      >
                        <h5 className="font-medium text-black dark:text-white">
                          {user.salesperson_name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 xl:pl-11 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.salesperson_id}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.employee_number}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-5 text-black dark:text-white"
                    >
                      No sales persons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center justify-center rounded-md border border-black py-2 px-6 text-center font-medium text-black hover:bg-opacity-90 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>
              <span className="text-black dark:text-white">
                Page <b>{currentPage}</b> of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`inline-flex items-center justify-center rounded-md border border-black py-2 px-6 text-center font-medium text-black hover:bg-opacity-90 ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesPersons;
