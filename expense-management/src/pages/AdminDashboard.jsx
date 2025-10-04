// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';

// Mock data structure for users in the company (starting with the Admin)
const initialUsers = [
  { 
    id: 1, 
    name: "Admin User", 
    role: "Admin", 
    manager: "N/A", 
    email: "admin@company.com" 
  },
];

// Small input helper used by the modal form. Moved out of the component so its
// identity is stable between renders (prevents input unmount/re-mount and
// focus loss while typing).
function FormInput({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2.5 border border-gray-300 rounded-lg shadow-inner focus:ring-indigo-600 focus:border-indigo-600 bg-white transition duration-150"
      />
    </div>
  );
}

// IMPORTANT: Component accepts onLogout prop from App.jsx
export default function AdminDashboard({ onLogout, onOpenApproval }) {
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('users:list');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore parse errors
    }
    return initialUsers;
  });

  // persist users when they change so navigation away/back keeps data
  useEffect(() => {
    try { localStorage.setItem('users:list', JSON.stringify(users)); } catch (e) { /* ignore */ }
  }, [users]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    role: 'Employee', 
    managerId: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  // Expense approval state
  const [expenses, setExpenses] = useState([
    // mock expenses for demonstration
    { id: 1, userId: 2, title: 'Flight to Client', amount: 420.00, date: '2025-09-20', status: 'Pending' },
    { id: 2, userId: 2, title: 'Hotel Stay', amount: 320.00, date: '2025-09-21', status: 'Pending' },
  ]);
  const [approvalModal, setApprovalModal] = useState({ open: false, user: null });

  const availableRoles = ["Employee", "Manager"];
  const availableManagers = users.filter(u => u.role === 'Manager' || u.role === 'Admin');

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    // Find the manager name based on the selected managerId
    const manager = availableManagers.find(m => m.id === parseInt(newUser.managerId));

    if (isEditing && editingUserId != null) {
      // Update existing user
      const updatedUsers = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            manager: manager ? manager.name : 'N/A',
          };
        }
        return u;
      });
      setUsers(updatedUsers);
      setIsEditing(false);
      setEditingUserId(null);
      setNewUser({ name: '', email: '', role: 'Employee', managerId: '' });
      setIsModalOpen(false);
      alert(`User updated.`);
      return;
    }

    // Create new user
    const newUserData = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      manager: manager ? manager.name : 'N/A',
    };

    setUsers([...users, newUserData]);
    // Reset form state
    setNewUser({ name: '', email: '', role: 'Employee', managerId: '' });
    setIsModalOpen(false);
    
    // System should send a randomly generated unique password.
    alert(`User ${newUserData.name} created with role ${newUserData.role}. A temporary password email would be sent now.`);
  };

  const handleEditUser = (user) => {
    // pre-fill form and open modal in edit mode
    const managerId = users.find(u => u.name === user.manager)?.id || '';
    setNewUser({ name: user.name, email: user.email, role: user.role, managerId: managerId });
    setIsEditing(true);
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const ok = window.confirm(`Delete user ${user.name}? This action cannot be undone.`);
    if (!ok) return;
    setUsers(users.filter(u => u.id !== userId));
  };

  // Admin: open approval modal for a user (only if current logged-in role is Admin)
  const openApprovalForUser = (user) => {
    // ensure only Admin can open (this component is used only when admin logged in via App)
    setApprovalModal({ open: true, user });
  };

  const closeApprovalModal = () => setApprovalModal({ open: false, user: null });

  const handleApproveExpense = (expenseId) => {
    setExpenses(expenses.map(x => x.id === expenseId ? { ...x, status: 'Approved' } : x));
  };

  const handleRejectExpense = (expenseId) => {
    setExpenses(expenses.map(x => x.id === expenseId ? { ...x, status: 'Rejected' } : x));
  };

  // Handles the "Send Password" action
  const handleSendPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Clicks on this button should send a randomly generated unique password.
        alert(`Random password email sent to ${user.email}!`);
    }
  };

  // Helper function for role badge colors
  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-indigo-100 text-indigo-800';
      case 'Manager': return 'bg-yellow-100 text-yellow-800';
      case 'Employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  

  return (
    <div className="app-bg">
      <div className="app-container">
        <div className="panel-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="actions">
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">+ Create New User</button>
            <button onClick={onLogout} className="btn-danger">Logout</button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4" style={{color: '#e6eef8'}}>User Management</h2>

        <div style={{overflowX: 'auto'}}>
          <table className="panel-table" style={{width: '100%'}}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="User"><button style={{background: 'transparent', border: 'none', color: '#e6eef8', cursor: 'pointer', padding:0}} onClick={() => onOpenApproval(user)}>{user.name}</button></td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role"><span className={`role-badge ${user.role === 'Admin' ? 'admin' : user.role === 'Manager' ? 'manager' : 'employee'}`}>{user.role}</span></td>
                  <td data-label="Manager">{user.manager}</td>
                  <td data-label="Actions">
                    {user.role !== 'Admin' ? (
                      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                        <button className="btn-primary-sm" onClick={() => handleSendPassword(user.id)}>Send Password</button>
                        <button className="btn-secondary" onClick={() => handleEditUser(user)}>Edit</button>
                        <button className="btn-danger-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendPassword(user.id)}
                        disabled={user.role === 'Admin'}
                        className="btn-primary"
                        style={{opacity: user.role === 'Admin' ? 0.5 : 1}}
                      >
                        Send Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal for Creating New User --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">{isEditing ? 'Edit User' : 'Create Employee or Manager'}</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">

              {/* Name */}
              <FormInput label="Full Name" name="name" type="text" value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />

              {/* Email */}
              <FormInput label="Email" name="email" type="email" value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg shadow-inner focus:ring-indigo-600 focus:border-indigo-600 bg-white transition duration-150"
                  required
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Manager Assignment */}
              {newUser.role !== 'Admin' && availableManagers.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Manager</label>
                  <select
                    value={newUser.managerId}
                    onChange={(e) => setNewUser({ ...newUser, managerId: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg shadow-inner focus:ring-indigo-600 focus:border-indigo-600 bg-white transition duration-150"
                    required
                  >
                    <option value="">Select a Manager</option>
                    {availableManagers.map(manager => (
                      <option key={manager.id} value={manager.id}>{manager.name} ({manager.role})</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Defines manager relationship for employees.
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {isEditing ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Approval navigates to separate page now (ApprovalRules) */}
      </div>
    </div>
  );
}

// (ExpenseApprovalModal removed — approval is handled on the ApprovalRules page)
