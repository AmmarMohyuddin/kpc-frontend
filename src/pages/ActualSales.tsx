import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';
import Loader from '../common/Loader';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface ActualSalesItem {
  employee_number: string;
  salesrep_name: string;
  customer_category_code: string;
  sales_period: string;
  actual_sales: number;
}

const ActualSales = () => {
  const [salesData, setSalesData] = useState<ActualSalesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<{
    categories: string[];
    values: number[];
  }>({ categories: [], values: [] });

  useEffect(() => {
    const fetchActualSales = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/api/v1/actualSales/list', {});
        if (response?.status === 200 && response?.data?.items) {
          setSalesData(response.data.items);
          processChartData(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching actual sales', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualSales();
  }, []);

  const processChartData = (items: ActualSalesItem[]) => {
    // Group by sales_period and sum actual_sales
    const periodMap = new Map<string, number>();

    items.forEach((item) => {
      const period = item.sales_period || 'Unknown';
      const sales = typeof item.actual_sales === 'number' ? item.actual_sales : parseFloat(item.actual_sales) || 0;
      
      if (periodMap.has(period)) {
        periodMap.set(period, periodMap.get(period)! + sales);
      } else {
        periodMap.set(period, sales);
      }
    });

    // Convert map to arrays for chart
    const categories: string[] = [];
    const values: number[] = [];

    periodMap.forEach((totalSales, period) => {
      categories.push(period);
      values.push(totalSales);
    });

    // Sort by period name
    const sorted = categories.map((cat, idx) => ({ cat, val: values[idx] }))
      .sort((a, b) => a.cat.localeCompare(b.cat));

    setChartData({
      categories: sorted.map(s => s.cat),
      values: sorted.map(s => s.val),
    });
  };

  const chartOptions: ApexOptions = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Sales Amount',
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val.toFixed(2);
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Actual Sales',
      data: chartData.values,
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Actual Sales" />
      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : (
          <>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                  <div className="flex min-w-47.5">
                    <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                      <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                    </span>
                    <div className="w-full">
                      <p className="font-semibold text-primary">Actual Sales</p>
                      <p className="text-sm font-medium">
                        Total Records: {salesData.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div id="actualSalesChart" className="-ml-5">
                  <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            {salesData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                  Actual Sales Data
                </h4>
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Employee Number
                        </th>
                        <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                          Sales Rep Name
                        </th>
                        <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                          Customer Category
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Sales Period
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                          Actual Sales
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item, index) => (
                        <tr key={index}>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.employee_number}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.salesrep_name}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.customer_category_code}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.sales_period}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              ${item.actual_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ActualSales;

