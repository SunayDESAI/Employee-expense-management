import React, { useState, useEffect } from 'react';

export default function ApprovalRules({ user, onBack }) {
  // initial mock approvers list
  const [manager, setManager] = useState(user?.manager || '');
  const [approvers, setApprovers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [sequence, setSequence] = useState(false);
  // per your PDF, default minimum approval percentage should be 60%
  const [minPercentage, setMinPercentage] = useState(60);
  const [managerIsApprover, setManagerIsApprover] = useState(false);

  // Load saved rules for this user from localStorage (if any)
  useEffect(() => {
    if (!user) return;
    try {
      const key = `approvalRules:${user.id}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.manager) setManager(parsed.manager);
        if (Array.isArray(parsed.approvers)) setApprovers(parsed.approvers);
        if (typeof parsed.sequence === 'boolean') setSequence(parsed.sequence);
        if (typeof parsed.minPercentage === 'number') setMinPercentage(parsed.minPercentage);
        if (typeof parsed.managerIsApprover === 'boolean') setManagerIsApprover(parsed.managerIsApprover);
      }
    } catch (err) {
      console.warn('Unable to load approval rules', err);
    }
  }, [user]);

  // Try to fetch users from backend; fall back to localStorage or empty list
  useEffect(() => {
    let mounted = true;
    fetch('/api/users')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setAllUsers(data);
          // if we don't have any approvers loaded yet, pick first few other users
          if (!localStorage.getItem(`approvalRules:${user?.id}`)) {
            const choices = data.filter(u => u.id !== user?.id).slice(0,3).map((u, i) => ({ id: u.id, name: u.name, required: i===0 }));
            setApprovers(choices);
            // set manager to user's manager if present in data
            const usr = data.find(u => u.id === user?.id);
            if (usr && usr.manager) setManager(usr.manager);
          }
        }
      })
      .catch(() => {
        // fallback: if localStorage contains users list, parse it
        try {
          const raw = localStorage.getItem('users:list');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setAllUsers(parsed);
          }
        } catch (e) {
          // ignore
        }
      });
    return () => { mounted = false };
  }, [user]);

  const saveRulesToStorage = () => {
    if (!user) return;
    const key = `approvalRules:${user.id}`;
    const payload = { manager, approvers, sequence, minPercentage, managerIsApprover };
    localStorage.setItem(key, JSON.stringify(payload));
  };

  const toggleApproverRequired = (id) => {
    setApprovers(approvers.map(a => a.id === id ? { ...a, required: !a.required } : a));
  };

  const moveApprover = (id, dir) => {
    const idx = approvers.findIndex(a => a.id === id);
    if (idx === -1) return;
    const newIndex = dir === 'up' ? idx - 1 : idx + 1;
    if (newIndex < 0 || newIndex >= approvers.length) return;
    const copy = approvers.slice();
    const [item] = copy.splice(idx, 1);
    copy.splice(newIndex, 0, item);
    setApprovers(copy);
  };

  const handleSave = () => {
    if (minPercentage < 0 || minPercentage > 100) {
      alert('Minimum approval percentage must be between 0 and 100.');
      return;
    }
    // Save to localStorage for per-user persistence
    saveRulesToStorage();
    alert(`Approval rules saved. Minimum approval: ${minPercentage}%. Sequence: ${sequence ? 'On' : 'Off'}`);
    // return to admin dashboard after save
    if (typeof onBack === 'function') onBack();
  };

  return (
    <div className="app-bg">
      <div className="app-container">
        <div className="panel-card p-6 rounded-2xl">
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <h1 className="page-title" style={{marginTop: '0.5rem'}}>Approval rules for {user?.name || 'User'}</h1>

          <div style={{marginTop: '1.25rem'}}>
            <label className="block text-sm text-gray-400">Manager</label>
            <select value={manager} onChange={(e) => setManager(e.target.value)} className="w-full p-2.5 mt-2 rounded-lg bg-white text-gray-900">
              <option value="">Select Manager</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <section style={{marginTop: '1.5rem'}}>
            <h3 className="text-lg font-semibold">Approvers</h3>
            <label style={{display: 'block', marginTop: '0.5rem'}}><input type="checkbox" checked={managerIsApprover} onChange={(e)=>setManagerIsApprover(e.target.checked)} /> Is manager an approver?</label>

            <div style={{marginTop: '0.75rem'}}>
              <table style={{width:'100%'}}>
                <thead>
                  <tr><th>User</th><th style={{textAlign:'center'}}>Move</th><th style={{textAlign:'right'}}>Required</th></tr>
                </thead>
                <tbody>
                  {approvers.map((a, idx) => (
                    <tr key={a.id}>
                      <td>{allUsers.find(u => u.id === a.id)?.name || a.name}</td>
                      <td style={{textAlign:'center'}}>
                        <button className="btn-secondary" onClick={() => moveApprover(a.id, 'up')} disabled={idx===0}>↑</button>
                        <button className="btn-secondary" onClick={() => moveApprover(a.id, 'down')} disabled={idx===approvers.length-1}>↓</button>
                      </td>
                      <td style={{textAlign:'right'}}><input type="checkbox" checked={a.required} onChange={() => toggleApproverRequired(a.id)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{marginTop:'1rem'}}>
              <label><input type="checkbox" checked={sequence} onChange={(e) => setSequence(e.target.checked)} /> Approvers Sequence matters</label>
            </div>

            <div style={{marginTop:'1rem'}}>
              <label className="block text-sm text-gray-400">Minimum Approval percentage</label>
              <input type="number" value={minPercentage} onChange={(e)=>setMinPercentage(Number(e.target.value))} className="w-32 p-2 mt-2 rounded-lg bg-white text-gray-900" />
            </div>

            <div style={{marginTop:'1.5rem', display:'flex', gap:'0.75rem', justifyContent:'flex-end'}}>
              <button className="btn-ghost" onClick={onBack}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save Rules</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
