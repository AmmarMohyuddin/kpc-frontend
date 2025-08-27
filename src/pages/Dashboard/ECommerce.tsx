import { useEffect, useState } from 'react';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartFour from '../../components/ChartFour';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import apiService from '../../services/ApiService.ts';

const ECommerce = () => {
  const [counts, setCounts] = useState({
    importUsers: 0,
    users: 0,
    salesPersons: 0,
    customers: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [importUsersRes, usersRes, salesPersonsRes, customersRes] =
          await Promise.all([
            apiService.get('/api/v1/importUsers/list', {}),
            apiService.get('/api/v1/users/list', {}),
            apiService.get('/api/v1/salesPersons/list', {}),
            apiService.get('/api/v1/customers/list', {}),
          ]);

        setCounts({
          importUsers: importUsersRes?.data?.length || 0,
          users: usersRes?.data?.length || 0,
          salesPersons: salesPersonsRes?.data?.length || 0,
          customers: customersRes?.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne title="Imported Users" count={counts.importUsers} />
        <CardTwo title="Customers" count={counts.customers} />
        <CardThree title="Sales Persons" count={counts.salesPersons} />
        <CardFour title="Registered Users" count={counts.users} />
      </div>
      {/* <ChartOne /> */}
      {/* <ChartTwo /> */}
      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <ChartThree />
        </div>
        <div>
          <ChartFour />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
