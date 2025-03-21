import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../../services/ApiService';
import OtpInput from 'react-otp-input';

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
    <div className="rounded-sm bg-white shadow-default h-screen dark:bg-boxdark">
      <div className="flex flex-wrap justify-center items-center h-full">
        <div className="w-full xl:w-1/2 rounded-sm border border-stroke bg-white shadow-lg">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white">
              Verify OTP
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6 flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={
                    <span className="mx-3 text-xl font-bold">-</span>
                  }
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: '60px',
                    height: '60px',
                    fontSize: '24px',
                    borderRadius: '8px',
                    border: '2px solid #ddd',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Verify"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-6 text-center">
                <Link to="/auth/forgot-password" className="text-primary">
                  Go Back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
