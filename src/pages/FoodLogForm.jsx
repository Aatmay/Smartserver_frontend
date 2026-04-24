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
    date: '',
    mealType: '',
    menuItems: '',
    expectedAttendance: '',
    actualAttendance: '',
    foodPrepared: '',
    foodConsumed: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        menuItems: formData.menuItems.split(',').map((item) => item.trim()),
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
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAlert = async () => {
    if (!createdLog) return;
    setAlertLoading(true);
    try {
      const { data } = await API.post(`/alerts/check/${createdLog._id}`);
      if (data.alertCreated) {
        toast.success(data.message);
      } else {
        toast(data.message, { icon: 'ℹ️' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Alert check failed');
    } finally {
      setAlertLoading(false);
    }
  };

  const t = dark ? themes.dark : themes.light;

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
          <button
            onClick={() => navigate('/admin')}
            style={{ ...styles.navBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}
          >
            ← Back
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: t.text, margin: '0 0 6px 0' }}>
            Add Food Log
          </h2>
          <p style={{ color: t.muted, fontSize: '15px', margin: 0 }}>
            Record today's meal data — leftovers are calculated automatically
          </p>
        </div>

        <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Row 1 */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Meal Type</label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, background: t.selectBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                >
                  <option value="" style={{ background: t.optionBg, color: t.text }}>Select meal</option>
                  <option value="breakfast" style={{ background: t.optionBg, color: t.text }}>🌅 Breakfast</option>
                  <option value="lunch" style={{ background: t.optionBg, color: t.text }}>☀️ Lunch</option>
                  <option value="dinner" style={{ background: t.optionBg, color: t.text }}>🌙 Dinner</option>
                </select>
              </div>
            </div>

            {/* Menu Items */}
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>
                Menu Items <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(comma separated)</span>
              </label>
              <input
                type="text"
                name="menuItems"
                value={formData.menuItems}
                onChange={handleChange}
                placeholder="Dal Rice, Sabzi, Roti, Salad"
                required
                style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
              />
            </div>

            {/* Row 2 */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Expected Attendance</label>
                <input
                  type="number"
                  name="expectedAttendance"
                  value={formData.expectedAttendance}
                  onChange={handleChange}
                  placeholder="200"
                  required
                  min="1"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Actual Attendance</label>
                <input
                  type="number"
                  name="actualAttendance"
                  value={formData.actualAttendance}
                  onChange={handleChange}
                  placeholder="180"
                  required
                  min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Food Prepared (kg)</label>
                <input
                  type="number"
                  name="foodPrepared"
                  value={formData.foodPrepared}
                  onChange={handleChange}
                  placeholder="50"
                  required
                  min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Food Consumed (kg)</label>
                <input
                  type="number"
                  name="foodConsumed"
                  value={formData.foodConsumed}
                  onChange={handleChange}
                  placeholder="38"
                  required
                  min="0"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Saving...' : '💾 Save Food Log'}
            </button>
          </form>

          {/* Result Card */}
          {createdLog && (
            <div style={{
              ...styles.resultCard,
              background: dark ? 'rgba(16,185,129,0.07)' : '#f0fdf4',
              border: `1px solid ${dark ? 'rgba(16,185,129,0.3)' : '#86efac'}`,
            }}>
              <h3 style={{ color: '#10b981', fontSize: '17px', fontWeight: '700', marginBottom: '18px' }}>
                ✅ Log Created Successfully
              </h3>
              <div style={styles.resultGrid}>
                {[
                  { label: 'Food Prepared', value: `${createdLog.foodPrepared} kg`, color: t.text },
                  { label: 'Food Consumed', value: `${createdLog.foodConsumed} kg`, color: t.text },
                  { label: 'Leftover', value: `${createdLog.leftover} kg`, color: '#ef4444' },
                  {
                    label: 'Leftover %',
                    value: `${createdLog.leftoverPercentage}%`,
                    color: createdLog.leftoverPercentage > 20 ? '#ef4444' : '#10b981',
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCheckAlert}
                disabled={alertLoading}
                style={{ ...styles.alertBtn, opacity: alertLoading ? 0.7 : 1 }}
              >
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
    bg: '#0d0d14',
    navbar: 'rgba(13,13,20,0.85)',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.09)',
    inputBg: 'rgba(255,255,255,0.07)',
    inputBorder: 'rgba(255,255,255,0.12)',
    selectBg: '#1a1a2e',
    optionBg: '#1a1a2e',
    text: '#ffffff',
    muted: 'rgba(255,255,255,0.45)',
  },
  light: {
    bg: '#f0f2f8',
    navbar: 'rgba(255,255,255,0.92)',
    card: '#ffffff',
    border: '#e2e8f0',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1',
    selectBg: '#f8fafc',
    optionBg: '#ffffff',
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
    position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    top: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
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
  content: {
    padding: '32px', maxWidth: '800px',
    margin: '0 auto', position: 'relative', zIndex: 1,
  },
  card: {
    borderRadius: '20px', padding: '32px',
    backdropFilter: 'blur(10px)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: {
    fontSize: '11px', fontWeight: '700',
    letterSpacing: '0.8px', textTransform: 'uppercase',
  },
  input: {
    padding: '13px 16px', borderRadius: '11px',
    fontSize: '15px', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '14px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: 'white', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '6px',
    boxShadow: '0 8px 25px rgba(124,58,237,0.4)',
  },
  resultCard: {
    marginTop: '28px', padding: '24px', borderRadius: '16px',
  },
  resultGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px', marginBottom: '20px',
  },
  alertBtn: {
    width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: 'white', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 8px 20px rgba(245,158,11,0.35)',
  },
};

export default FoodLogForm;