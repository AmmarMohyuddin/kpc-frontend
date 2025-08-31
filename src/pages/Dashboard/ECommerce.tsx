import { useEffect, useState } from 'react';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartFour from '../../components/ChartFour';
// import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import apiService from '../../services/ApiService.ts';

const ECommerce = () => {
  const [counts, setCounts] = useState({
    importUsers: 0,
    users: 0,
    salesPersons: 0,
    customers: 0,
    // leads: 0,
    // opportunities: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          importUsersRes,
          usersRes,
          salesPersonsRes,
          customersRes,
          // leadsRes,
          // opportunitiesRes,
        ] = await Promise.all([
          apiService.get('/api/v1/importUsers/list', {}),
          apiService.get('/api/v1/users/list', {}),
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get('/api/v1/customers/list', {}),
          // apiService.get('/api/v1/leads/list', {}),
          // apiService.get('/api/v1/opportunities/list', {}),
        ]);

        setCounts({
          importUsers: importUsersRes?.data?.length || 0,
          users: usersRes?.data?.length || 0,
          salesPersons: salesPersonsRes?.data?.length || 0,
          customers: customersRes?.data?.length || 0,
          // leads: leadsRes?.data?.length || 0,
          // opportunities: opportunitiesRes?.data?.length || 0,
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
      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <ChartFour
            title="Leads Trend (Last 6 Months)"
            data={[10, 20, 15, 30, 25, 40, 35]}
            categories={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
          />
        </div>
        <div>
          <ChartFour
            title="Opportunities Booked (Last 12 Months)"
            data={[5, 12, 8, 15, 10, 18, 20, 22, 25, 30, 28, 35]}
            categories={[
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ]}
            color="#C32033"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <ChartThree
            title="Sales Request (Open vs Closed)"
            labels={['Open', 'Closed']}
            series={[70, 30]}
            colors={['#10B981', '#EF4444']}
          />
        </div>
        <div>
          <ChartFour
            title="Order Outcomes"
            data={[10, 20, 15, 30]}
            categories={['Lead', 'Opportunity', 'Requests', 'Orders']}
          />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
