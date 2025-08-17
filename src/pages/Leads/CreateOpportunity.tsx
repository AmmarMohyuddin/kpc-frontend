import { X, Calendar } from 'lucide-react';
import type React from 'react';

interface CreateOpportunityProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateOpportunity = ({
  isModalOpen,
  setIsModalOpen,
}: CreateOpportunityProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCancel}
          ></div>

          {/* Modal Content */}
          <div className="relative mt-20 bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-semibold text-black">
                Create Opportunity
              </h2>
              <button onClick={handleCancel}>
                <X className="w-5 h-5 text-[#C32033]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Lead Number
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full px-4 py-3 bg-[#FFD7D7] text-black border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Sales Person
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033]">
                        <option value="">Select Status</option>
                        <option value="">USA</option>
                        <option value="">UK</option>
                        <option value="">Canada</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      UOM
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033]">
                        <option value="">Select Status</option>
                        <option value="">USA</option>
                        <option value="">UK</option>
                        <option value="">Canada</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Latest Remarks
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Amount
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Generation Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Item
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033]">
                        <option value="">Select Status</option>
                        <option value="">USA</option>
                        <option value="">UK</option>
                        <option value="">Canada</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Quantity
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033]">
                        <option value="">Select Status</option>
                        <option value="">USA</option>
                        <option value="">UK</option>
                        <option value="">Canada</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Follow Up Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Link for Follow up History
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-md font-medium text-black mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Write..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] placeholder-gray-500 resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-15 py-3 rounded-lg bg-[#C32033] text-white font-medium hover:bg-[#A91B2E] transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateOpportunity;
