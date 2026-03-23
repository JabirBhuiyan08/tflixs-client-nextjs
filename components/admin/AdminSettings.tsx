'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import './AdminLayout.css';

export default function AdminSettings() {
  const { admin, changePassword } = useAuth();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading,   setLoading]   = useState(false);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('New passwords do not match.'); return; }
    if (newPw.length < 8)    { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await changePassword(currentPw, newPw);
      toast.success('Password changed successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="admin-page-header"><h1>⚙️ Settings</h1></div>

      {/* Account info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><h3>Account Information</h3></div>
        <div className="card-body">
          <div className="grid-2">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={admin?.name ?? ''} disabled />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={admin?.email ?? ''} disabled />
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" className="form-control" value={admin?.role ?? 'admin'} disabled />
          </div>
          <small style={{ color: 'var(--stone)', fontSize: '0.8rem' }}>
            Account details are managed through Firebase Authentication.
          </small>
        </div>
      </div>

      {/* Change password */}
      <div className="card">
        <div className="card-header"><h3>Change Password</h3></div>
        <div className="card-body">
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" className="form-control" placeholder="Enter current password"
                value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" placeholder="Min. 8 characters"
                  value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" placeholder="Repeat new password"
                  value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required minLength={8} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Changing…' : '🔐 Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
