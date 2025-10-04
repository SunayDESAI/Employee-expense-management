import { X, Calendar, FileText, Tag } from 'lucide-react';
import './ExpensePreview.css';

const ExpensePreview = ({ expense, onClose }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="preview-overlay">
      <div className="preview-container">
        <div className="preview-header">
          <div>
            <h2>Expense Details</h2>
            <span className={`status-badge ${getStatusColor(expense.status)}`}>
              {expense.status}
            </span>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="preview-content">
          <div className="preview-section">
            <div className="section-title">
              <FileText size={16} />
              Basic Information
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Description</label>
                <p>{expense.description}</p>
              </div>
              <div className="info-item">
                <label>Category</label>
                <p>{expense.category}</p>
              </div>
            </div>
          </div>

          <div className="preview-section">
            <div className="section-title">
              <Calendar size={16} />
              Date & Employee
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Date</label>
                <p>{expense.date}</p>
              </div>
              <div className="info-item">
                <label>Employee</label>
                <p>{expense.employee}</p>
              </div>
            </div>
          </div>

          <div className="preview-section">
            <div className="section-title">
              Amount & Payment
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Amount</label>
                <p className="amount-display">{expense.amount} {expense.currency}</p>
              </div>
              <div className="info-item">
                <label>Paid By</label>
                <p>{expense.paidBy}</p>
              </div>
            </div>
          </div>

          {expense.remarks && (
            <div className="preview-section">
              <div className="section-title">
                <Tag size={16} />
                Remarks
              </div>
              <div className="info-item full-width">
                <p className="remarks-text">{expense.remarks}</p>
              </div>
            </div>
          )}

          {expense.receipt && (
            <div className="preview-section">
              <div className="section-title">
                <FileText size={16} />
                Receipt
              </div>
              <div className="receipt-preview">
                <img src={expense.receipt} alt="Receipt" className="receipt-image" />
              </div>
            </div>
          )}
        </div>

        <div className="preview-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpensePreview;