import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';
import Loader from '../common/Loader';

interface ImportUser {
  _id: string;
  full_name: string;
  email: string;
  person_number: string;
  department: string;
  department_code: string;
  manager_name: string;
  manager_email: string;
  position: string;
}

const ImportUsers = () => {
  const [users, setUsers] = useState<ImportUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [itemsPerPage] = useState<number>(10); // Number of items per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/api/v1/importUsers/list', {});
        if (response?.status === 200) {
          setUsers(response?.data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <Breadcrumb pageName="Import Users" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Full Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Department
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Manager
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {user.full_name}
                        </h5>
                        <p className="text-sm">{user.person_number}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.email}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.department}
                        </p>
                        <p className="text-sm">{user.department_code}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.manager_name}
                        </p>
                        <p className="text-sm">{user.manager_email}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {user.position}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-5 text-black dark:text-white"
                    >
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
        </div>
      </div>
    </>
  );
};

export default ImportUsers;
