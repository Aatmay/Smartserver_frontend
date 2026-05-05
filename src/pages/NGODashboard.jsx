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
    } finally { setLoading(false); }
  };

  const handleClaim = async (alertId) => {
    setClaimingId(alertId);
    try {
      await API.patch(`/alerts/${alertId}/claim`);
      toast.success('Alert claimed! Thank you for helping reduce food waste 🙏');
      fetchAlerts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim alert');
    } finally { setClaimingId(null); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  const t = dark ? themes.dark : themes.light;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, color: t.text, fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
        <p>Loading alerts...</p>
      </div>
    </div>
  );

  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const claimedAlerts = alerts.filter(
    a => a.status === 'claimed' && String(a.claimedBy?._id) === String(user?.id)
  );

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={{ position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.12) 0%, transparent 70%)', top: '-200px', left: '-200px', pointerEvents: 'none', zIndex: 0 }} />}

      {/* Navbar */}
      <nav style={{ ...styles.navbar, background: t.navbar, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '26px' }}>🍱</span>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '800', color: t.accent }}>SmartServe</span>
            <span style={{ fontSize: '14px', color: t.muted }}> NGO Portal</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setDark(!dark)} style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <div style={{ ...styles.userChip, background: t.card, border: `1px solid ${t.border}` }}>
            <span>🤝</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>{user?.name}</span>
            <span style={styles.ngoBadge}>NGO</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Welcome Banner */}
        <div style={{ ...styles.welcomeBanner, background: t.banner }}>
          <div>
            <h2 style={styles.welcomeTitle}>NGO Dashboard 🤝</h2>
            <p style={styles.welcomeSub}>Claim surplus food and make a difference today</p>
            {user?.location && (
              <p style={{ ...styles.welcomeSub, marginTop: '4px' }}>
                📍 {user.location} {user?.phone && `· 📞 ${user.phone}`}
              </p>
            )}
          </div>
          <div style={styles.bannerStats}>
            <div style={styles.bannerStat}>
              <span style={styles.bannerStatVal}>{pendingAlerts.length}</span>
              <span style={styles.bannerStatLabel}>Available</span>
            </div>
            <div style={styles.bannerStat}>
              <span style={styles.bannerStatVal}>{claimedAlerts.reduce((s, a) => s + a.surplusQuantity, 0)} kg</span>
              <span style={styles.bannerStatLabel}>You Saved</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: 'Available Alerts', value: pendingAlerts.length, icon: '🔔', color: '#F39C12', bg: dark ? 'rgba(243,156,18,0.1)' : '#FFFBEC' },
            { label: 'Claimed by You', value: claimedAlerts.length, icon: '✅', color: '#27AE60', bg: dark ? 'rgba(39,174,96,0.1)' : '#F0FFF4' },
            { label: 'Total Food Saved', value: `${claimedAlerts.reduce((s, a) => s + a.surplusQuantity, 0)} kg`, icon: '🌱', color: '#2ECC71', bg: dark ? 'rgba(46,204,113,0.1)' : '#ECFFF6' },
          ].map((stat, i) => (
            <div key={i} style={{ ...styles.statCard, background: t.card, border: `1px solid ${t.border}` }}>
              <div style={{ ...styles.statIconBox, background: stat.bg, color: stat.color }}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: t.text }}>{stat.value}</div>
              <div style={{ ...styles.statLabel, color: t.muted }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pending Alerts */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.text, margin: 0 }}>
              🔔 Pending Surplus Alerts
            </h3>
            <span style={{ background: '#F39C12', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
              {pendingAlerts.length}
            </span>
          </div>

          {pendingAlerts.length === 0 ? (
            <div style={{ ...styles.emptyCard, background: t.card, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>🌟</div>
              <p style={{ fontSize: '18px', fontWeight: '700', color: t.text, margin: '0 0 8px 0' }}>All Clear!</p>
              <p style={{ fontSize: '14px', color: t.muted, margin: 0 }}>No pending alerts right now. Check back later!</p>
            </div>
          ) : (
            <div style={styles.alertGrid}>
              {pendingAlerts.map((alert) => (
                <div key={alert._id} style={{ ...styles.alertCard, background: t.card, border: dark ? '1px solid rgba(243,156,18,0.35)' : '1px solid #FFE0B2', boxShadow: dark ? '0 4px 20px rgba(243,156,18,0.1)' : '0 2px 12px rgba(0,0,0,0.06)' }}>

                  {/* Card Header */}
                  <div style={styles.alertCardTop}>
                    <span style={{ ...styles.mealChip, background: dark ? 'rgba(243,156,18,0.2)' : '#FFF3E0', color: '#F39C12' }}>
                      {alert.mealType === 'breakfast' ? '🌅' : alert.mealType === 'lunch' ? '☀️' : '🌙'} {alert.mealType}
                    </span>
                    <span style={{ fontSize: '13px', color: t.muted }}>{new Date(alert.date).toLocaleDateString()}</span>
                  </div>

                  {/* Surplus Amount */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '48px', fontWeight: '800', color: '#E74C3C', lineHeight: 1 }}>
                      {alert.surplusQuantity} kg
                    </div>
                    <p style={{ fontSize: '13px', color: t.muted, margin: '4px 0 0 0' }}>surplus food available</p>
                  </div>

                  {/* Details Box */}
                  <div style={{ ...styles.detailsBox, background: t.inputBg, border: `1px solid ${t.border}` }}>
                    <div style={styles.detailRow}>
                      <span style={{ fontSize: '12px', color: t.muted }}>📊 Leftover %</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#E74C3C' }}>{alert.leftoverPercentage}%</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={{ fontSize: '12px', color: t.muted }}>🏫 Canteen</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>{alert.createdBy?.organization || 'Canteen'}</span>
                    </div>
                    {alert.createdBy?.location && (
                      <div style={styles.detailRow}>
                        <span style={{ fontSize: '12px', color: t.muted }}>📍 Location</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>{alert.createdBy.location}</span>
                      </div>
                    )}
                    {alert.createdBy?.phone && (
                      <div style={styles.detailRow}>
                        <span style={{ fontSize: '12px', color: t.muted }}>📞 Contact</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>{alert.createdBy.phone}</span>
                      </div>
                    )}
                    {alert.foodLog?.menuItems?.length > 0 && (
                      <div style={styles.detailRow}>
                        <span style={{ fontSize: '12px', color: t.muted }}>🍽️ Menu</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: t.text }}>{alert.foodLog.menuItems.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Claim Button */}
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
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: t.text, margin: 0 }}>✅ Your Claimed Alerts</h3>
              <span style={{ background: '#27AE60', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
                {claimedAlerts.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {claimedAlerts.map((alert) => (
                <div key={alert._id} style={{ ...styles.claimedItem, background: t.card, border: dark ? '1px solid rgba(39,174,96,0.25)' : '1px solid #A9EFC5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: dark ? 'rgba(39,174,96,0.15)' : '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {alert.mealType === 'breakfast' ? '🌅' : alert.mealType === 'lunch' ? '☀️' : '🌙'}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: t.text, textTransform: 'capitalize' }}>{alert.mealType}</div>
                      <div style={{ fontSize: '12px', color: t.muted }}>{new Date(alert.date).toLocaleDateString()}</div>
                      {alert.createdBy?.organization && (
                        <div style={{ fontSize: '12px', color: t.muted }}>🏫 {alert.createdBy.organization}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#27AE60' }}>{alert.surplusQuantity} kg saved</span>
                    <span style={{ background: dark ? 'rgba(39,174,96,0.2)' : '#DCFCE7', color: '#27AE60', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      ✓ Claimed
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
    bg: '#001A0A', navbar: 'rgba(0,26,10,0.9)', card: '#002A10',
    banner: 'linear-gradient(135deg, #27AE60, #1A8C45)',
    border: 'rgba(46,204,113,0.2)', inputBg: 'rgba(46,204,113,0.08)',
    text: '#F0FFF4', muted: 'rgba(240,255,244,0.5)', accent: '#4CD98A',
  },
  light: {
    bg: '#F0FFF4', navbar: 'rgba(255,255,255,0.95)', card: '#FFFFFF',
    banner: 'linear-gradient(135deg, #27AE60, #2ECC71)',
    border: '#A9EFC5', inputBg: '#F0FFF4', text: '#002A10',
    muted: '#3D7A55', accent: '#27AE60',
  },
};

const styles = {
  container: { minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  navbar: { padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 },
  navBtn: { padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  userChip: { display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '20px' },
  ngoBadge: { background: 'linear-gradient(135deg, #27AE60, #2ECC71)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  logoutBtn: { padding: '7px 18px', borderRadius: '20px', border: '1px solid rgba(231,76,60,0.4)', background: 'rgba(231,76,60,0.1)', color: '#E74C3C', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  content: { padding: '24px 32px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  welcomeBanner: { borderRadius: '20px', padding: '24px 28px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(39,174,96,0.3)' },
  welcomeTitle: { fontSize: '24px', fontWeight: '800', color: 'white', margin: '0 0 4px 0' },
  welcomeSub: { fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0, fontStyle: 'italic' },
  bannerStats: { display: 'flex', gap: '16px' },
  bannerStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px 20px' },
  bannerStatVal: { fontSize: '24px', fontWeight: '800', color: 'white' },
  bannerStatLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' },
  statIconBox: { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '12px' },
  statValue: { fontSize: '28px', fontWeight: '800', marginBottom: '4px' },
  statLabel: { fontSize: '12px', fontWeight: '500' },
  emptyCard: { borderRadius: '16px', padding: '48px', textAlign: 'center' },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  alertCard: { borderRadius: '16px', padding: '22px', backdropFilter: 'blur(10px)' },
  alertCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  mealChip: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  detailsBox: { borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '7px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  claimBtn: { width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #27AE60, #2ECC71)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(39,174,96,0.35)' },
  claimedItem: { borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

export default NGODashboard;