import { useEffect, useState } from 'react';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartFour from '../../components/ChartFour';
import ChartThree from '../../components/ChartThree.tsx'; // ✅ use Pie chart
import apiService from '../../services/ApiService.ts';

const ECommerce = () => {
  const [counts, setCounts] = useState({
    importUsers: 0,
    users: 0,
    salesPersons: 0,
    customers: 0,
  });

  const [leadChart, setLeadChart] = useState<{
    data: number[];
    categories: string[];
  }>({ data: [], categories: [] });
  const [oppChart, setOppChart] = useState<{
    data: number[];
    categories: string[];
  }>({ data: [], categories: [] });

  // ✅ new state for orders
  const [orderOutcomeChart, setOrderOutcomeChart] = useState<{
    labels: string[];
    series: number[];
  }>({ labels: [], series: [] });

  const [salesRequestChart, setSalesRequestChart] = useState<{
    labels: string[];
    series: number[];
  }>({ labels: [], series: [] });

  const [leadCount, setLeadCount] = useState(0);
  const [opportunityCount, setOpportunityCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [salesRequestCount, setSalesRequestCount] = useState(0);

  const [summaryChart, setSummaryChart] = useState<{
    labels: string[];
    series: number[];
  }>({ labels: [], series: [] });

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

    const fetchCharts = async () => {
      try {
        const [leadsRes, oppRes, orderRes, salesRes] = await Promise.all([
          apiService.get('/api/v1/leads/leadChart', {}),
          apiService.get('/api/v1/opportunities/opportunityChart', {}),
          apiService.get('/api/v1/salesOrders/order-chart', {}),
          apiService.get('/api/v1/salesRequests/sales-chart', {}),
        ]);

        // Leads
        const leadTotal = leadsRes.data.total_leads || 0;
        setLeadChart({
          data: Object.values(leadsRes.data.monthly_counts),
          categories: Object.keys(leadsRes.data.monthly_counts),
        });
        setLeadCount(leadTotal);

        // Opportunities
        const oppTotal = oppRes.data.total_opportunities || 0;
        setOppChart({
          data: Object.values(oppRes.data.monthly_counts),
          categories: Object.keys(oppRes.data.monthly_counts),
        });
        setOpportunityCount(oppTotal);

        // Orders (Pie)
        const orderTotal =
          (orderRes.data.open_orders || 0) + (orderRes.data.closed_orders || 0);
        setOrderOutcomeChart({
          labels: Object.keys(orderRes.data),
          series: Object.values(orderRes.data),
        });
        setOrderCount(orderTotal);

        // Sales Requests
        const salesReqTotal = salesRes.data.sales_requests || 0;
        setSalesRequestCount(salesReqTotal);

        // ✅ Build Summary Chart directly
        setSummaryChart({
          labels: ['Leads', 'Opportunities', 'Sales Orders', 'Sales Requests'],
          series: [leadTotal, oppTotal, orderTotal, salesReqTotal],
        });
      } catch (error) {
        console.error('Error fetching charts:', error);
      }
    };

    fetchCounts();
    fetchCharts();
  }, []);

  console.log('Summary Chart:', summaryChart);

  return (
    <div className="bg-white p-5 rounded-[20px]">
      <p className="text-[24px] mb-5 font-semibold text-[#161616]">Dashboard</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-6">
        <CardOne title="Imported Users" count={counts.importUsers} />
        <CardTwo title="Customers" count={counts.customers} />
        <CardThree title="Sales Persons" count={counts.salesPersons} />
        <CardFour title="Registered Users" count={counts.users} />
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne title="Imported Users" count={counts.importUsers} />
        <CardTwo title="Customers" count={counts.customers} />
        <CardThree title="Sales Persons" count={counts.salesPersons} />
        <CardFour title="Registered Users" count={counts.users} />
      </div> */}
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

      <div className="grid grid-cols-2 mt-10 gap-5">
        <div>
          <ChartThree
            title="Order Outcomes (Open vs History)"
            labels={['Open Orders', 'Closed Orders']}
            series={orderOutcomeChart.series}
            colors={['#EE6666', '#91CC75']}
          />
        </div>
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
