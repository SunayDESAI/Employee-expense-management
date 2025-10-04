import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample users - in real app, this would come from an API
  const sampleUsers = {
    'employee@company.com': {
      id: 2,
      name: 'John Smith',
      email: 'employee@company.com',
      role: 'employee',
      company: 'TechCorp Solutions',
      currency: 'INR',
      department: 'Engineering'
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = sampleUsers[email];
        if (foundUser && password === 'password') { // Simple password check for demo
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          resolve(foundUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (userData) => {
    // Simulate API call for admin signup
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'admin', // Default signup creates admin
          company: userData.name + "'s Company",
          currency: userData.country === 'US' ? 'USD' : 'INR'
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }, 2000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};