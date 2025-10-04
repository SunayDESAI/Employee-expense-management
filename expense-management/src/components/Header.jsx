import { useState } from 'react';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo and Title */}
          <div className="header-left">
            <div className="logo">
              <h1 className="logo-text">ExpenseManager</h1>
            </div>
            <div className="company-name">
              <span>{user?.company || 'Company Name'}</span>
            </div>
          </div>

          {/* User Menu */}
          <div className="header-right">
            {/* Notifications */}
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

            {/* User Dropdown */}
            <div className="user-menu">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="user-button"
              >
                <div className="user-avatar">
                  <User size={16} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user?.name}</div>
                  <div className="user-role">{user?.role}</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                    </div>
                    
                    <button className="dropdown-item">
                      <User size={16} />
                      Profile
                    </button>
                    
                    <button className="dropdown-item">
                      <Settings size={16} />
                      Settings
                    </button>
                    
                    <hr className="dropdown-divider" />
                    
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
      )}
    </header>
  );
};

export default Header;