import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';
import Loader from '../common/Loader';

interface Customer {
  _id: string;
  party_name: string;
  account_number: string;
  party_id: number;
  party_site_number: string;
  party_site_name: string | null;
  party_site_id: number;
  site_use_code: string;
  site_use_id: number;
  cust_acct_site_id: number;
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  createdAt: string;
  updatedAt: string;
}

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/api/v1/customers/list', {});
        if (response?.status === 200) {
          setCustomers(response?.data);
        }
      } catch (error) {
        console.error('Error fetching customers', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  return (
    <>
      <Breadcrumb pageName="Customers" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Customer Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Account Number
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Customer ID
                  </th>
                  {/* <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Site Code
                  </th> */}
                  <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && currentItems.length > 0 ? (
                  currentItems.map((customer) => (
                    <tr key={customer._id}>
                      <td
                        className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                        onClick={() =>
                          navigate(`/customers/${customer._id}`, {
                            state: { customer },
                          })
                        }
                      >
                        <h5 className="font-medium text-black dark:text-white">
                          {customer.party_name}
                        </h5>
                        <p className="text-sm">
                          {customer.party_site_name || '-'}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {customer.account_number}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {customer.party_id}
                        </p>
                      </td>
                      {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {customer.site_use_code}
                        </p>
                      </td> */}
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {customer.address_line_1}
                        </p>
                        <p className="text-sm">
                          {customer.address_line_2 || ''}{' '}
                          {customer.address_line_3 || ''}
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-md border border-black py-2 px-4 font-medium text-black hover:bg-opacity-90"
            >
              Previous
            </button>
            <span>
              Page <b>{currentPage}</b> of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center rounded-md border border-black py-2 px-4 font-medium text-black hover:bg-opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
