import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import OtpInput from 'react-otp-input';
import splashImage from '../../images/KPC-image.png';
import kpcLogo from '../../images/KPC-logo.png';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    try {
      const response = await apiService.post('/api/v1/password/verifyOtp', {
        email,
        otp,
      });

      if (response?.status === 200) {
        toast.success(response?.message);
        navigate('/auth/reset-password', { state: { email } });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'OTP verification failed');
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

      {/* Right Side - OTP Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-8 w-full max-w-[900px] min-h-auto lg:min-h-[680px] shadow-2xl">
          <h2 className="text-3xl font-bold text-black mb-2 text-left mt-5">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-8">
            We've sent a verification code to{' '}
            <span className="font-semibold">{email}</span>. Please enter the
            code below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div className="flex justify-center mb-8">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-2"></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '60px',
                  height: '60px',
                  fontSize: '24px',
                  borderRadius: '8px',
                  border: '2px solid #E5E7EB',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                containerStyle={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C32033] text-white py-4 rounded-lg font-semibold hover:bg-[#A91B2E] transition-all duration-200 shadow-lg"
            >
              Verify Code
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Didn't receive the code?{' '}
                <Link
                  to="/auth/forgot-password"
                  className="text-[#C32033] font-semibold hover:underline transition-all duration-200"
                >
                  Resend
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

export default VerifyOtp;
