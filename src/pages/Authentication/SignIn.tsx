import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import { AuthContext } from '../../context/AuthContext';
import splashImage from '../../images/KPC-image.png';
import kpcLogo from '../../images/KPC-logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'salesPerson',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setCredentials((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.role) {
      credentials.role = 'admin';
    }

    try {
      const response = await apiService.post(
        '/api/v1/users/signIn',
        credentials,
      );

      if (response?.status === 200) {
        const userData = response.data;
        localStorage.setItem('auth-token', userData.authentication_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="flex h-screen bg-[#C32033] relative overflow-hidden">
      {/* Left Side - Splash Image Area */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col items-center justify-center relative ">
        {/* Your KPC logo will go here */}
        <img src={kpcLogo} alt="KPC Logo" className="w-32 mb-6" />

        {/* Your splash image will go here */}
        <div className="h-150 w-150">
          <img src={splashImage} alt="Splash" />
        </div>

        {/* KPC Logo positioned in top-left */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 w-full max-w-[900px] min-h-auto lg:min-h-[680px] shadow-2xl">
          <h2 className="text-3xl font-bold text-black mb-2 text-left mt-5">
            Welcome to Kuwait Paint
          </h2>
          <h2 className="text-3xl font-bold text-black text-left">Company!</h2>

          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            {/* <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  credentials.role === 'admin'
                    ? 'bg-[#C32033] text-white shadow-lg'
                    : 'bg-gray text-gray-600 hover:bg-gray-300'
                }`}
              >
                Admin
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('salesPerson')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  credentials.role === 'salesPerson'
                    ? 'bg-[#C32033] text-white shadow-lg'
                    : 'bg-gray text-gray-600 hover:bg-gray-300'
                }`}
              >
                Employee
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  credentials.role === 'customer'
                    ? 'bg-[#C32033] text-white shadow-lg'
                    : 'bg-gray text-gray-600 hover:bg-gray-300'
                }`}
              >
                Customer
              </button>
            </div> */}

            {/* <div>
              <label className="block text-md font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-md font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                required
              />
            </div> */}

            {/* <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-black hover:text-[#C32033] text-md font-medium transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div> */}

            {/* <button
              type="submit"
              className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
            >
              Log In
            </button> */}

            <button
              type="button"
              onClick={async () => {
                try {
                  // Call the Oracle login endpoint
                  const response = await apiService.get(
                    '/api/v1/auth/oci/login',
                    {},
                  );

                  // If backend returns an authUrl, redirect user to Oracle
                  const authUrl = response?.data?.authUrl || response?.authUrl;
                  if (authUrl) {
                    window.location.href = authUrl;
                    return;
                  }

                  // Otherwise, handle immediate success with salesPerson data
                  if (
                    response?.success &&
                    response?.data &&
                    response?.data?.salesPerson
                  ) {
                    const salesPerson = response.data.salesPerson;

                    const userData = {
                      _id: salesPerson._id,
                      email: salesPerson.salesperson_id || '',
                      full_name: salesPerson.salesperson_name,
                      person_number: salesPerson.employee_number,
                      role: 'salesPerson',
                      authentication_token: 'oracle-auth-' + salesPerson._id,
                      registered: salesPerson.registered,
                    };

                    localStorage.setItem(
                      'auth-token',
                      userData.authentication_token,
                    );
                    localStorage.setItem('user', JSON.stringify(userData));

                    setUser(userData as any);

                    if (salesPerson.registered) {
                      toast.success('Logged in successfully!');
                      navigate('/');
                    } else {
                      toast.success('Please complete your registration');
                      navigate('/auth/signup', { state: { salesPerson } });
                    }
                  } else {
                    toast.error('Invalid Oracle authentication response');
                  }
                } catch (error: any) {
                  console.error('Oracle login error:', error);
                  toast.error(error?.message || 'Oracle login failed');
                }
              }}
              className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
            >
              Login
            </button>

            {/* <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/signup"
                  className="text-[#C32033] font-semibold hover:underline transition-all duration-200"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </div>

      {/* Mobile KPC Logo - shown on small screens */}
      <div className="lg:hidden absolute top-8 left-8">
        {/* Your KPC logo for mobile will go here */}
        {/* <img src={kpcLogo || "/placeholder.svg"} alt="KPC Logo" className="h-12 w-auto" /> */}
      </div>
    </div>
  );
};

export default SignIn;
