import { useState } from 'react';
import { X, Upload, Calendar, DollarSign } from 'lucide-react';
import './ExpenseForm.css';

const ExpenseForm = ({ onClose, onSubmit, expense = null }) => {
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    date: expense?.date || '',
    category: expense?.category || '',
    paidBy: expense?.paidBy || '',
    amount: expense?.amount || '',
    currency: expense?.currency || 'INR',
    remarks: expense?.remarks || '',
    receipt: null
  });

  const [isDraft, setIsDraft] = useState(false);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Accommodation',
    'Office Supplies',
    'Client Entertainment',
    'Travel',
    'Training & Development',
    'Internet & Communication',
    'Other'
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.date || !formData.category || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      status: isDraft ? 'Draft' : 'Submitted',
      amount: parseFloat(formData.amount)
    };

    onSubmit(expenseData);
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    const event = { preventDefault: () => {} };
    handleSubmit(event);
  };

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        {/* Header */}
        <div className="expense-form-header">
          <div className="header-content">
            <h2 className="form-title">
              {expense ? 'Edit Expense' : 'New Expense Claim'}
            </h2>
            <div className="status-badges">
              <span className="status-badge draft">Draft</span>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="expense-form">
          {/* Receipt Upload */}
          <div className="form-section">
            <label className="form-label">Attach Receipt</label>
            <div className="upload-area">
              <Upload className="upload-icon" />
              <div className="upload-text">Click to upload or drag and drop</div>
              <div className="upload-subtext">PNG, JPG, PDF up to 10MB</div>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                className="file-input"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="upload-button">
                Choose File
              </label>
              {formData.receipt && (
                <div className="file-selected">✓ {formData.receipt.name}</div>
              )}
            </div>
          </div>

          <div className="form-grid">
            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Restaurant bill for client meeting"
                className="form-input"
                required
              />
            </div>

            {/* Expense Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Expense Date *
              </label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={20} />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid By */}
            <div className="form-group">
              <label htmlFor="paidBy" className="form-label">
                Paid By
              </label>
              <select
                id="paidBy"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select payment method</option>
                <option value="Personal Card">Personal Card</option>
                <option value="Company Card">Company Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Total Amount */}
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Total Amount *
              </label>
              <div className="amount-input-container">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="form-input amount-input"
                  required
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="currency-select"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remarks */}
            <div className="form-group full-width">
              <label htmlFor="remarks" className="form-label">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes or comments..."
                className="form-textarea"
              />
            </div>
          </div>

         

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="btn btn-secondary"
            >
              Save as Draft
            </button>
            
            <div className="action-group">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ExpenseForm;