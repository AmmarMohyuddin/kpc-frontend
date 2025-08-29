import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Users = lazy(()=> import('../pages/Users'))
const ImportUsers = lazy(()=> import('../pages/ImportUsers'))
const Customers = lazy(() => import('../pages/Customers'));
const SalesPersons = lazy(() => import('../pages/SalesPersons'));
const ShowSalesPerson = lazy(() => import('../pages/ShowSalesPerson'));
const ShowCustomer = lazy(() => import('../pages/ShowCustomer'));
const ShowUser = lazy(() => import('../pages/ShowUser'));
const deactivateUsers = lazy(() => import('../pages/DeactivateUsers'));
const CreateLead = lazy(() => import('../pages/Leads/CreateLead'));
const EditLead = lazy(() => import('../pages/Leads/EditLead'));
const FollowUp = lazy(() => import('../pages/Leads/FollowUp'));
const ManageLead = lazy(() => import('../pages/Leads/ManageLead'));
const DetailLead = lazy(() => import('../pages/Leads/DetailLead'));
const DetailOpportunity = lazy(() => import('../pages/Leads/DetailOpportunity'));
const CreateOpportunity = lazy(() => import('../pages/Opportunities/CreateOpportunity'));
const ManageOpportunity = lazy(() => import('../pages/Opportunities/ManageOpportunity'));
const DetailOpp = lazy(() => import('../pages/Opportunities/DetailOpportunity'));
const Closure = lazy(() => import('../pages/Leads/Closure'));
const CreateSalesRequest = lazy(() => import('../pages/SalesRequest/CreateSalesRequest'));
const ManageSalesRequest = lazy(() => import('../pages/SalesRequest/ManageSalesRequest'))
const ConfirmAddress = lazy(() => import('../pages/SalesRequest/ConfirmAddress'));
const DetailItem = lazy(() => import('../pages/SalesRequest/ItemDetail'))
const ItemListing = lazy(() => import('../pages/SalesRequest/ItemListing'));
const DetailSalesRequest = lazy(() => import('../pages/SalesRequest/DetailSalesRequest'));
const DraftSalesRequest = lazy(() => import('../pages/SalesRequest/DraftSalesRequest'));
const EditSalesRequest = lazy(() => import('../pages/SalesRequest/EditSalesRequest'));
const UninvoicedOrders = lazy(() => import('../pages/SalesOrders/UninvoicedOrders'));
const OpenOrders = lazy(() => import('../pages/SalesOrders/OpenOrders'));
const OrderHistory = lazy(() => import('../pages/SalesOrders/OrderHistory'));
const DetailUninvoicedOrder = lazy(() => import('../pages/SalesOrders/DetailUninvoiced'));
const DetailOrderHistory = lazy(() => import('../pages/SalesOrders/DetailOrderHistory'));
const DetailOpenOrder = lazy(() => import('../pages/SalesOrders/DetailOpenOrders'));
const EditOpportunity = lazy(() => import('../pages/Opportunities/EditOpportunity'));
const Itemlisting = lazy(() => import('../pages/Opportunities/ItemListing'));
const ItemDetail = lazy(() => import('../pages/Opportunities/DetailItem'));
const EditOpportunityDetail = lazy(() => import('../pages/Opportunities/EditOpportunityDetail'));
const FollowUpOpportunity = lazy(() => import('../pages/Opportunities/FollowUp'));
const ManageFollowUp = lazy(() => import('../pages/Leads/manageFollowUp'));
const DetailFollowUp = lazy(() => import('../pages/Leads/DetailFollowUp'));

const coreRoutes = [
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/leads/create',
    title: 'Create Lead',
    component: CreateLead,
  },
    {
    path: '/leads/edit/:lead_id',
    title: 'Edit Lead',
    component: EditLead,
  },
  {
    path: '/leads/follow-up',
    title: 'Follow Up',
    component: FollowUp,
  },
  {
    path: '/leads/follow-up/manage',
    title: 'Manage Follow Up',
    component: ManageFollowUp,
  },
  {
    path: '/leads/follow-up/detail/:id',
    title: 'Follow Up Detail',
    component: DetailFollowUp,
  },
  {
    path: '/leads/manage',
    title: 'Manage Lead',
    component: ManageLead,
  },
  {
    path: '/leads/:id',
    title: 'Detail Lead',
    component: DetailLead,
  },
  {
    path: '/leads/:id/opportunity',
    title: 'Detail Opportunity',
    component: DetailOpportunity,
  },
  {
    path: '/leads/closure',
    title: 'Closure',
    component: Closure,
  },
  {
    path: '/opportunities/create',
    title: 'Create Opportunity',
    component: CreateOpportunity,
  },
  {
    path: '/opportunities/manage',
    title: 'Manage Opportunities',
    component: ManageOpportunity,
  },
  {
    path: '/opportunities/:id',
    title: 'Detail Opportunity',
    component: DetailOpp,
  },
    {
    path: '/opportunities/edit/:id',
    title: 'Edit Opportunity',
    component: EditOpportunity,
  },
      {
    path: '/opportunities/detail/edit/:id',
    title: 'Edit Opportunity Detail',
    component: EditOpportunityDetail,
  },
      {
    path: '/opportunities/details/:id',
    title: 'Opportunity Details',
    component: ItemDetail,
  },
      {
    path: '/opportunities/listing',
    title: 'Opportunity Listing',
    component: Itemlisting,
  },
        {
    path: '/opportunities/follow-up',
    title: 'Opportunity Follow Up',
    component: FollowUpOpportunity,
  },
    {
    path: '/opportunities/follow-up/manage',
    title: 'Manage Follow Up',
    component: ManageFollowUp,
  },
      {
    path: '/opportunities/follow-up/detail/:id',
    title: 'Follow Up Detail',
    component: DetailFollowUp,
  },
  {
    path: '/sales-request/create',
    title: 'Create Sales Request',
    component: CreateSalesRequest,
  },
  {
    path: '/sales-request/manage',
    title: 'Manage Sales Request',
    component: ManageSalesRequest,
  },
  {
    path: '/sales-request/draft',
    title: 'Draft Sales Request',
    component: DraftSalesRequest,
  },
  {
    path: '/sales-request/confirm-address',
    title: 'Confirm Address',
    component: ConfirmAddress,
  },
  {
    path: '/sales-request/details',
    title: 'Item Details',
    component: DetailItem,
  },
  {
    path: '/sales-request/details/:order_header_id',
    title: 'Sales Request Details',
    component: DetailSalesRequest,
  },
  {
    path: '/sales-request/edit/:order_header_id',
    title: 'Sales Request Edit',
    component: EditSalesRequest,
  },
  {
    path: '/item-listing',
    title: 'Item Listing',
    component: ItemListing,
  },
  {
    path: '/sales-orders/uninvoiced',
    title: 'Uninvoiced Orders',
    component: UninvoicedOrders,
  },
  {
    path: '/sales-orders/uninvoiced/:order_no',
    title: 'Uninvoiced Order Details',
    component: DetailUninvoicedOrder,
  },
    {
    path: '/sales-orders/history',
    title: 'Order History',
    component: OrderHistory,
  },
    {
    path: '/sales-orders/history/:order_no',
    title: 'Order History Details',
    component: DetailOrderHistory,
  },
    {
    path: '/sales-orders/open' ,
    title: 'Open Orders',
    component: OpenOrders,
  },
    {
    path: '/sales-orders/open/:order_no',
    title: 'Open Order Details',
    component: DetailOpenOrder,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/users',
    title: 'Users',
    component: Users,
  },
  {
    path: '/deactivate',
    title: 'Deactivate Users',
    component: deactivateUsers,
  },
  {
    path: '/users/:id',
    title: 'Show User',
    component: ShowUser,
  },
  {
    path: '/import',
    title: 'Import Users',
    component: ImportUsers,
  },
  {
    path: '/sales',
    title: 'Sales Persons',
    component: SalesPersons,
  },
  {
    path: '/sales/:id',
    title: 'Show Sales Person',
    component: ShowSalesPerson,
  },
  {
    path: '/customers',
    title: 'Customers',
    component: Customers,
  },
  {
    path: '/customers/:id',
    title: 'Show Customer',
    component: ShowCustomer,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
