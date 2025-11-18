import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import apiService from '../services/ApiService';
import Loader from '../common/Loader';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface ActualVSTargetSalesItem {
  salesperson: string;
  employee_number: string;
  manager_person_no: number | null;
  manager: string | null;
  period: string;
  period_target: number;
  mtd_target: number;
  mtd_actual: number;
  achievement: number;
  variance: number;
}

const ActualVSTargetSales = () => {
  const [salesData, setSalesData] = useState<ActualVSTargetSalesItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<{
    categories: string[];
    actualValues: number[];
    targetValues: number[];
  }>({ categories: [], actualValues: [], targetValues: [] });

  useEffect(() => {
    const fetchActualVSTargetSales = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/api/v1/actualVSTargetSales/list', {});
        if (response?.status === 200 && response?.data?.items) {
          setSalesData(response.data.items);
          processChartData(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching actual vs target sales', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActualVSTargetSales();
  }, []);

  const processChartData = (items: ActualVSTargetSalesItem[]) => {
    // Group by period and sum mtd_actual and mtd_target
    const periodMap = new Map<string, { actual: number; target: number }>();

    items.forEach((item) => {
      const period = item.period || 'Unknown';
      const actual = typeof item.mtd_actual === 'number' ? item.mtd_actual : parseFloat(item.mtd_actual) || 0;
      const target = typeof item.mtd_target === 'number' ? item.mtd_target : parseFloat(item.mtd_target) || 0;
      
      if (periodMap.has(period)) {
        const existing = periodMap.get(period)!;
        periodMap.set(period, {
          actual: existing.actual + actual,
          target: existing.target + target,
        });
      } else {
        periodMap.set(period, { actual, target });
      }
    });

    // Convert map to arrays for chart
    const categories: string[] = [];
    const actualValues: number[] = [];
    const targetValues: number[] = [];

    periodMap.forEach((data, period) => {
      categories.push(period);
      actualValues.push(data.actual);
      targetValues.push(data.target);
    });

    // Sort by period name
    const sorted = categories.map((cat, idx) => ({
      cat,
      actual: actualValues[idx],
      target: targetValues[idx],
    })).sort((a, b) => a.cat.localeCompare(b.cat));

    setChartData({
      categories: sorted.map(s => s.cat),
      actualValues: sorted.map(s => s.actual),
      targetValues: sorted.map(s => s.target),
    });
  };

  const chartOptions: ApexOptions = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
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
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val.toFixed(2);
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Actual Sales',
      data: chartData.actualValues,
    },
    {
      name: 'Target Sales',
      data: chartData.targetValues,
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Actual vs Target Sales" />
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
                  <div className="flex min-w-47.5">
                    <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                      <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
                    </span>
                    <div className="w-full">
                      <p className="font-semibold text-secondary">Target Sales</p>
                      <p className="text-sm font-medium">
                        Comparison View
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div id="actualVSTargetChart" className="-ml-5">
                  <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height={350}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            {salesData.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                  Actual vs Target Sales Data
                </h4>
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                          Salesperson
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Employee Number
                        </th>
                        <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                          Manager
                        </th>
                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                          Period
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          MTD Target
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          MTD Actual
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Achievement %
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Variance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item, index) => (
                        <tr key={index}>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.salesperson}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.employee_number}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.manager || '-'}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">{item.period}</p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              ${item.mtd_target.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              ${item.mtd_actual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item.achievement.toFixed(2)}%
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className={`${item.variance < 0 ? 'text-red-600' : 'text-green-600'} dark:text-white`}>
                              ${item.variance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default ActualVSTargetSales;

