import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const FoodLogForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [createdLog, setCreatedLog] = useState(null);
  const [dark, setDark] = useState(true);
  const [formData, setFormData] = useState({
    date: '', mealType: '', menuItems: '',
    expectedAttendance: '', actualAttendance: '',
    foodPrepared: '', foodConsumed: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        menuItems: formData.menuItems.split(',').map(i => i.trim()),
        expectedAttendance: Number(formData.expectedAttendance),
        actualAttendance: Number(formData.actualAttendance),
        foodPrepared: Number(formData.foodPrepared),
        foodConsumed: Number(formData.foodConsumed),
      };
      const { data } = await API.post('/food-logs', payload);
      setCreatedLog(data.foodLog);
      toast.success('Food log created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create food log');
    } finally { setLoading(false); }
  };

  const handleCheckAlert = async () => {
    if (!createdLog) return;
    setAlertLoading(true);
    try {
      const { data } = await API.post(`/alerts/check/${createdLog._id}`);
      if (data.alertCreated) toast.success(data.message);
      else toast(data.message, { icon: 'ℹ️' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Alert check failed');
    } finally { setAlertLoading(false); }
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)', top: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0 }} />}

      {/* Navbar */}
      <nav style={{ ...styles.navbar, background: t.navbar, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '26px' }}>🍱</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: t.accent }}>SmartServe</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setDark(!dark)} style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => navigate('/admin')} style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
            ← Back
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Page Header */}
        <div style={{ ...styles.pageHeader, background: t.banner }}>
          <div>
            <h2 style={styles.pageTitle}>📝 Add Food Log</h2>
            <p style={styles.pageSub}>Record today's meal — leftover is auto-calculated</p>
          </div>
          <span style={{ fontSize: '50px', opacity: 0.4 }}>🥘</span>
        </div>

        <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Meal Type</label>
                <select name="mealType" value={formData.mealType} onChange={handleChange} required
                  style={{ ...styles.input, background: t.selectBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}>
                  <option value="">Select meal</option>
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Menu Items <span style={{ fontWeight: '400', textTransform: 'none' }}>(comma separated)</span></label>
              <input type="text" name="menuItems" value={formData.menuItems} onChange={handleChange}
                placeholder="Dal Rice, Sabzi, Roti, Salad" required
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
            </div>

            <div style={{ ...styles.sectionDivider, borderColor: t.border }}>
              <span style={{ ...styles.sectionLabel, color: t.muted, background: t.card }}>Attendance</span>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Expected Attendance</label>
                <input type="number" name="expectedAttendance" value={formData.expectedAttendance}
                  onChange={handleChange} placeholder="200" required min="1"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Actual Attendance</label>
                <input type="number" name="actualAttendance" value={formData.actualAttendance}
                  onChange={handleChange} placeholder="180" required min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
            </div>

            <div style={{ ...styles.sectionDivider, borderColor: t.border }}>
              <span style={{ ...styles.sectionLabel, color: t.muted, background: t.card }}>Food Quantity (kg)</span>
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>🍳 Food Prepared</label>
                <input type="number" name="foodPrepared" value={formData.foodPrepared}
                  onChange={handleChange} placeholder="50" required min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>🍽️ Food Consumed</label>
                <input type="number" name="foodConsumed" value={formData.foodConsumed}
                  onChange={handleChange} placeholder="38" required min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Saving...' : '💾 Save Food Log'}
            </button>
          </form>

          {/* Result Card */}
          {createdLog && (
            <div style={{ ...styles.resultCard, background: dark ? 'rgba(46,204,113,0.07)' : '#F0FFF4', border: `1px solid ${dark ? 'rgba(46,204,113,0.3)' : '#A9EFC5'}` }}>
              <div style={styles.resultHeader}>
                <span style={styles.resultIcon}>✅</span>
                <h3 style={{ color: '#27AE60', margin: 0, fontSize: '17px', fontWeight: '700' }}>Log Created Successfully</h3>
              </div>
              <div style={styles.resultGrid}>
                {[
                  { label: '🍳 Prepared', value: `${createdLog.foodPrepared} kg`, color: t.text },
                  { label: '🍽️ Consumed', value: `${createdLog.foodConsumed} kg`, color: t.text },
                  { label: '♻️ Leftover', value: `${createdLog.leftover} kg`, color: '#E74C3C' },
                  { label: '📊 Leftover %', value: `${createdLog.leftoverPercentage}%`, color: createdLog.leftoverPercentage > 20 ? '#E74C3C' : '#27AE60' },
                ].map((item, i) => (
                  <div key={i} style={{ ...styles.resultItem, background: dark ? 'rgba(255,255,255,0.05)' : '#F8F9FA' }}>
                    <div style={{ fontSize: '12px', color: t.muted, marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <button onClick={handleCheckAlert} disabled={alertLoading}
                style={{ ...styles.alertBtn, opacity: alertLoading ? 0.7 : 1 }}>
                {alertLoading ? '⏳ Checking...' : '🔔 Check & Trigger Surplus Alert'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#1A0A00', navbar: 'rgba(26,10,0,0.9)', card: '#2A1500',
    banner: 'linear-gradient(135deg, #FF6B35, #CC4400)',
    border: 'rgba(255,107,53,0.2)', inputBg: 'rgba(255,107,53,0.08)',
    inputBorder: 'rgba(255,107,53,0.25)', selectBg: '#2A1500',
    text: '#FFF8F0', muted: 'rgba(255,248,240,0.5)', accent: '#FF8C5A',
  },
  light: {
    bg: '#FFF8F0', navbar: 'rgba(255,255,255,0.95)', card: '#FFFFFF',
    banner: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
    border: '#FFD4B8', inputBg: '#FFF3EC', inputBorder: '#FFBA9A',
    selectBg: '#FFF3EC', text: '#2D1200', muted: '#8B5E3C', accent: '#FF6B35',
  },
};

const styles = {
  container: { minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  navbar: { padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 },
  navBtn: { padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  content: { padding: '24px 32px', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageHeader: { borderRadius: '20px', padding: '24px 28px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(255,107,53,0.3)' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 4px 0' },
  pageSub: { fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0, fontStyle: 'italic' },
  card: { borderRadius: '20px', padding: '28px', backdropFilter: 'blur(10px)' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  input: { padding: '13px 16px', borderRadius: '11px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  sectionDivider: { borderTop: '1px dashed', position: 'relative', margin: '4px 0' },
  sectionLabel: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', padding: '0 12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  submitBtn: { padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #FF6B35, #FF8C00)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255,107,53,0.4)', marginTop: '6px' },
  resultCard: { marginTop: '24px', padding: '22px', borderRadius: '16px' },
  resultHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  resultIcon: { fontSize: '24px' },
  resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' },
  resultItem: { padding: '12px', borderRadius: '10px', textAlign: 'center' },
  alertBtn: { width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #F39C12, #E67E22)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(243,156,18,0.35)' },
};

export default FoodLogForm;