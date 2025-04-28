import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import { AuthContext } from '../../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      role: checked ? name : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Default to 'admin' if no role is selected
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
    <div className="rounded-sm border border-stroke bg-white shadow-default h-screen dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap justify-center items-center h-full">
        <div className="w-full xl:w-1/2 rounded-sm border border-stroke bg-white shadow-lg">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-20 mb-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="salesPerson"
                    name="salesPerson"
                    className="mr-2"
                    checked={credentials.role === 'salesPerson'}
                    onChange={handleRoleChange}
                  />
                  <label
                    htmlFor="salesPerson"
                    className="text-black dark:text-white"
                  >
                    Sales Person
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="customer"
                    name="customer"
                    className="mr-2"
                    checked={credentials.role === 'customer'}
                    onChange={handleRoleChange}
                  />
                  <label
                    htmlFor="customer"
                    className="text-black dark:text-white"
                  >
                    Customer
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div />
                <Link to="/auth/forgot-password" className="text-primary">
                  Forgot password?
                </Link>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-6 text-center">
                <p>
                  Don’t have an account?{' '}
                  <Link to="/auth/signup" className="text-primary">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
