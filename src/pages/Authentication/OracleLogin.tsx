import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../common/Loader';

const OracleLogin = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/');
      return;
    }

    const handleOracleLogin = async () => {
      try {
        // Call the Oracle login endpoint
        const response = await apiService.get('/api/v1/auth/oci/login', {});

        console.log('Oracle login response:', response);

        // If backend returns an authUrl, redirect user to Oracle
        const authUrl = response?.data?.authUrl || response?.authUrl;
        if (authUrl) {
          window.location.href = authUrl;
          return;
        }

        // Otherwise, handle immediate success with user data
        if (response?.success && response?.data && response?.data?.user) {
          const oracleUser = response.data.user;

          const userData = {
            _id: oracleUser._id,
            email: oracleUser.email || oracleUser.salesperson_id || '',
            full_name: oracleUser.full_name || oracleUser.salesperson_name || '',
            person_number: oracleUser.person_number || oracleUser.employee_number || '',
            role: oracleUser.role || 'salesPerson',
            authentication_token: 'oracle-auth-' + oracleUser._id,
            registered: oracleUser.registered !== undefined ? oracleUser.registered : true,
          };

          localStorage.setItem('auth-token', userData.authentication_token);
          localStorage.setItem('user', JSON.stringify(userData));

          setUser(userData as any);

          toast.success('Logged in successfully!');
          navigate('/');
        } else {
          toast.error('Invalid Oracle authentication response');
          navigate('/auth/signin');
        }
      } catch (error: any) {
        console.error('Oracle login error:', error);
        toast.error(error?.message || 'Oracle login failed');
        navigate('/auth/signin');
      }
    };

    handleOracleLogin();
  }, [navigate, setUser, user]);

  return (
    <div className="flex h-screen bg-[#C32033] items-center justify-center">
      <Loader />
    </div>
  );
};

export default OracleLogin;
