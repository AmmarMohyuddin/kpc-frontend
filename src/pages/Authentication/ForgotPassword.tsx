import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import splashImage from '../../images/KPC-image.png';
import kpcLogo from '../../images/KPC-logo.png';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiService.post(
        '/api/v1/password/forgotPassword',
        formData,
      );

      if (response?.status === 200) {
        toast.success(response?.message);
        navigate('/auth/verify-otp', { state: { email: formData.email } });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen bg-[#C32033] relative overflow-hidden">
      {/* Left Side - Splash Image Area */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col items-center justify-center relative">
        <img src={kpcLogo} alt="KPC Logo" className="w-32 mb-6" />
        <div className="h-150 w-150">
          <img src={splashImage} alt="Splash" />
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 w-full max-w-[900px] min-h-auto lg:min-h-[680px] shadow-2xl">
          <h2 className="text-3xl font-bold text-black mb-2 text-left mt-5">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600 mb-8">
            No worries! Enter your email address and we'll send you a code to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div>
              <label className="block text-md font-medium text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-gray border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C32033] focus:bg-white transition-all duration-200 placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
            >
              Send Verification Code
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/auth/signin"
                  className="text-[#C32033] font-semibold hover:underline transition-all duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile KPC Logo - shown on small screens */}
      <div className="lg:hidden absolute top-8 left-8">
        <img src={kpcLogo} alt="KPC Logo" className="h-12 w-auto" />
      </div>
    </div>
  );
};

export default ForgotPassword;
