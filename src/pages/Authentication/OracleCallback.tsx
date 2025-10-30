import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../common/Loader';
import apiService from '../../services/ApiService';

const OracleCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOracleCallback = async () => {
      try {
        console.log('Oracle callback triggered');
        console.log('Current URL:', window.location.href);
        console.log(
          'Search params:',
          Object.fromEntries(searchParams.entries()),
        );

        // Check if we have a response parameter (from backend redirect with data)
        const responseData = searchParams.get('response');

        // If we have a response parameter with the data already
        if (responseData) {
          try {
            console.log('Response data received:', responseData);

            // Decode the base64 encoded response
            const decodedData = atob(responseData);
            console.log('Decoded data:', decodedData);

            const parsedData = JSON.parse(decodedData);
            console.log('Parsed data:', parsedData);

            if (
              parsedData.success &&
              parsedData.data &&
              parsedData.data.salesPerson
            ) {
              console.log('✓ Valid response structure - processing login...');
              const salesPerson = parsedData.data.salesPerson;
              console.log('Sales person data:', salesPerson);

              // Store id_token if available
              const idToken = parsedData.data.id_token;
              if (idToken) {
                localStorage.setItem('oracle_id_token', idToken);
                console.log('✓ id_token stored in localStorage');
              }

              // Transform the sales person data to match the expected user structure
              const userData = {
                _id: salesPerson._id,
                email: salesPerson.salesperson_id || '',
                full_name: salesPerson.salesperson_name,
                person_number: salesPerson.employee_number,
                role: 'salesPerson',
                authentication_token: 'oracle-auth-' + salesPerson._id,
                registered: salesPerson.registered,
              };

              console.log('User data to store:', userData);

              // Store in localStorage
              localStorage.setItem('auth-token', userData.authentication_token);
              localStorage.setItem('user', JSON.stringify(userData));

              console.log('✓ User data stored in localStorage');
              console.log('✓ Updating AuthContext...');
              setUser(userData as any);

              console.log(
                '✓ Checking registration status:',
                salesPerson.registered,
              );
              if (salesPerson.registered) {
                console.log(
                  '✓ User is registered - showing success toast and navigating to dashboard',
                );
                toast.success('Logged in successfully!');
                console.log(
                  '✓ Stored in localStorage:',
                  localStorage.getItem('user'),
                );
                console.log(
                  '✓ localStorage.auth-token:',
                  localStorage.getItem('auth-token'),
                );

                // Force immediate navigation
                console.log('✓ Immediately navigating to /');
                window.location.href = '/';
              } else {
                console.log('✓ User not registered - redirecting to signup');
                toast.success('Please complete your registration');
                navigate('/auth/signup', { state: { salesPerson } });
              }
              return;
            } else {
              console.log('✗ Invalid response structure');
              console.log('Parsed success:', parsedData?.success);
              console.log('Parsed data exists:', !!parsedData?.data);
              console.log(
                'SalesPerson exists:',
                !!parsedData?.data?.salesPerson,
              );
            }
          } catch (parseError) {
            console.error('Failed to parse response data:', parseError);
          }
        }

        // Check if we have a code parameter (from Oracle OAuth callback)
        const code = searchParams.get('code');

        // If we have a code parameter, the backend should have already processed it
        // and returned the response directly to this page
        if (code) {
          try {
            console.log('Code received from Oracle:', code);
            console.log(
              'Backend should have processed this and returned the response directly',
            );

            // The backend is returning the response directly to this page
            // We need to extract it from the page content or make a separate API call
            console.log('Making API call to exchange code...');
            const response = await apiService.get('/api/v1/auth/oci/callback', {
              code,
            });

            console.log('Backend callback response:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', Object.keys(response || {}));
            console.log('Response success:', response?.success);
            console.log('Response status:', response?.status);
            console.log('Response message:', response?.message);
            console.log('Response data:', response?.data);
            console.log('Response salesPerson:', response?.data?.salesPerson);
            console.log(
              'Full response stringified:',
              JSON.stringify(response, null, 2),
            );

            if (
              response?.success &&
              response?.data &&
              response?.data?.salesPerson
            ) {
              console.log('✓ Valid response structure - processing login...');
              const salesPerson = response.data.salesPerson;
              console.log('Sales person data:', salesPerson);

              // Store id_token if available
              const idToken = response.data.id_token;
              if (idToken) {
                localStorage.setItem('oracle_id_token', idToken);
                console.log('✓ id_token stored in localStorage');
              }

              const userData = {
                _id: salesPerson._id,
                email: salesPerson.salesperson_id || '',
                full_name: salesPerson.salesperson_name,
                person_number: salesPerson.employee_number,
                role: 'salesPerson',
                authentication_token: 'oracle-auth-' + salesPerson._id,
                registered: salesPerson.registered,
              };

              console.log('User data to store:', userData);

              localStorage.setItem('auth-token', userData.authentication_token);
              localStorage.setItem('user', JSON.stringify(userData));

              console.log('✓ User data stored in localStorage');
              console.log('✓ Updating AuthContext...');
              setUser(userData as any);

              console.log(
                '✓ Checking registration status:',
                salesPerson.registered,
              );
              if (salesPerson.registered) {
                console.log(
                  '✓ User is registered - showing success toast and navigating to dashboard',
                );
                toast.success('Logged in successfully!');
                console.log(
                  '✓ Stored in localStorage:',
                  localStorage.getItem('user'),
                );

                // Small delay to ensure state is updated
                setTimeout(() => {
                  console.log('✓ Navigating to /');
                  // Force navigation - replace entire history
                  window.location.href = '/';
                }, 100);
              } else {
                console.log('✓ User not registered - redirecting to signup');
                toast.success('Please complete your registration');
                navigate('/auth/signup', { state: { salesPerson } });
              }
              return;
            } else {
              console.log('✗ Invalid response structure');
              console.log('Response success:', response?.success);
              console.log('Response data exists:', !!response?.data);
              console.log('SalesPerson exists:', !!response?.data?.salesPerson);
            }
          } catch (error) {
            console.error('Error exchanging code with backend:', error);
            toast.error('Failed to complete Oracle authentication');
            navigate('/auth/signin');
            return;
          }
        }

        // If no valid data found, show error and redirect
        console.log('No valid Oracle data found');
        toast.error('Oracle authentication failed - no valid data received');
        navigate('/auth/signin');
      } catch (error: any) {
        console.error('Error processing Oracle callback:', error);
        toast.error(
          error?.message || 'Failed to process Oracle authentication',
        );
        navigate('/auth/signin');
      }
    };

    handleOracleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#C32033]">
      <Loader />
    </div>
  );
};

export default OracleCallback;
