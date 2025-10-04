// src/App.jsx
import { useState } from 'react';
import Auth from './pages/Auth.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import ApprovalRules from './pages/ApprovalRules.jsx';
import ManagerView from './pages/ManagerView.jsx';
// Employee dashboard can be added later

function App() {
  // Store authentication status and user role
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    userRole: null, // Will be 'Admin', 'Manager', or 'Employee'
  });

  // Function to be called after successful login/signup, passing the determined role
  const handleAuthSuccess = (role) => {
    setAuthStatus({
      isAuthenticated: true,
      userRole: role,
    });
  };

  // simple in-app routing for admin pages
  const [page, setPage] = useState('main'); // 'main' | 'approval'
  const [selectedUserForApproval, setSelectedUserForApproval] = useState(null);

  const openApprovalForUser = (user) => {
    setSelectedUserForApproval(user);
    setPage('approval');
  };

  const closeApprovalPage = () => {
    setSelectedUserForApproval(null);
    setPage('main');
  };

  // Function to simulate logging out (for future use)
  const handleLogout = () => {
    setAuthStatus({
      isAuthenticated: false,
      userRole: null,
    });
  };

  // Determine which component to render
  const renderAppContent = () => {
    if (!authStatus.isAuthenticated) {
      // Show the Auth page and pass the success handler
      return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    // --- LOGIC TO RENDER DASHBOARD BASED ON ROLE ---
    if (authStatus.userRole === 'Admin') {
      if (page === 'approval') {
        return <ApprovalRules user={selectedUserForApproval} onBack={closeApprovalPage} />;
      }
      return <AdminDashboard onLogout={handleLogout} onOpenApproval={openApprovalForUser} />;
    }

    if (authStatus.userRole === 'Manager') {
      return <ManagerView onLogout={handleLogout} />;
    }

    if (authStatus.userRole === 'Employee') {
      return <div>Employee Dashboard Placeholder</div>;
    }

    // Fallback for unknown role
    console.error("Authentication Error: User logged in with unknown role.");
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  };

  return (
    <>
      {renderAppContent()}
    </>
  );
}

export default App;