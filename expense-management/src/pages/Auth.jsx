// src/pages/Auth.jsx
import { useState } from "react";

// --- Mock Database for Role Check ---
// In a real app, this would be a backend database lookup.
// We'll simulate that only the sign-up user (if they sign up) is an Admin.
const MOCK_ADMIN_EMAIL = "admin@mycompany.com"; 
// Small set of manager emails for local testing.
const MOCK_MANAGER_EMAILS = [
  'manager@mycompany.com',
  'lead@mycompany.com',
];

// --- START: Main Auth Component ---
export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    password: "",
    confirmPassword: "",
    country: "US", 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simplified list for currency selection.
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Sign Up Validation
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

    const actionType = isLogin ? "Login" : "Sign Up (Admin Creation)";
    console.log(`${actionType} attempt with data:`, formData);
    
    // **API Call Logic would go here to the backend**

    // Simulate success after 2 seconds
    setTimeout(() => {
        setIsLoading(false);
        
        // --- CRITICAL ROLE DETERMINATION LOGIC ---
        let userRole = null;

        if (!isLogin) {
            // SCENARIO 1: SIGNUP
            // The person signing up is automatically the Admin.
            userRole = 'Admin';
            // In a real app, you'd save this email and role to the database here.
            
        } else {
            // SCENARIO 2: LOGIN
            // In a real app, the server returns the role based on the email lookup.
            
            // SIMULATION: If the user logs in with the mock admin email, they get the Admin role.
            // Otherwise, we'll assign a default (e.g., Employee) for future testing.
      if (formData.email === MOCK_ADMIN_EMAIL) {
        userRole = 'Admin';
      } else if (MOCK_MANAGER_EMAILS.includes(formData.email) || formData.email.endsWith('@manager.mycompany.com')) {
        // quick heuristic: known manager emails or manager subdomain
        userRole = 'Manager';
      } else {
        userRole = 'Employee'; // Default
      }
        }
        
        console.log(`Login/Signup Successful! Assigned Role: ${userRole}`);
        
        // Call the success handler, passing the determined role, to switch the view
        onAuthSuccess(userRole); 

    }, 2000); 
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
      {/* Inner card container: Max width, elevated and modern card style */}
      <div className="auth-card">
        {/* Title Section */}
        <h1 className="auth-title">
          {isLogin ? "Welcome Back" : "Company Admin Sign Up"}
        </h1>
        <p className="auth-subtitle">
            {isLogin ? "Sign in to manage your expenses." : "Create your company and become the administrator."}
        </p>

        {/* Error Message Display */}
    {error && (
      <div className="auth-error" role="alert">
        <span className="block">{error}</span>
      </div>
    )}

        {/* Form - Enhanced vertical spacing */}
  <form className="auth-form" onSubmit={handleFormSubmit}>

          {/* SIGN UP: Name Field */}
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

          {/* Email Field */}
          <FormInput 
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          {/* Password Field */}
          <FormInput 
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          {/* SIGN UP: Confirm Password Field */}
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

          {/* SIGN UP: Country Selection Field (Dropdown) */}
          {!isLogin && (
            <div className="pt-1">
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">
                Country selection
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full p-2.5 border border-gray-300 rounded-lg shadow-inner focus:ring-indigo-600 focus:border-indigo-600 bg-gray-50 appearance-none transition duration-150"
              >
                {/* The selected country's currency should get set as the company's base currency. */}
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Sets the company's base currency.</p>
            </div>
          )}

          {/* Submit Button */}
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
        
        {/* Forgot Password Link */}
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

        {/* Toggle - Clear visual separator for clean design */}
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
// --- END: Main Auth Component ---

// --- START: Reusable FormInput Component ---
const FormInput = ({ id, label, type, name, value, onChange, required }) => (
    <div>
      <label htmlFor={id || name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-600 focus:border-indigo-600 transition duration-150"
      />
    </div>
);
// --- END: Reusable FormInput Component ---