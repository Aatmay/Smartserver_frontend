import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [alertStats, logs] = await Promise.all([
        API.get('/alerts/stats'),
        API.get('/food-logs'),
      ]);
      setStats(alertStats.data.stats);
      setRecentLogs(logs.data.logs.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Delete this food log? Any associated alert will also be deleted.')) return;
    try {
      await API.delete(`/food-logs/${logId}`);
      toast.success('Food log deleted');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const t = dark ? themes.dark : themes.light;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, color: t.text, fontFamily: 'Segoe UI, sans-serif', fontSize: '18px' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={styles.orb1} />}
      {dark && <div style={styles.orb2} />}

      {/* Navbar */}
      <nav style={{ ...styles.navbar, background: t.navbar, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🍱</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: dark ? '#a78bfa' : '#7c3aed' }}>
            SmartServe
          </span>
        </div>
        <div style={styles.navRight}>
          <button
            onClick={() => setDark(!dark)}
            style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div style={{ ...styles.userChip, background: t.card, border: `1px solid ${t.border}` }}>
            <span style={{ fontSize: '14px' }}>👤</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{user?.name}</span>
            <span style={styles.adminBadge}>Admin</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Page Header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: t.text, margin: '0 0 6px 0' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ color: t.muted, fontSize: '15px', margin: 0 }}>
            Monitor food logs, predictions and surplus alerts
          </p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Alerts', value: stats?.total || 0, icon: '🔔', color: '#7c3aed' },
            { label: 'Pending', value: stats?.pending || 0, icon: '⏳', color: '#f59e0b' },
            { label: 'Claimed', value: stats?.claimed || 0, icon: '✅', color: '#10b981' },
            { label: 'Redistributed', value: `${stats?.totalKgRedistributed || 0} kg`, icon: '♻️', color: '#db2777' },
          ].map((stat, i) => (
            <div key={i} style={{
              ...styles.statCard,
              background: t.card,
              border: `1px solid ${t.border}`,
              boxShadow: dark ? `0 4px 24px ${stat.color}22` : '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: `${stat.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '14px',
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: t.text, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: t.muted, fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin/food-log')} style={styles.primaryBtn}>
            + Add Food Log
          </button>
          <button onClick={() => navigate('/admin/predictions')} style={styles.secondaryBtn}>
            📊 Generate Prediction
          </button>
        </div>

        {/* Table Card */}
        <div style={{ ...styles.tableCard, background: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: t.text, margin: 0 }}>
              Recent Food Logs
            </h3>
            <span style={{ fontSize: '13px', color: t.muted }}>{recentLogs.length} entries</span>
          </div>

          {recentLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <p style={{ color: t.muted }}>No food logs yet. Add your first log!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Date', 'Meal', 'Prepared', 'Consumed', 'Leftover', 'Leftover %', 'Action'].map(h => (
                      <th key={h} style={{
                        padding: '11px 14px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        color: t.muted,
                        borderBottom: `1px solid ${t.border}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log._id} style={{ borderBottom: `1px solid ${t.border}` }}>
                      <td style={{ padding: '14px', fontSize: '14px', color: t.text }}>
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          background: dark ? 'rgba(124,58,237,0.2)' : '#ede9fe',
                          color: dark ? '#a78bfa' : '#7c3aed',
                        }}>
                          {log.mealType}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontSize: '14px', color: t.text }}>{log.foodPrepared} kg</td>
                      <td style={{ padding: '14px', fontSize: '14px', color: t.text }}>{log.foodConsumed} kg</td>
                      <td style={{ padding: '14px', fontSize: '14px', color: t.text }}>{log.leftover} kg</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: log.leftoverPercentage > 20
                            ? (dark ? 'rgba(239,68,68,0.2)' : '#fee2e2')
                            : (dark ? 'rgba(16,185,129,0.2)' : '#dcfce7'),
                          color: log.leftoverPercentage > 20 ? '#ef4444' : '#10b981',
                        }}>
                          {log.leftoverPercentage}%
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
                            color: '#ef4444',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#0d0d14',
    navbar: 'rgba(13,13,20,0.85)',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.09)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.45)',
  },
  light: {
    bg: '#f0f2f8',
    navbar: 'rgba(255,255,255,0.92)',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    muted: '#64748b',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'fixed', width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
    top: '-200px', left: '-200px', pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(219,39,119,0.08) 0%, transparent 70%)',
    bottom: '-200px', right: '-200px', pointerEvents: 'none', zIndex: 0,
  },
  navbar: {
    padding: '14px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: { fontSize: '26px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBtn: {
    padding: '7px 16px', borderRadius: '9px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '7px 14px', borderRadius: '9px',
  },
  adminBadge: {
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: 'white', padding: '3px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700',
  },
  logoutBtn: {
    padding: '7px 18px', borderRadius: '9px',
    border: '1px solid rgba(239,68,68,0.4)',
    background: 'rgba(239,68,68,0.1)',
    color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  content: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '18px',
    marginBottom: '24px',
  },
  statCard: {
    borderRadius: '16px',
    padding: '22px',
    backdropFilter: 'blur(10px)',
  },
  primaryBtn: {
    padding: '11px 22px', borderRadius: '11px', border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(124,58,237,0.35)',
  },
  secondaryBtn: {
    padding: '11px 22px', borderRadius: '11px', border: 'none',
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(16,185,129,0.35)',
  },
  tableCard: {
    borderRadius: '16px',
    padding: '22px',
    backdropFilter: 'blur(10px)',
  },
};

export default AdminDashboard;