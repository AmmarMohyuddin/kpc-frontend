import Breadcrumb from '../components/Breadcrumb';
import { useLocation } from 'react-router-dom';

const ShowUser = () => {
  const location = useLocation();
  const { user } = location.state || {};
  return (
    <>
      <Breadcrumb pageName="Show User" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <h3 className="text-[22px] font-semibold text-black dark:text-white border-b border-[#eee] py-3  dark:border-strokedark">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-4">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Full Name:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.full_name}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Email:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.email}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Person Number:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.person_number}
                </span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Role:
                </h5>
                <span className="text-black dark:text-white">{user?.role}</span>
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  Approval Status:
                </h5>
                <span className="text-black dark:text-white">
                  {user?.is_approved ? 'Approved' : 'Not Approved'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowUser;
