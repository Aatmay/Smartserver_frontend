import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const PredictionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [result, setResult] = useState(null);
  const [dark, setDark] = useState(true);
  const [formData, setFormData] = useState({ date: '', mealType: '', expectedAttendance: '' });

  useEffect(() => { fetchPredictions(); }, []);

  const fetchPredictions = async () => {
    try {
      const { data } = await API.get('/predictions');
      setPredictions(data.predictions);
    } catch (error) { toast.error('Failed to load predictions'); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/predictions/generate', {
        ...formData, expectedAttendance: Number(formData.expectedAttendance),
      });
      setResult(data.prediction);
      fetchPredictions();
      toast.success('Prediction generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally { setLoading(false); }
  };

  const confColor = (level) => {
    if (level === 'high') return '#27AE60';
    if (level === 'medium') return '#F39C12';
    return '#E74C3C';
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)', top: '-150px', right: '-150px', pointerEvents: 'none', zIndex: 0 }} />}

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
        {/* Header */}
        <div style={{ ...styles.pageHeader, background: t.banner }}>
          <div>
            <h2 style={styles.pageTitle}>🔮 ML Prediction Module</h2>
            <p style={styles.pageSub}>Random Forest · 5000 records · 94.3% R² accuracy</p>
          </div>
          <div style={styles.mlBadge}>
            <span style={styles.mlBadgeText}>AI Powered</span>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Form */}
          <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
            <h3 style={{ ...styles.cardTitle, color: t.text }}>Generate Prediction</h3>

            <form onSubmit={handleSubmit} style={styles.form}>
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
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Expected Attendance</label>
                <input type="number" name="expectedAttendance" value={formData.expectedAttendance}
                  onChange={handleChange} placeholder="200" required min="1"
                  style={{ ...styles.input, background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, color: t.text }} />
              </div>
              <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Generating...' : '🔮 Generate ML Prediction'}
              </button>
            </form>

            {/* Result */}
            {result && (
              <div style={{ ...styles.resultCard, background: dark ? 'rgba(155,89,182,0.08)' : '#F9F0FF', border: `1px solid ${dark ? 'rgba(155,89,182,0.3)' : '#D7B8F5'}` }}>
                <p style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.7px', margin: '0 0 6px 0' }}>
                  🎯 ML Predicted Quantity
                </p>
                <div style={{ fontSize: '56px', fontWeight: '800', color: '#9B59B6', lineHeight: 1, marginBottom: '4px' }}>
                  {result.predictedQuantity} kg
                </div>
                <p style={{ fontSize: '12px', color: t.muted, marginBottom: '16px', fontStyle: 'italic' }}>
                  Recommended food to prepare (includes 10% safety buffer)
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '14px' }}>
                  {[
                    { label: 'Confidence', value: result.confidence, badge: true },
                    { label: 'R² Accuracy', value: `${((result.r2Score || 0) * 100).toFixed(1)}%` },
                    { label: 'Model', value: 'Random Forest' },
                    { label: 'Dataset', value: `${result.datasetSize || 5000} records` },
                    { label: 'MAE', value: `±${result.maeKg || 0} kg` },
                    { label: 'Algorithm', value: 'Ensemble ML' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '10px', borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.05)' : '#F1F5F9' }}>
                      <div style={{ fontSize: '10px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>{item.label}</div>
                      {item.badge ? (
                        <span style={{ background: confColor(item.value), color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                          {item.value}
                        </span>
                      ) : (
                        <div style={{ fontSize: '13px', fontWeight: '700', color: t.text }}>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: t.muted, background: dark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', padding: '10px 14px', borderRadius: '10px', lineHeight: 1.6 }}>
                  🤖 {result.reason}
                </div>
              </div>
            )}
          </div>

          {/* History */}
          <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
            <h3 style={{ ...styles.cardTitle, color: t.text }}>📊 Prediction History</h3>
            {predictions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔮</div>
                <p style={{ color: t.muted }}>No predictions yet.</p>
                <p style={{ color: t.muted, fontSize: '13px' }}>Generate your first ML prediction!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {predictions.map((pred) => (
                  <div key={pred._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', background: dark ? 'rgba(255,107,53,0.06)' : '#FFF8F0', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', width: 'fit-content', background: dark ? 'rgba(255,107,53,0.2)' : '#FFE8DC', color: '#FF6B35' }}>
                        {pred.mealType === 'breakfast' ? '🌅' : pred.mealType === 'lunch' ? '☀️' : '🌙'} {pred.mealType}
                      </span>
                      <span style={{ fontSize: '12px', color: t.muted }}>{new Date(pred.date).toLocaleDateString()}</span>
                      {pred.r2Score && <span style={{ fontSize: '11px', color: t.muted }}>R² {((pred.r2Score) * 100).toFixed(1)}%</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#9B59B6' }}>{pred.predictedQuantity} kg</span>
                      <span style={{ background: confColor(pred.confidence), color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {pred.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#1A0A00', navbar: 'rgba(26,10,0,0.9)', card: '#2A1500',
    banner: 'linear-gradient(135deg, #9B59B6, #6C3483)',
    border: 'rgba(255,107,53,0.2)', inputBg: 'rgba(255,107,53,0.08)',
    inputBorder: 'rgba(255,107,53,0.25)', selectBg: '#2A1500',
    text: '#FFF8F0', muted: 'rgba(255,248,240,0.5)', accent: '#FF8C5A',
  },
  light: {
    bg: '#FFF8F0', navbar: 'rgba(255,255,255,0.95)', card: '#FFFFFF',
    banner: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
    border: '#FFD4B8', inputBg: '#FFF3EC', inputBorder: '#FFBA9A',
    selectBg: '#FFF3EC', text: '#2D1200', muted: '#8B5E3C', accent: '#FF6B35',
  },
};

const styles = {
  container: { minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden' },
  navbar: { padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 },
  navBtn: { padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  content: { padding: '24px 32px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageHeader: { borderRadius: '20px', padding: '24px 28px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 30px rgba(155,89,182,0.3)' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 4px 0' },
  pageSub: { fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0, fontStyle: 'italic' },
  mlBadge: { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.3)' },
  mlBadgeText: { color: 'white', fontSize: '13px', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { borderRadius: '20px', padding: '24px', backdropFilter: 'blur(10px)' },
  cardTitle: { fontSize: '17px', fontWeight: '700', marginBottom: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  input: { padding: '13px 16px', borderRadius: '11px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  submitBtn: { padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #9B59B6, #8E44AD)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(155,89,182,0.35)' },
  resultCard: { marginTop: '20px', padding: '20px', borderRadius: '14px' },
};

export default PredictionPage;