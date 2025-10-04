import { useState, useEffect } from 'react';

export default function ManagerView({ onLogout }) {
  // Mock approval items — in a real app these would come from the server
  const initialApprovals = [
    { id: 1, subject: 'Team dinner', owner: 'Sarah', category: 'Food', amount: 567, currency: 'USD', status: 'Pending' },
    { id: 2, subject: 'Taxi to client', owner: 'David', category: 'Travel', amount: 42, currency: 'USD', status: 'Pending' },
    { id: 3, subject: 'Conference fee', owner: 'Priya', category: 'Training', amount: 300, currency: 'USD', status: 'Approved' },
  ];

  const [approvals, setApprovals] = useState(() => {
    try {
      const raw = localStorage.getItem('manager:approvals');
      return raw ? JSON.parse(raw) : initialApprovals;
    } catch (e) {
      return initialApprovals;
    }
  });

  useEffect(() => {
    localStorage.setItem('manager:approvals', JSON.stringify(approvals));
  }, [approvals]);

  const handleDecision = (id, decision) => {
    setApprovals((prev) => prev.map(a => a.id === id ? { ...a, status: decision } : a));
  };

  return (
    <div className="app-bg">
      <div className="app-container">
        <div className="panel-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="page-title">Manager Dashboard</h1>
            <div className="actions">
              <button onClick={() => { localStorage.removeItem('manager:approvals'); setApprovals(initialApprovals); }} className="btn-ghost">Reset</button>
              {onLogout && <button onClick={onLogout} className="btn-danger">Logout</button>}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4" style={{color: '#e6eef8'}}>Approvals to review</h2>

          <div style={{overflowX: 'auto'}}>
            <table className="panel-table" style={{width: '100%'}}>
              <thead>
                <tr>
                  <th>Approval Subject</th>
                  <th>Request Owner</th>
                  <th>Category</th>
                  <th>Request Status</th>
                  <th>Total amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((a) => (
                  <tr key={a.id} className={a.status !== 'Pending' ? 'muted-row' : ''}>
                    <td data-label="Approval Subject">{a.subject}</td>
                    <td data-label="Request Owner">{a.owner}</td>
                    <td data-label="Category">{a.category}</td>
                    <td data-label="Request Status">{a.status}</td>
                    <td data-label="Total amount">{a.amount} {a.currency}</td>
                    <td data-label="Actions">
                      {a.status === 'Pending' ? (
                        <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                          <button className="btn-primary-sm" onClick={() => handleDecision(a.id, 'Approved')}>Approve</button>
                          <button className="btn-danger-sm" onClick={() => handleDecision(a.id, 'Rejected')}>Reject</button>
                        </div>
                      ) : (
                        <span className="small-muted">Decision recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
