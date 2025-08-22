import { ChevronRight } from 'lucide-react';
import Select, { components } from 'react-select';
import { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/ApiService';
import { toast } from 'react-hot-toast';
import Loader from '../../common/Loader';

// Type definitions
type Address = string;

type Account = {
  account_number: string;
  addresses: Address[];
};

type Price = {
  base_price: number;
};

type Customer = {
  _id: string;
  party_id: string;
  party_name: string;
  accounts: Account[];
};

interface AddressFormData {
  name: string;
  city: string;
  contactNumber: string;
  block: string;
  shippingAddress: string;
}

interface OptionType {
  value: string;
  label: string;
}

type CustomerFormData = {
  customer_id: string;
  customer_name: string;
  account_number: string;
  address: string;
  payment_term: string;
  customer_po_number: string;
  salesperson_id: string;
  salesperson_name: string;
};

type ItemFormData = {
  item_detail: string;
  item_number: string;
  unit_of_measure: string;
  sub_category: string;
  description: string;
  instructions: string;
  order_quantity: number;
  requested_shipment_date: Date;
  price: number;
  line_amount: number;
};

const EditSalesRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order_header_id, item_number, mode } = location.state || {};
  console.log('Order Header ID:', order_header_id);
  console.log('Item Number:', item_number);
  console.log('Mode:', mode);

  // State management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesPersons, setSalesPersons] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [addressLine, setAddressLine] = useState<string[]>([]);
  const [paymentTerm, setPaymentTerm] = useState<string[]>([]);
  const [itemDetail, setItemDetail] = useState<string[]>([]);
  const [price, setPrice] = useState<Price[]>([]);
  const [cityOptions, setCityOptions] = useState<OptionType[]>([]);
  const [blockOptions, setBlockOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);

  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>({
    customer_id: '',
    customer_name: '',
    account_number: '',
    address: '',
    payment_term: '',
    customer_po_number: '',
    salesperson_id: '',
    salesperson_name: '',
  });
  console.log('Initial customerFormData:', customerFormData);

  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    name: '',
    city: '',
    contactNumber: '',
    block: '',
    shippingAddress: '',
  });

  console.log('Initial addressFormData:', addressFormData);

  const [itemFormData, setItemFormData] = useState<ItemFormData>({
    item_detail: '',
    item_number: '',
    unit_of_measure: '',
    sub_category: '',
    description: '',
    instructions: '',
    order_quantity: 0,
    requested_shipment_date: new Date(),
    price: 0.0,
    line_amount: 0.0,
  });

  console.log('Initial itemFormData:', itemFormData);

  // Helper functions
  const mapToOptions = (data: any[]): OptionType[] => {
    return Array.isArray(data)
      ? data.map((item) => ({ value: item.name, label: item.name }))
      : [];
  };

  const handleInputChange = useCallback(
    (field: keyof AddressFormData, value: string) => {
      setAddressFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // First fetch initial data (customers, salespersons, items, etc.)
        const [
          citiesResponse,
          blocksResponse,
          customersResponse,
          salesPersonsResponse,
          itemsResponse,
        ] = await Promise.all([
          apiService.get('/api/v1/cities/list', {}),
          apiService.get('/api/v1/blocks/list', {}),
          apiService.get('/api/v1/customers/list', {}),
          apiService.get('/api/v1/salesPersons/list', {}),
          apiService.get('/api/v1/items/list', {}),
        ]);

        setCityOptions(mapToOptions(citiesResponse.data));
        setBlockOptions(mapToOptions(blocksResponse.data));
        setCustomers(customersResponse.data || []);
        if (salesPersonsResponse?.status === 200)
          setSalesPersons(salesPersonsResponse.data);
        if (itemsResponse?.status === 200) setItems(itemsResponse.data);

        // Then fetch sales request data if order_header_id exists
        if (order_header_id) {
          const salesResponse = await apiService.post(
            '/api/v1/salesRequests/detail-sales-request',
            { order_header_id },
          );

          salesResponse.data.ORDER_LINES.filter(
            (line: any) => line.ITEM_NUMBER === item_number,
          ).forEach((line: any) => {
            setItemFormData((prev) => ({
              ...prev,
              item_detail: line.DESCRIPTION || '', // Changed from ITEM_DETAIL to DESCRIPTION
              item_number: line.ITEM_NUMBER || '',
              unit_of_measure: line.UOM || '', // Changed from UNIT_OF_MEASURE to UOM
              sub_category: line.SUBCATEGORY || '',
              description: line.DESCRIPTION || '',
              instructions: line.INSTRUCTIONS || '',
              requested_shipment_date: line.REQUESTED_SHIP_DATE || '', // Changed from REQUESTED_SHIPMENT_DATE to REQUESTED_SHIP_DATE
              order_quantity: line.ORDER_QUANTITY || 0,
              price: line.PRICE || 0.0,
              line_amount: line.AMOUNT || 0.0, // Changed from LINE_AMOUNT to AMOUNT
            }));
          });

          console.log('Sales Request Data Response:', salesResponse);
          if (salesResponse?.status === 200 && salesResponse.data) {
            setCustomerFormData((prev) => ({
              ...prev,
              customer_id: salesResponse.data.CUSTOMER_ID || '',
              customer_name: salesResponse.data.CUSTOMER_NAME || '',
              account_number: salesResponse.data.CUSTOMER_ACCOUNT_NUMBER || '',
              address: salesResponse.data.ADDRESS_LINE_1 || '',
              payment_term: salesResponse.data.PAYMENT_TERM || '',
              customer_po_number: salesResponse.data.CUSTOMER_PO_NUMBER || '',
              salesperson_name: salesResponse.data.SALESPERSON || '',
              // salesperson_id: salesResponse.data.SALESPERSON || '',
            }));
            setAddressFormData((prev) => ({
              ...prev,
              name: salesResponse.data.CONTACT_PERSON || '',
              city: salesResponse.data.CUSTOMER_CITY || '',
              contactNumber: salesResponse.data.CONTACT_NUMBER || '',
              block: salesResponse.data.CUSTOMER_BLOCK || '',
              shippingAddress: salesResponse.data.CUSTOMER_ADDRESS || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [order_header_id]);

  // Form handlers
  const handleUpdateOrderHeader = async () => {
    try {
      setLoading(true);
      const response = await apiService.post(
        '/api/v1/salesRequests/edit-sales-request',
        {
          order_header_id,
          customer_name: customerFormData.customer_name,
          account_number: customerFormData.account_number,
          address: customerFormData.address,
          payment_term: customerFormData.payment_term,
          customer_po_number: customerFormData.customer_po_number,
          salesperson_name: customerFormData.salesperson_name,
          contact_person: addressFormData.name,
          customer_city: addressFormData.city,
          contact_number: addressFormData.contactNumber,
          customer_block: addressFormData.block,
          shipping_address: addressFormData.shippingAddress,
        },
      );

      if (response?.status === 200) {
        toast.success('Order Header updated!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating order header:', error);
      toast.error('Failed to update order header.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderLine = async () => {
    try {
      setLoading(true);
      const response = await apiService.post(
        '/api/v1/salesRequests/edit-sales-request',
        {
          order_header_id,
          item_detail: itemFormData.item_detail,
          item_number: itemFormData.item_number,
          unit_of_measure: itemFormData.unit_of_measure,
          sub_category: itemFormData.sub_category,
          description: itemFormData.description,
          instructions: itemFormData.instructions,
          requested_shipment_date: itemFormData.requested_shipment_date,
          order_quantity: itemFormData.order_quantity,
          price: itemFormData.price,
          line_amount: itemFormData.line_amount,
        },
      );

      if (response?.status === 200) {
        toast.success('Order Line updated!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating order line:', error);
      toast.error('Failed to update order line.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    setItemFormData((prevData) => ({
      ...prevData,
      price: newValue,
      line_amount: prevData.order_quantity * newValue,
    }));
  };

  const handleCustomerSelect = async (selectedOption: any) => {
    if (!selectedOption) return;

    setCustomerFormData((prev) => ({
      ...prev,
      customer_id: selectedOption.value,
      customer_name: selectedOption.label,
      address: '',
      payment_term: '',
      account_number: '',
    }));

    try {
      const response = await apiService.get(
        `/api/v1/customers/list?customer_name=${selectedOption.label}`,
        {},
      );
      setAccountNumbers(response.data);
    } catch (error) {
      console.error('Error fetching account numbers:', error);
    }
  };

  const handleAccountNumberSelect = async (selectedOption: any) => {
    if (!selectedOption) return;

    setCustomerFormData((prev) => ({
      ...prev,
      account_number: selectedOption.value,
    }));

    try {
      const response = await apiService.get(
        `/api/v1/customers/list?customer_name=${customerFormData.customer_name}&account_number=${selectedOption.label}`,
        {},
      );
      setAddressLine(response.data?.addressLines || []);
      setPaymentTerm(response.data?.paymentTerms || []);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Helper function to find customer option
  const findCustomerOption = (customerId: string) => {
    if (!customerId) return null;

    // First try exact match
    const exactMatch = customerOptions.find((o) => o.value === customerId);

    if (exactMatch) return exactMatch;

    // If no exact match, try to find by customer name from form data
    if (customerFormData.customer_name) {
      const nameMatch = customerOptions.find(
        (o) => o.label === customerFormData.customer_name,
      );
      if (nameMatch) return nameMatch;
    }

    // If still not found, create a temporary option
    if (customerFormData.customer_name) {
      return {
        value: customerId,
        label: customerFormData.customer_name,
      };
    }

    return null;
  };

  const findAccountOption = (accountNumber: string) => {
    if (!accountNumber) return null;

    const match = accountNumberOptions.find((o) => o.value === accountNumber);

    return match || { value: accountNumber, label: accountNumber };
  };

  const findAddressOption = (address: string) => {
    if (!address) return null;

    const match = addressLineOptions.find((o) => o.value === address);

    return match || { value: address, label: address };
  };

  const findPaymentTermOption = (paymentTerm: string) => {
    if (!paymentTerm) return null;

    const match = paymentTermOptions.find((o) => o.value === paymentTerm);

    return match || { value: paymentTerm, label: paymentTerm };
  };

  const findSalesPersonOption = (
    salespersonId: string,
    salespersonName: string,
  ) => {
    if (!salespersonId) return null;

    const match = salesPersonOptions.find((o) => o.value === salespersonId);

    return match || { value: salespersonId, label: salespersonName };
  };

  const findItemOption = (itemNumber: string) => {
    if (!itemNumber) return null;

    const match = itemsOptions.find((o) => o.value === itemNumber);

    return match || { value: itemNumber, label: itemNumber };
  };

  const findUnitOfMeasureOption = (unitOfMeasure: string) => {
    if (!unitOfMeasure) return null;

    const match = unitOfMeasureOptions.find((o) => o.value === unitOfMeasure);

    return match || { value: unitOfMeasure, label: unitOfMeasure };
  };

  const findSubCategoryOption = (subCategory: string) => {
    if (!subCategory) return null;

    const match = subCategoryOptions.find((o) => o.value === subCategory);

    return match || { value: subCategory, label: subCategory };
  };

  const findDescriptionOption = (description: string) => {
    if (!description) return null;

    const match = descriptionOptions.find((o) => o.value === description);

    return match || { value: description, label: description };
  };

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

  const salesPersonOptions = salesPersons
    .filter(
      (person: any) => person.employee_number === loggedInUser.person_number,
    ) // only logged-in salesperson
    .map((person: any) => ({
      value: person._id,
      label: person.salesperson_name,
    }));

  // Select component options
  // const salesPersonOptions = salesPersons.map((person: any) => ({
  //   value: person._id,
  //   label: person.salesperson_name,
  // }));

  const customerOptions = customers.map((customer: any) => ({
    value: customer._id,
    label: customer.party_name,
  }));

  const accountNumberOptions = accountNumbers.map((account: any) => ({
    value: account,
    label: account,
  }));

  const addressLineOptions = addressLine.map((address: any) => ({
    value: address,
    label: address,
  }));

  const paymentTermOptions = paymentTerm.map((paymentTerm: any) => ({
    value: paymentTerm,
    label: paymentTerm,
  }));

  const itemsOptions = items.map((item: any) => ({
    value: item.item_number,
    label: item.item_detail,
  }));

  const unitOfMeasureOptions = itemDetail.map((item: any) => ({
    value: item.unit_of_measure,
    label: item.unit_of_measure,
  }));

  const subCategoryOptions = itemDetail.map((item: any) => ({
    value: item.sub_cat,
    label: item.sub_cat,
  }));

  const descriptionOptions = itemDetail.map((item: any) => ({
    value: item.description,
    label: item.description,
  }));

  // Custom styles for Select components
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '50px',
      height: '50px',
      borderColor: state.isFocused ? '#C32033' : provided.borderColor,
      boxShadow: state.isFocused ? '0 0 0 1px #C32033' : provided.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? '#C32033' : provided.borderColor,
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '50px',
      padding: '0 8px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#FFD7D7'
        : state.isFocused
        ? '#FFD7D7'
        : provided.backgroundColor,
      color: '#000',
      '&:active': {
        backgroundColor: state.isSelected ? '#FFD7D7' : '#FFD7D7',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#C32033',
    }),
  };

  // Custom MenuList component for large lists
  const MenuList = (props: any) => {
    const height = 35;
    const itemCount = props.options.length;
    const maxHeight = 300;

    return (
      <components.MenuList {...props}>
        <List
          height={Math.min(maxHeight, itemCount * height)}
          itemCount={itemCount}
          itemSize={height}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>{props.children[index]}</div>
          )}
        </List>
      </components.MenuList>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-8 shadow-default">
        {loading && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-30">
            <Loader />
          </div>
        )}
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Edit Order
          </h2>
          {!item_number && (
            <button
              onClick={() =>
                navigate('/item-listing', { state: { order_header_id } })
              }
              className="px-6 py-3 rounded-lg font-medium transition-colors bg-[#C32033] text-white hover:bg-[#A91B2E]"
            >
              Update Items
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-md text-gray-600">
          <span>Sales Requests</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#C32033]">Edit</span>
        </div>

        <div className="py-5"></div>

        {/* Main Form */}
        <form className="space-y-6">
          {mode === 'update_order_line' ? (
            <section>
              <h3 className="text-xl text-[#c32033] font-bold mb-3">
                Item Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Item Number
                    </label>
                    <Select
                      name="item_number"
                      value={
                        itemsOptions.find(
                          (o) => o.value === itemFormData.item_number,
                        ) || null
                      }
                      onChange={async (selectedOption) => {
                        if (!selectedOption) return;
                        setItemFormData((prev) => ({
                          ...prev,
                          item_number: selectedOption.value,
                          item_detail: selectedOption.label,
                          sub_category: '',
                          description: '',
                          unit_of_measure: '',
                          order_quantity: 0,
                          price: 0,
                          line_amount: 0,
                        }));

                        try {
                          const [itemResponse, priceResponse] =
                            await Promise.all([
                              apiService.get(
                                `/api/v1/items/detail/${selectedOption.value}`,
                                {},
                              ),
                              apiService.get(
                                `/api/v1/prices/detail/${selectedOption.value}`,
                                {},
                              ),
                            ]);

                          setItemDetail(itemResponse.data);
                          setPrice(
                            priceResponse.data.map((p: any) => ({
                              base_price: p.base_price,
                            })),
                          );
                        } catch (error) {
                          console.error('Error fetching item details:', error);
                        }
                      }}
                      options={itemsOptions}
                      placeholder="Select Item Number"
                      isSearchable
                      styles={customSelectStyles}
                      components={{ MenuList }}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      UOM
                    </label>
                    <Select
                      name="unit_of_measure"
                      isDisabled={!itemFormData.item_number}
                      value={findUnitOfMeasureOption(
                        itemFormData.unit_of_measure,
                      )}
                      onChange={(opt) =>
                        setItemFormData((prev) => ({
                          ...prev,
                          unit_of_measure: opt?.value || '',
                        }))
                      }
                      options={unitOfMeasureOptions}
                      placeholder="Select Unit of Measure"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Sub Category
                    </label>
                    <Select
                      name="sub_category"
                      isDisabled={!itemFormData.item_number}
                      value={findSubCategoryOption(itemFormData.sub_category)}
                      onChange={(opt) =>
                        setItemFormData((prev) => ({
                          ...prev,
                          sub_category: opt?.value || '',
                        }))
                      }
                      options={subCategoryOptions}
                      placeholder="Select Sub Category"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={
                        (itemFormData.price === 0
                          ? price[0]?.base_price
                          : itemFormData.price) || 0
                      }
                      min={0}
                      step="any"
                      onChange={handlePrice}
                      placeholder="Enter Price"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Line Amount
                    </label>
                    <input
                      type="number"
                      name="line_amount"
                      step="any"
                      value={itemFormData.line_amount}
                      onChange={handleItemChange}
                      placeholder="Select Line Amount"
                      readOnly
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Description
                    </label>
                    <Select
                      name="description"
                      isDisabled={!itemFormData.item_number}
                      value={findDescriptionOption(itemFormData.description)}
                      onChange={(opt) =>
                        setItemFormData((prev) => ({
                          ...prev,
                          description: opt?.value || '',
                        }))
                      }
                      options={descriptionOptions}
                      placeholder="Select Description"
                      isSearchable
                      styles={customSelectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="instructions"
                      value={itemFormData.instructions}
                      onChange={handleItemChange}
                      placeholder="Enter Instructions"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Order Quantity
                    </label>
                    <input
                      type="number"
                      name="order_quantity"
                      value={itemFormData.order_quantity}
                      onChange={handleItemChange}
                      min={0}
                      placeholder="Enter Order Quantity"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Requested Shipment Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="requested_shipment_date"
                        onChange={handleItemChange}
                        value={
                          itemFormData.requested_shipment_date
                            ? new Date(itemFormData.requested_shipment_date)
                                .toISOString()
                                .split('T')[0]
                            : new Date().toISOString().split('T')[0]
                        }
                        className="custom-input-date custom-input-date-1 w-full text-[#C32033] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-[#C32033] active:border-[#C32033] dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#C32033]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-black mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      name="status"
                      value={'Pending'}
                      readOnly
                      onChange={handleItemChange}
                      placeholder="Enter Order Status"
                      className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section>
                <h3 className="text-xl text-black font-bold mb-3">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Customer Name
                      </label>
                      <Select
                        name="customer_id"
                        value={findCustomerOption(customerFormData.customer_id)}
                        onChange={handleCustomerSelect}
                        options={customerOptions}
                        placeholder="Select Customer"
                        isSearchable
                        styles={customSelectStyles}
                        components={{ MenuList }}
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Address
                      </label>
                      <Select
                        name="address"
                        isDisabled={!customerFormData.account_number}
                        value={findAddressOption(customerFormData.address)}
                        onChange={(opt) =>
                          setCustomerFormData((prev) => ({
                            ...prev,
                            address: opt?.value || '',
                          }))
                        }
                        options={addressLineOptions}
                        placeholder="Select Address"
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Sales Person
                      </label>
                      <Select
                        name="salesperson_id"
                        value={findSalesPersonOption(
                          customerFormData.salesperson_id,
                          customerFormData.salesperson_name,
                        )}
                        onChange={(opt) =>
                          setCustomerFormData((prev) => ({
                            ...prev,
                            salesperson_id: opt?.value || '',
                            salesperson_name: opt?.label || '',
                          }))
                        }
                        options={salesPersonOptions}
                        placeholder="Select Sales Person"
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Account Number
                      </label>
                      <Select
                        name="account_number"
                        isDisabled={!customerFormData.customer_id}
                        value={findAccountOption(
                          customerFormData.account_number,
                        )}
                        onChange={handleAccountNumberSelect}
                        options={accountNumberOptions}
                        placeholder="Select Account Number"
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Payment Term
                      </label>
                      <Select
                        name="payment_term"
                        isDisabled={!customerFormData.account_number}
                        value={findPaymentTermOption(
                          customerFormData.payment_term,
                        )}
                        onChange={(opt) =>
                          setCustomerFormData((prev) => ({
                            ...prev,
                            payment_term: opt?.value || '',
                          }))
                        }
                        options={paymentTermOptions}
                        placeholder="Select Payment Term"
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>

                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Customer PO Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="customer_po_number"
                        value={customerFormData.customer_po_number}
                        onChange={handleChange}
                        placeholder="Enter Customer PO Number"
                        className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-xl text-black font-bold mb-3">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-md text-black font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={addressFormData.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="Enter Name"
                        className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-md text-black font-medium mb-2">
                        City
                      </label>
                      <Select
                        options={cityOptions}
                        value={
                          cityOptions.find(
                            (opt) => opt.value === addressFormData.city,
                          ) || null
                        }
                        onChange={(opt) =>
                          handleInputChange('city', opt?.value || '')
                        }
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-md text-black font-medium mb-2">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={addressFormData.contactNumber}
                        onChange={(e) =>
                          handleInputChange('contactNumber', e.target.value)
                        }
                        placeholder="Enter Contact Number"
                        className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-md text-black font-medium mb-2">
                        Block
                      </label>
                      <Select
                        options={blockOptions}
                        value={
                          blockOptions.find(
                            (opt) => opt.value === addressFormData.block,
                          ) || null
                        }
                        onChange={(opt) =>
                          handleInputChange('block', opt?.value || '')
                        }
                        isSearchable
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-md text-black font-medium mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    rows={4}
                    value={addressFormData.shippingAddress}
                    onChange={(e) =>
                      handleInputChange('shippingAddress', e.target.value)
                    }
                    placeholder="Enter Shipping Address"
                    className="w-full px-4 py-3 bg-gray border-0 rounded-lg text-[#C32033] focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                  />
                </div>
              </section>
            </>
          )}

          {/* Form Submission */}
          <div className="flex gap-4 pt-4">
            {!item_number ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-[#C32033] hover:text-white transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleUpdateOrderHeader}
                  className="px-6 py-3 rounded-lg font-medium transition-colors bg-[#C32033] text-white hover:bg-[#A91B2E]"
                >
                  Update Order
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-12 py-3 rounded-lg border border-[#C32033] text-[#C32033] font-medium hover:bg-[#C32033] hover:text-white transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleUpdateOrderLine}
                  className="px-6 py-3 rounded-lg font-medium transition-colors bg-[#C32033] text-white hover:bg-[#A91B2E]"
                >
                  Update Order Line
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalesRequest;
