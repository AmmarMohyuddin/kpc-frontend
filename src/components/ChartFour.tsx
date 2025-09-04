import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartFourProps {
  title?: string;
  data: number[];
  categories: string[];
  color?: string;
}

const ChartFour: React.FC<ChartFourProps> = ({
  title = 'Dynamic Chart',
  data,
  categories,
  color = '#3C50E0',
}) => {
  const options: ApexOptions = {
    colors: [color],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 2 },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ['transparent'] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'inter',
      markers: { radius: 99 },
    },
    grid: {
      yaxis: { lines: { show: false } },
    },
    fill: { opacity: 1 },
    tooltip: { x: { show: false } },
  };

  const series = [{ data }];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
        {title}
      </h3>
      <div id="chartFour" className="-ml-5">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={294}
        />
      </div>
    </div>
  );
};

export default ChartFour;
