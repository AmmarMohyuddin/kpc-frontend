import { useState } from 'react';
import CreateOpportunity from './CreateOpportunity';

const CreateLead = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
          <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
            Create Lead
          </h2>

          <form className="space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Choose a Type */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Choose a type
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                      <option value="">Company</option>
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

                {/* Email */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Enter Contact Number"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Status
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
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Contact Job Role */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Contact Job Role
                  </label>
                  <input
                    type="text"
                    name="contactJobRole"
                    placeholder="Enter Contact Job Role"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Sales Person */}
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Sales Person
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033]">
                      <option value="">Select Sales Person</option>
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
              </div>
            </div>

            {/* Create Opportunity Checkbox */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded border-2 bg-[#C32033] border-[#C32033] flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span
                  className="text-[#C32033] font-medium cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Opportunity
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="w-[160px] h-[50px] rounded border border-[#C32033] text-md font-medium text-[#C32033] hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[160px] h-[50px] rounded bg-[#C32033] text-md font-medium text-white hover:bg-[#A91B2E] transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create Opportunity Modal */}
      <CreateOpportunity
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default CreateLead;
