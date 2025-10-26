import { useEffect, useState } from 'react';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartFour from '../../components/ChartFour';
import apiService from '../../services/ApiService.ts';

const ECommerce = () => {
  const [counts, setCounts] = useState({
    leads: 0,
    opportunities: 0,
    salesRequests: 0,
    salesOrders: 0,
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
        // ✅ Fetch charts & counts in parallel
        const [leadsRes, oppRes, salesRes] = await Promise.all([
          apiService.get('/api/v1/leads/leadChart', {}),
          apiService.get('/api/v1/opportunities/opportunityChart', {}),
          apiService.get('/api/v1/salesRequests/sales-chart', {}),
        ]);
        console.log(salesRes.data);

        // ✅ Leads chart
        setLeadChart({
          data: Object.values(leadsRes.data.monthly_counts || {}),
          categories: Object.keys(leadsRes.data.monthly_counts || {}),
        });

        // ✅ Opportunities chart
        setOppChart({
          data: Object.values(oppRes.data.monthly_counts || {}),
          categories: Object.keys(oppRes.data.monthly_counts || {}),
        });

        // ✅ Counts & Summary chart
        const salesReq = salesRes.data || {};
        setCounts({
          leads: salesReq.leads || 0,
          opportunities: salesReq.opportunities || 0,
          salesRequests: salesReq.salesRequests || 0,
          salesOrders: salesReq.sales_orders || 0, // add in API if missing
        });

        setSummaryChart({
          labels: ['Leads', 'Opportunities', 'Sales Requests'],
          series: [
            salesReq.leads || 0,
            salesReq.opportunities || 0,
            salesReq.sales_request || 0,
          ],
        });
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-[20px] overflow-hidden">
      <p className="text-xl sm:text-2xl mb-4 sm:mb-5 font-semibold text-[#161616]">
        Dashboard
      </p>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-4 w-full">
        <CardOne title="Total Leads" count={counts.leads} />
        <CardTwo title="Total Opportunities" count={counts.opportunities} />
        <CardThree title="Total Sales Requests" count={counts.salesRequests} />
        <CardFour title="Total Sales Orders" count={counts.salesOrders} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 sm:mt-8 lg:mt-10 gap-4 sm:gap-5">
        <div className="w-full">
          <ChartFour
            title="Leads Trend (Last 6 Months)"
            data={leadChart.data}
            categories={leadChart.categories}
          />
        </div>
        <div className="w-full">
          <ChartFour
            title="Opportunities Booked (Last 12 Months)"
            data={oppChart.data}
            categories={oppChart.categories}
            color="#C32033"
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-6 sm:mt-8 lg:mt-10 gap-4 sm:gap-5">
        <div className="w-full">
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
