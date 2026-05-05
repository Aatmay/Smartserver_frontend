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
        API.get('/alerts/stats'), API.get('/food-logs'),
      ]);
      setStats(alertStats.data.stats);
      setRecentLogs(logs.data.logs.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Delete this food log? Any associated alert will also be deleted.')) return;
    try {
      await API.delete(`/food-logs/${logId}`);
      toast.success('Food log deleted');
      fetchDashboardData();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const t = dark ? themes.dark : themes.light;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, color: t.text, fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍱</div>
        <p style={{ fontSize: '18px' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={{ ...styles.blob1 }} />}
      {dark && <div style={{ ...styles.blob2 }} />}

      {/* Navbar */}
      <nav style={{ ...styles.navbar, background: t.navbar, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.navLeft}>
          <span style={styles.navLogo}>🍱</span>
          <div>
            <span style={{ ...styles.navBrand, color: t.accent }}>SmartServe</span>
            <span style={{ ...styles.navSub, color: t.muted }}> Admin Portal</span>
          </div>
        </div>
        <div style={styles.navRight}>
          <button onClick={() => setDark(!dark)} style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <div style={{ ...styles.userChip, background: t.card, border: `1px solid ${t.border}` }}>
            <span style={{ fontSize: '14px' }}>👨‍🍳</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{user?.name}</span>
            <span style={styles.adminBadge}>Admin</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Welcome Banner */}
        <div style={{ ...styles.welcomeBanner, background: t.banner }}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p style={styles.welcomeSub}>Here's your canteen overview for today</p>
          </div>
          <div style={styles.welcomeDecor}>🌾</div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Alerts', value: stats?.total || 0, icon: '🔔', color: '#FF6B35', bg: dark ? 'rgba(255,107,53,0.1)' : '#FFF3EC' },
            { label: 'Pending', value: stats?.pending || 0, icon: '⏳', color: '#F39C12', bg: dark ? 'rgba(243,156,18,0.1)' : '#FFFBEC' },
            { label: 'Claimed', value: stats?.claimed || 0, icon: '✅', color: '#2ECC71', bg: dark ? 'rgba(46,204,113,0.1)' : '#F0FFF4' },
            { label: 'Food Redistributed', value: `${stats?.totalKgRedistributed || 0} kg`, icon: '♻️', color: '#9B59B6', bg: dark ? 'rgba(155,89,182,0.1)' : '#F9F0FF' },
          ].map((stat, i) => (
            <div key={i} style={{ ...styles.statCard, background: t.card, border: `1px solid ${t.border}` }}>
              <div style={{ ...styles.statIconBox, background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div style={{ ...styles.statValue, color: t.text }}>{stat.value}</div>
              <div style={{ ...styles.statLabel, color: t.muted }}>{stat.label}</div>
              <div style={{ ...styles.statBar, background: t.border }}>
                <div style={{ ...styles.statBarFill, background: stat.color, width: `${Math.min(((stat.value || 0) / 10) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={styles.actionsRow}>
          <button onClick={() => navigate('/admin/food-log')} style={styles.primaryBtn}>
            <span style={styles.btnIcon}>📝</span>
            Add Food Log
          </button>
          <button onClick={() => navigate('/admin/predictions')} style={styles.secondaryBtn}>
            <span style={styles.btnIcon}>🔮</span>
            ML Prediction
          </button>
        </div>

        {/* Food Logs Table */}
        <div style={{ ...styles.tableCard, background: t.card, border: `1px solid ${t.border}` }}>
          <div style={styles.tableTop}>
            <div style={styles.tableTopLeft}>
              <span style={styles.tableIcon}>🗓️</span>
              <h3 style={{ ...styles.tableTitle, color: t.text }}>Recent Food Logs</h3>
            </div>
            <span style={{ ...styles.tableCount, background: t.inputBg, color: t.muted }}>
              {recentLogs.length} entries
            </span>
          </div>

          {recentLogs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🍽️</div>
              <p style={{ color: t.muted, fontSize: '16px', fontWeight: '600' }}>No food logs yet</p>
              <p style={{ color: t.muted, fontSize: '14px' }}>Start by adding your first food log</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.inputBg }}>
                    {['Date', 'Meal', 'Prepared', 'Consumed', 'Leftover', 'Leftover %', 'Action'].map(h => (
                      <th key={h} style={{ ...styles.th, color: t.muted, borderBottom: `2px solid ${t.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log._id} style={{ borderBottom: `1px solid ${t.border}`, transition: 'background 0.2s' }}>
                      <td style={{ ...styles.td, color: t.text }}>{new Date(log.date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.mealChip, background: t.inputBg, color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}>
                          {log.mealType === 'breakfast' ? '🌅' : log.mealType === 'lunch' ? '☀️' : '🌙'} {log.mealType}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: t.text }}>{log.foodPrepared} kg</td>
                      <td style={{ ...styles.td, color: t.text }}>{log.foodConsumed} kg</td>
                      <td style={{ ...styles.td, color: t.text, fontWeight: '600' }}>{log.leftover} kg</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.percentChip,
                          background: log.leftoverPercentage > 20
                            ? (dark ? 'rgba(231,76,60,0.2)' : '#FFECEC')
                            : (dark ? 'rgba(46,204,113,0.2)' : '#ECFFF4'),
                          color: log.leftoverPercentage > 20 ? '#E74C3C' : '#27AE60',
                          border: `1px solid ${log.leftoverPercentage > 20 ? 'rgba(231,76,60,0.4)' : 'rgba(46,204,113,0.4)'}`,
                        }}>
                          {log.leftoverPercentage > 20 ? '⚠️' : '✅'} {log.leftoverPercentage}%
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleDeleteLog(log._id)} style={styles.deleteBtn}>
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
    bg: '#1A0A00',
    navbar: 'rgba(26,10,0,0.9)',
    card: '#2A1500',
    banner: 'linear-gradient(135deg, #FF6B35 0%, #CC4400 100%)',
    border: 'rgba(255,107,53,0.2)',
    inputBg: 'rgba(255,107,53,0.08)',
    text: '#FFF8F0',
    muted: 'rgba(255,248,240,0.5)',
    accent: '#FF8C5A',
  },
  light: {
    bg: '#FFF8F0',
    navbar: 'rgba(255,255,255,0.95)',
    card: '#FFFFFF',
    banner: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
    border: '#FFD4B8',
    inputBg: '#FFF3EC',
    text: '#2D1200',
    muted: '#8B5E3C',
    accent: '#FF6B35',
  },
};

const styles = {
  container: { minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  blob1: { position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)', top: '-200px', left: '-200px', pointerEvents: 'none', zIndex: 0 },
  blob2: { position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.08) 0%, transparent 70%)', bottom: '-200px', right: '-200px', pointerEvents: 'none', zIndex: 0 },
  navbar: { padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLogo: { fontSize: '28px' },
  navBrand: { fontSize: '20px', fontWeight: '800' },
  navSub: { fontSize: '14px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBtn: { padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  userChip: { display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '20px' },
  adminBadge: { background: 'linear-gradient(135deg, #FF6B35, #FF8C00)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  logoutBtn: { padding: '7px 18px', borderRadius: '20px', border: '1px solid rgba(231,76,60,0.4)', background: 'rgba(231,76,60,0.1)', color: '#E74C3C', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  content: { padding: '24px 32px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },
  welcomeBanner: { borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(255,107,53,0.3)' },
  welcomeTitle: { fontSize: '24px', fontWeight: '800', color: 'white', margin: '0 0 6px 0' },
  welcomeSub: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', margin: 0, fontStyle: 'italic' },
  welcomeDecor: { fontSize: '60px', opacity: 0.4 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  statCard: { borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' },
  statIconBox: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' },
  statValue: { fontSize: '28px', fontWeight: '800', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '500', marginBottom: '12px' },
  statBar: { height: '4px', borderRadius: '2px', overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s ease' },
  actionsRow: { display: 'flex', gap: '14px', marginBottom: '20px' },
  primaryBtn: { padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #FF6B35, #FF8C00)', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(255,107,53,0.35)' },
  secondaryBtn: { padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #27AE60, #2ECC71)', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(46,204,113,0.35)' },
  btnIcon: { fontSize: '16px' },
  tableCard: { borderRadius: '16px', padding: '22px', backdropFilter: 'blur(10px)' },
  tableTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  tableTopLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  tableIcon: { fontSize: '20px' },
  tableTitle: { fontSize: '17px', fontWeight: '700', margin: 0 },
  tableCount: { fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '48px' },
  emptyIcon: { fontSize: '64px', marginBottom: '12px' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  td: { padding: '14px', fontSize: '14px' },
  mealChip: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  percentChip: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  deleteBtn: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'rgba(231,76,60,0.1)', color: '#E74C3C', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: '1px solid rgba(231,76,60,0.3)' },
};

export default AdminDashboard;