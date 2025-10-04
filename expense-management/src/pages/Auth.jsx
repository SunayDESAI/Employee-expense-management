import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "",
    confirmPassword: "",
    country: "US", 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //Use API for dropdown
  const countries = [
    { code: "US", name: "United States (USD)" },
    { code: "IN", name: "India (INR)" },
    { code: "GB", name: "United Kingdom (GBP)" },
    { code: "CA", name: "Canada (CAD)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isLogin && formData.password !== formData.confirmPassword) {
        setError("Password and Confirm Password must match.");
        setIsLoading(false);
        return;
    }
    
    if (!isLogin && (!formData.name || !formData.email || !formData.password || !formData.country)) {
        setError("Please fill in all required fields for Sign Up.");
        setIsLoading(false);
        return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, 'password');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
        name: "", email: "", password: "", confirmPassword: "", country: "US",
    });
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? "Welcome Back" : "Company Admin Sign Up"}
        </h1>
        <p className="auth-subtitle">
            {isLogin ? "Sign in to manage your expenses." : "Create your company and become the administrator."}
        </p>


    {error && (
      <div className="auth-error" role="alert">
        <span>{error}</span>
      </div>
    )}

    <form className="auth-form" onSubmit={handleFormSubmit}>

          {!isLogin && (
            <FormInput 
              id="name"
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isLogin}
            />
          )}

          <FormInput 
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <FormInput 
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          {!isLogin && (
            <FormInput 
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required={!isLogin}
            />
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="country" className="auth-label">
                Country selection
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required={!isLogin}
                className="auth-select"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="auth-help">Sets the company's base currency.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`auth-button ${isLoading ? 'is-loading' : ''}`}
          >
            {isLoading 
                ? (isLogin ? "Logging In..." : "Creating Company...") 
                : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>
        
        {/* Demo Credentials Section */}
        {isLogin && (
          <div className="demo-section">
            <div className="demo-header">
              <h3>Try Demo Account</h3>
              <p>Click the button below to login with demo credentials</p>
            </div>
            <div className="demo-buttons">
              <button
                onClick={() => handleDemoLogin('employee@company.com')}
                disabled={isLoading}
                className="demo-button employee"
              >
                <div className="demo-role">👤 Employee Dashboard</div>
                <div className="demo-email">employee@company.com</div>
              </button>
            </div>
            <p className="demo-note">Demo account uses password: <code>password</code></p>
          </div>
        )}
        
    {isLogin && (
      <p className="auth-forgot">
        <button
          onClick={() => alert("Forgot Password feature: System sends a temporary password via email.")}
          className="link-button"
        >
          Forgot password?
        </button>
      </p>
    )}

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <button
            onClick={toggleAuthMode}
            className="link-button"
            disabled={isLoading}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const FormInput = ({ id, label, type, name, value, onChange, required }) => (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '0.7rem 0.85rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          fontSize: '0.95rem',
          color: '#ffffff',
          boxShadow: 'inset 0 1px 0 rgba(2,6,23,0.02)'
        }}
      />
    </div>
);