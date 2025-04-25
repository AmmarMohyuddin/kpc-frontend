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
