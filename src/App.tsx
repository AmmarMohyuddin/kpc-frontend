import { Suspense, lazy, useEffect, useState, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import VerifyOtp from './pages/Authentication/VerifyOtp';
import ResetPassword from './pages/Authentication/ResetPassword';
import OracleCallback from './pages/Authentication/OracleCallback';
import Loader from './common/Loader';
import routes from './routes';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Function to protect routes that require authentication
  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    return user ? children : <Navigate to="/auth/signin" />;
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/oracle/callback" element={<OracleCallback />} />
        <Route path="/callback" element={<OracleCallback />} />

        {/* Authenticated Routes */}
        <Route
          element={
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          }
        >
          {/* Home route */}
          <Route index element={<ECommerce />} />

          {/* Dynamic routes */}
          {routes.map((route, index) => {
            const { path, component: Component } = route;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Route>

        {/* Redirect any other route to sign-in if not authenticated */}
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </>
  );
}

export default App;
