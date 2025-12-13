import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Automatically redirect to Oracle login when component renders
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/');
      return;
    }
    // Otherwise, redirect to Oracle login
    navigate('/auth/oracle-login', { replace: true });
  }, [navigate, user]);

  // Don't render anything while redirecting
  return null;
};

export default SignIn;
