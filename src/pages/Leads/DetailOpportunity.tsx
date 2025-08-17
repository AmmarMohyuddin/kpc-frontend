// import { ChevronRight } from 'lucide-react';

// const DetailOpportunity = () => {
//   const opportunityData = {
//     id: '123434',
//     generationDate: '15/4/2025',
//     salesPerson: 'John Smith',
//     item: 'xxxxx',
//     description: 'xxxxxxxxxx',
//     uom: 'xyz',
//     quantity: 2,
//     amount: 'John Smith',
//     followUpDate: '20/4/2025',
//     latestRemarks: 'xxxxx',
//     followUpLink: 'xxxxx',
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
//           Opportunity Details
//         </h1>

//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//           <span>Leads</span>
//           <ChevronRight className="w-4 h-4" />
//           <span>Manage Leads</span>
//           <ChevronRight className="w-4 h-4" />
//           <span>{opportunityData.id}</span>
//           <ChevronRight className="w-4 h-4" />
//           <span className="text-[#C32033]">Opportunity Details</span>
//         </div>
//       </div>

//       {/* Detail Card */}
//       <div className="rounded border border-gray-200 bg-white px-5 pt-6 pb-6 shadow-md sm:px-7.5">
//         <div className="divide-y divide-gray text-sm text-black space-y-3">
//           {[
//             ['Lead Number', opportunityData.id],
//             ['Generation Date', opportunityData.generationDate],
//             ['Sales Person', opportunityData.salesPerson],
//             ['Item', opportunityData.item],
//             ['Description', opportunityData.description],
//             ['UOM', opportunityData.uom],
//             ['Quantity', opportunityData.quantity],
//             ['Amount', opportunityData.amount],
//             ['Follow Up Date', opportunityData.followUpDate],
//             ['Latest Remarks', opportunityData.latestRemarks],
//             ['Link for Follow Up History', opportunityData.followUpLink],
//           ].map(([label, value]) => (
//             <div key={label} className="flex items-center justify-between py-2">
//               <span className="text-gray-600 font-medium">{label}:</span>
//               <span className="text-gray-900">{value}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailOpportunity;

import { ChevronRight } from 'lucide-react';

const DetailOpportunity = () => {
  const opportunityData = {
    leadNumber: '123434',
    generationDate: '15/4/2025',
    salesPerson: 'John Smith',
    item: 'xxxxx',
    description: 'xxxxxxxxxx',
    uom: 'xyz',
    quantity: 2,
    amount: 'John Smith',
    followUpDate: '20/4/2025',
    latestRemarks: 'xxxxx',
    followUpLink: 'xxxxx',
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
            Opportunity Details
          </h1>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-md text-gray-600 dark:text-gray-400 mt-5">
            <span>Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span>Manage Leads</span>
            <ChevronRight className="w-4 h-4" />
            <span>{opportunityData.leadNumber}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C32033]">Opportunity Details</span>
          </div>
        </div>

        {/* Detail Card */}
        <div className="rounded border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="space-y-6">
            {/* Company */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Lead Number:
              </span>
              <span className="text-black">{opportunityData.leadNumber}</span>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Generation Date:
              </span>
              <span className="text-black">
                {opportunityData.generationDate}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Sales Person:
              </span>
              <span className="text-black">{opportunityData.salesPerson}</span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Item:
              </span>
              <span className="text-black">{opportunityData.item}</span>
            </div>

            {/* Contact Number */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Description:
              </span>
              <span className="text-black">{opportunityData.description}</span>
            </div>

            {/* Contact Job Role */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                UOM:
              </span>
              <span className="text-black">{opportunityData.uom}</span>
            </div>

            {/* Sales Person */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Quantity:
              </span>
              <span className="text-black">{opportunityData.quantity}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Amount:
              </span>
              <span className="text-black">{opportunityData.amount}</span>
            </div>

            {/* Follow Up Date */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Follow Up Date:
              </span>
              <span className="text-black">{opportunityData.followUpDate}</span>
            </div>

            {/* Latest Remarks */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Latest Remarks:
              </span>
              <span className="text-black">
                {opportunityData.latestRemarks}
              </span>
            </div>

            {/* Follow Up Link */}
            <div className="flex items-center justify-between py-1 border-b border-gray">
              <span className="font-bold text-lg text-black dark:text-white">
                Follow Up Link:
              </span>
              <span className="text-black">{opportunityData.followUpLink}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOpportunity;
