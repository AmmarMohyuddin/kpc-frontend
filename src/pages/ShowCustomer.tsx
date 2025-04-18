import Breadcrumb from '../components/Breadcrumb';
import { useLocation } from 'react-router-dom';

const ShowCustomer = () => {
  const location = useLocation();
  const { customer } = location.state || {};
  return (
    <>
      <Breadcrumb pageName="Show Customer" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <h3 className="text-[22px] font-semibold text-black dark:text-white border-b border-[#eee] py-3  dark:border-strokedark">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-4">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Customer Name:
                </h5>
                <span className="text-black dark:text-white">
                  {customer?.party_name}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Account Number:
                </h5>
                <span className="text-black dark:text-white">
                  {customer?.account_number}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Address:
                </h5>
                <span className="text-black dark:text-white">
                  {customer?.address_line_1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-4">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Customer Email:
                </h5>

                <div className="relative mt-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    name="email"
                    value={''}
                    onChange={() => {}}
                    required
                  />
                </div>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Customer Password:
                </h5>
                <div className="relative mt-2">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    name="email"
                    value={''}
                    onChange={() => {}}
                    required
                  />
                </div>
              </div>
              <div></div>
            </div>

            <div className="flex justify-start p-4">
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowCustomer;
