import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpensePreview from './ExpensePreview';
import './EmployeeDashboard.css';

const EmployeeDashboard = ({ user }) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpensePreview, setShowExpensePreview] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      employee: 'John Smith',
      description: 'Business lunch with client - Restaurant bill',
      date: '2nd Oct, 2025',
      category: 'Food & Dining',
      paidBy: 'Personal Card',
      remarks: 'Meeting with ABC Corp client to discuss project requirements',
      amount: 2500,
      currency: 'INR',
      status: 'Approved'
    },
    {
      id: 2,
      employee: 'John Smith',
      description: 'Uber ride to client office',
      date: '3rd Oct, 2025',
      category: 'Transportation',
      paidBy: 'Personal Card',
      remarks: 'Taxi fare for client meeting at downtown office',
      amount: 450,
      currency: 'INR',
      status: 'Submitted'
    },
    {
      id: 3,
      employee: 'John Smith',
      description: 'Office supplies - Stationery and printer cartridges',
      date: '1st Oct, 2025',
      category: 'Office Supplies',
      paidBy: 'Company Card',
      remarks: 'Purchased supplies for the team',
      amount: 1800,
      currency: 'INR',
      status: 'Draft'
    },
    {
      id: 4,
      employee: 'John Smith',
      description: 'Hotel accommodation - Business trip to Mumbai',
      date: '28th Sep, 2025',
      category: 'Accommodation',
      paidBy: 'Personal Card',
      remarks: '2 nights stay for client presentation',
      amount: 8500,
      currency: 'INR',
      status: 'Approved'
    },
    {
      id: 5,
      employee: 'John Smith',
      description: 'Flight tickets - Delhi to Mumbai return',
      date: '28th Sep, 2025',
      category: 'Travel',
      paidBy: 'Personal Card',
      remarks: 'Business trip for client presentation',
      amount: 12000,
      currency: 'INR',
      status: 'Approved'
    },
    {
      id: 6,
      employee: 'John Smith',
      description: 'Internet and phone bills',
      date: '30th Sep, 2025',
      category: 'Internet & Communication',
      paidBy: 'Personal Card',
      remarks: 'Monthly internet and mobile bills for work',
      amount: 3200,
      currency: 'INR',
      status: 'Submitted'
    }
  ]);

  const handleNewExpense = () => {
    setShowExpenseForm(true);
  };

  const handleUploadReceipt = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('File selected:', file.name);
        // Process the file for OCR or manual entry
        setShowExpenseForm(true);
      }
    };
    input.click();
  };

  const handleExpenseClick = (expense) => {
    if (expense.status.toLowerCase() === 'draft') {
      setSelectedExpense(expense);
      setShowExpenseForm(true);
    } else {
      setSelectedExpense(expense);
      setShowExpensePreview(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'status-draft';
      case 'submitted':
        return 'status-submitted';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-draft';
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats with amounts
  const stats = {
    draft: {
      count: expenses.filter(e => e.status.toLowerCase() === 'draft').length,
      amount: expenses.filter(e => e.status.toLowerCase() === 'draft').reduce((sum, e) => sum + e.amount, 0)
    },
    submitted: {
      count: expenses.filter(e => e.status.toLowerCase() === 'submitted').length,
      amount: expenses.filter(e => e.status.toLowerCase() === 'submitted').reduce((sum, e) => sum + e.amount, 0)
    },
    approved: {
      count: expenses.filter(e => e.status.toLowerCase() === 'approved').length,
      amount: expenses.filter(e => e.status.toLowerCase() === 'approved').reduce((sum, e) => sum + e.amount, 0)
    },
    rejected: {
      count: expenses.filter(e => e.status.toLowerCase() === 'rejected').length,
      amount: expenses.filter(e => e.status.toLowerCase() === 'rejected').reduce((sum, e) => sum + e.amount, 0)
    }
  };

  if (showExpenseForm) {
    return (
      <ExpenseForm 
        expense={selectedExpense}
        onClose={() => {
          setShowExpenseForm(false);
          setSelectedExpense(null);
        }}
        onSubmit={(expenseData) => {
          if (selectedExpense) {
            // Update existing expense
            setExpenses(expenses.map(exp => 
              exp.id === selectedExpense.id 
                ? { ...expenseData, id: selectedExpense.id, employee: user?.name || 'Current User' }
                : exp
            ));
          } else {
            // Create new expense
            const newExpense = {
              ...expenseData,
              id: expenses.length + 1,
              employee: user?.name || 'Current User',
              status: 'Draft'
            };
            setExpenses([...expenses, newExpense]);
          }
          setShowExpenseForm(false);
          setSelectedExpense(null);
        }}
      />
    );
  }

  if (showExpensePreview && selectedExpense) {
    return (
      <ExpensePreview 
        expense={selectedExpense}
        onClose={() => {
          setShowExpensePreview(false);
          setSelectedExpense(null);
        }}
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        <div className="main-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1>Employee Dashboard</h1>
            <p>Manage your expense claims and track their status</p>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleNewExpense} className="btn btn-primary">
              <Plus size={20} />
              New Expense
            </button>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <Filter size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="table-container">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th>Remarks</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr 
                    key={expense.id} 
                    className="expense-row"
                    onClick={() => handleExpenseClick(expense)}
                  >
                    <td>{expense.employee}</td>
                    <td>{expense.description}</td>
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.paidBy}</td>
                    <td>{expense.remarks}</td>
                    <td>{expense.amount} {expense.currency}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="no-results">
              <div className="no-results-title">No expenses found</div>
              <p className="no-results-subtitle">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats */}
        <div className="stats-sidebar">
          <h3>Expense Summary</h3>
          <div className="stats-list">
            <div className="stat-item draft">
              <div className="stat-header">
                <span className="stat-label">Draft</span>
                <span className="stat-count">{stats.draft.count}</span>
              </div>
              <div className="stat-amount">₹{stats.draft.amount.toLocaleString()}</div>
            </div>
            
            <div className="stat-item submitted">
              <div className="stat-header">
                <span className="stat-label">Waiting Approval</span>
                <span className="stat-count">{stats.submitted.count}</span>
              </div>
              <div className="stat-amount">₹{stats.submitted.amount.toLocaleString()}</div>
            </div>
            
            <div className="stat-item approved">
              <div className="stat-header">
                <span className="stat-label">Approved</span>
                <span className="stat-count">{stats.approved.count}</span>
              </div>
              <div className="stat-amount">₹{stats.approved.amount.toLocaleString()}</div>
            </div>
            
            <div className="stat-item rejected">
              <div className="stat-header">
                <span className="stat-label">Rejected</span>
                <span className="stat-count">{stats.rejected.count}</span>
              </div>
              <div className="stat-amount">₹{stats.rejected.amount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;