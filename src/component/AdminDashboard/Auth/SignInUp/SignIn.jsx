import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { SiGnuprivacyguard } from 'react-icons/si';
import "./Style.css";
import { loginUser } from '../../../Services/Authentication/AuthSlice';
import IconWithTitle from '../../../utilities/IconsTittle';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const { error, status, isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = determineRedirectPath(user);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate, email]);

  const determineRedirectPath = (user) => {
    if (user.parent?.email === email) return '/parent-dashboard';
    if (user.usertype_id === '67261122db316f5b66905278') return '/teacher-dashboard';
    if (user.usertype_id === '6730ea0590eb66bde2c2bb6b') return '/student-dashboard';
    return '/dashboard';
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      return navigate('/dashboard');
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        // Redirection is handled by useEffect
      } else {
        console.error('Login failed:', resultAction.error);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form className="form" onSubmit={handleSubmit}>
        <IconWithTitle
          icon={SiGnuprivacyguard}
          title="LogIn"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <div className="password-input-container">
          <input
            className="input"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="submit-button"
        >
          {status === 'loading' ? 'Logging in...' : 'Log In'}
        </button>

        {error && <p className="error-message">{error}</p>}
        <Link to="/forgot-password" className="forgot-password">
          Forgot your password?
        </Link>
      </form>
    </div>
  );
};

export default SignInForm;