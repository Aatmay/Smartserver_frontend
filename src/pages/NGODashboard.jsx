import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const NGODashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await API.get('/alerts');
      setAlerts(data.alerts);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (alertId) => {
    setClaimingId(alertId);
    try {
      await API.patch(`/alerts/${alertId}/claim`);
      toast.success('Alert claimed! Thank you for helping reduce food waste 🙏');
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim alert');
    } finally {
      setClaimingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const t = dark ? themes.dark : themes.light;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, color: t.text, fontFamily: 'Segoe UI, sans-serif', fontSize: '18px' }}>
      Loading...
    </div>
  );

  const pendingAlerts = alerts.filter((a) => a.status === 'pending');
  const claimedAlerts = alerts.filter(
    (a) => a.status === 'claimed' && String(a.claimedBy?._id) === String(user?.id)
  );

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={styles.orb1} />}
      {dark && <div style={styles.orb2} />}

      {/* Navbar */}
      <nav style={{ ...styles.navbar, background: t.navbar, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>🍱</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: dark ? '#6ee7b7' : '#059669' }}>
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
            <span style={styles.ngoBadge}>NGO</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: t.text, margin: '0 0 6px 0' }}>
            NGO Dashboard 🤝
          </h2>
          <p style={{ color: t.muted, fontSize: '15px', margin: 0 }}>
            View and claim surplus food alerts from canteens near you
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Available Alerts', value: pendingAlerts.length, icon: '🔔', color: '#f59e0b' },
            { label: 'Claimed by You', value: claimedAlerts.length, icon: '✅', color: '#10b981' },
            { label: 'Total Food Saved', value: `${claimedAlerts.reduce((s, a) => s + a.surplusQuantity, 0)} kg`, icon: '♻️', color: '#7c3aed' },
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

        {/* Pending Alerts */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: t.text, margin: 0 }}>
              🔔 Pending Surplus Alerts
            </h3>
            <span style={{
              background: 'rgba(245,158,11,0.2)', color: '#f59e0b',
              padding: '2px 10px', borderRadius: '20px',
              fontSize: '13px', fontWeight: '700',
            }}>
              {pendingAlerts.length}
            </span>
          </div>

          {pendingAlerts.length === 0 ? (
            <div style={{
              ...styles.emptyCard,
              background: t.card,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <p style={{ fontSize: '17px', fontWeight: '600', color: t.text, margin: '0 0 8px 0' }}>
                No pending alerts right now.
              </p>
              <p style={{ fontSize: '14px', color: t.muted, margin: 0 }}>
                Check back later for new surplus food alerts.
              </p>
            </div>
          ) : (
            <div style={styles.alertGrid}>
              {pendingAlerts.map((alert) => (
                <div key={alert._id} style={{
                  ...styles.alertCard,
                  background: t.card,
                  border: dark ? '1px solid rgba(245,158,11,0.25)' : '1px solid #fde68a',
                  boxShadow: dark ? '0 4px 20px rgba(245,158,11,0.08)' : '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
                      background: dark ? 'rgba(245,158,11,0.2)' : '#fef3c7',
                      color: '#f59e0b',
                    }}>
                      {alert.mealType}
                    </span>
                    <span style={{ fontSize: '13px', color: t.muted }}>
                      {new Date(alert.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '44px', fontWeight: '800', color: '#ef4444', lineHeight: 1 }}>
                    {alert.surplusQuantity} kg
                  </div>
                  <p style={{ fontSize: '13px', color: t.muted, marginBottom: '16px' }}>
                    surplus food available
                  </p>

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    marginBottom: '18px', padding: '12px', borderRadius: '10px',
                    background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    border: `1px solid ${t.border}`,
                  }}>
                    {[
                      { label: 'Leftover %', value: `${alert.leftoverPercentage}%`, red: true },
                      { label: 'From', value: alert.createdBy?.organization || 'Canteen' },
                      ...(alert.foodLog?.menuItems?.length > 0
                        ? [{ label: 'Menu', value: alert.foodLog.menuItems.join(', ') }]
                        : []),
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: t.muted }}>{item.label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: item.red ? '#ef4444' : t.text }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleClaim(alert._id)}
                    disabled={claimingId === alert._id}
                    style={{ ...styles.claimBtn, opacity: claimingId === alert._id ? 0.7 : 1 }}
                  >
                    {claimingId === alert._id ? '⏳ Claiming...' : '✋ Claim This Food'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claimed Alerts */}
        {claimedAlerts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: t.text, margin: 0 }}>
                ✅ Claimed Alerts
              </h3>
              <span style={{
                background: 'rgba(16,185,129,0.2)', color: '#10b981',
                padding: '2px 10px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '700',
              }}>
                {claimedAlerts.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {claimedAlerts.map((alert) => (
                <div key={alert._id} style={{
                  borderRadius: '12px', padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: t.card,
                  border: dark ? '1px solid rgba(16,185,129,0.2)' : '1px solid #bbf7d0',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                      fontWeight: '600', textTransform: 'capitalize', width: 'fit-content',
                      background: dark ? 'rgba(16,185,129,0.2)' : '#dcfce7',
                      color: '#10b981',
                    }}>
                      {alert.mealType}
                    </span>
                    <span style={{ fontSize: '12px', color: t.muted }}>
                      {new Date(alert.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                      {alert.surplusQuantity} kg saved
                    </span>
                    <span style={{
                      background: dark ? 'rgba(16,185,129,0.2)' : '#dcfce7',
                      color: '#10b981', padding: '2px 10px',
                      borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                    }}>
                      Claimed ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    position: 'relative', overflow: 'hidden',
  },
  orb1: {
    position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
    top: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
    bottom: '-150px', right: '-150px', pointerEvents: 'none', zIndex: 0,
  },
  navbar: {
    padding: '14px 32px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', backdropFilter: 'blur(20px)',
    position: 'sticky', top: 0, zIndex: 100,
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
  ngoBadge: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
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
    padding: '32px', maxWidth: '1100px',
    margin: '0 auto', position: 'relative', zIndex: 1,
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px', marginBottom: '32px',
  },
  statCard: { borderRadius: '16px', padding: '22px', backdropFilter: 'blur(10px)' },
  emptyCard: { borderRadius: '16px', padding: '48px', textAlign: 'center' },
  alertGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  alertCard: { borderRadius: '16px', padding: '22px', backdropFilter: 'blur(10px)' },
  claimBtn: {
    width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #059669, #10b981)',
    color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(16,185,129,0.35)',
  },
};

export default NGODashboard;