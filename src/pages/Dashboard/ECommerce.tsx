import { useEffect, useState } from 'react';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartFour from '../../components/ChartFour';
import apiService from '../../services/ApiService.ts';

const ECommerce = () => {
  const [counts, setCounts] = useState({
    importUsers: 0,
    users: 0,
    salesPersons: 0,
    customers: 0,
  });

  const [leadChart, setLeadChart] = useState({ data: [], categories: [] });
  const [oppChart, setOppChart] = useState({ data: [], categories: [] });
  const [summaryChart, setSummaryChart] = useState({
    labels: [],
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch all counts in parallel
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

        // ✅ Fetch charts in parallel
        const [leadsRes, oppRes, salesRes] = await Promise.all([
          apiService.get('/api/v1/leads/leadChart', {}),
          apiService.get('/api/v1/opportunities/opportunityChart', {}),
          apiService.get('/api/v1/salesRequests/sales-chart', {}),
        ]);

        // Leads
        setLeadChart({
          data: Object.values(leadsRes.data.monthly_counts || {}),
          categories: Object.keys(leadsRes.data.monthly_counts || {}),
        });

        // Opportunities
        setOppChart({
          data: Object.values(oppRes.data.monthly_counts || {}),
          categories: Object.keys(oppRes.data.monthly_counts || {}),
        });

        // Sales Requests + Summary Chart
        const salesReq = salesRes.data || {};
        setSummaryChart({
          labels: ['Leads', 'Opportunities', 'Sales Requests'],
          series: [
            salesReq.leads || 0,
            salesReq.opportunities || 0,
            salesReq.salesRequests || 0,
          ],
        });
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-5 rounded-[20px]">
      <p className="text-[24px] mb-5 font-semibold text-[#161616]">Dashboard</p>

      {/* Top Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-6">
        <CardOne title="Imported Users" count={counts.importUsers} />
        <CardTwo title="Customers" count={counts.customers} />
        <CardThree title="Sales Persons" count={counts.salesPersons} />
        <CardFour title="Registered Users" count={counts.users} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <ChartFour
            title="Leads Trend (Last 6 Months)"
            data={leadChart.data}
            categories={leadChart.categories}
          />
        </div>
        <div>
          <ChartFour
            title="Opportunities Booked (Last 12 Months)"
            data={oppChart.data}
            categories={oppChart.categories}
            color="#C32033"
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 mt-10 gap-5">
        {/* Left chart removed to keep your same design */}
        <div>
          <ChartFour
            title="Order Outcomes"
            data={summaryChart.series}
            categories={summaryChart.labels}
            color="#14DFB9"
          />
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
