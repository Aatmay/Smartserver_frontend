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
  const [formData, setFormData] = useState({
    date: '', mealType: '', expectedAttendance: '',
  });

  useEffect(() => { fetchPredictions(); }, []);

  const fetchPredictions = async () => {
    try {
      const { data } = await API.get('/predictions');
      setPredictions(data.predictions);
    } catch (error) {
      toast.error('Failed to load predictions');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/predictions/generate', {
        ...formData,
        expectedAttendance: Number(formData.expectedAttendance),
      });
      setResult(data.prediction);
      fetchPredictions();
      toast.success('Prediction generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const confColor = (level) => {
    if (level === 'high') return '#10b981';
    if (level === 'medium') return '#f59e0b';
    return '#ef4444';
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
            Prediction Module 🔮
          </h2>
          <p style={{ color: t.muted, fontSize: '15px', margin: 0 }}>
  Predict food quantity required based on expected attendance
</p>
        </div>

        <div style={styles.grid}>
          {/* Form Card */}
          <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>
              Generate ML Prediction
            </h3>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                  <option value="" style={{ background: t.optionBg }}>Select meal</option>
                  <option value="breakfast" style={{ background: t.optionBg }}>🌅 Breakfast</option>
                  <option value="lunch" style={{ background: t.optionBg }}>☀️ Lunch</option>
                  <option value="dinner" style={{ background: t.optionBg }}>🌙 Dinner</option>
                </select>
              </div>
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
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '⏳ Generating...' : '🔮 Generate Prediction'}
              </button>
            </form>

            {/* ML Result Card */}
            {result && (
              <div style={{
                marginTop: '24px', padding: '20px', borderRadius: '14px',
                background: dark ? 'rgba(124,58,237,0.08)' : '#faf5ff',
                border: `1px solid ${dark ? 'rgba(124,58,237,0.3)' : '#d8b4fe'}`,
              }}>
                <p style={{ fontSize: '11px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.7px', margin: '0 0 6px 0' }}>
                  ML Predicted Quantity
                </p>
                <div style={{ fontSize: '52px', fontWeight: '800', color: '#7c3aed', lineHeight: 1, marginBottom: '16px' }}>
                  {result.predictedQuantity} kg
                </div>

                {/* ML Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '14px' }}>
                  {[
                    { label: 'Confidence', value: result.confidence, badge: true },
                    { label: 'R² Accuracy', value: `${((result.r2Score || 0) * 100).toFixed(1)}%` },
                    { label: 'Model', value: result.modelType || 'Random Forest' },
                    { label: 'Dataset Size', value: `${result.datasetSize || 5000} records` },
                    { label: 'MAE', value: `±${result.maeKg || 0} kg` },
                    { label: 'Algorithm', value: 'Random Forest' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '10px', borderRadius: '10px',
                      background: dark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                    }}>
                      <div style={{ fontSize: '10px', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                        {item.label}
                      </div>
                      {item.badge ? (
                        <span style={{
                          background: confColor(item.value),
                          color: 'white', padding: '3px 10px',
                          borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                          textTransform: 'uppercase',
                        }}>
                          {item.value}
                        </span>
                      ) : (
                        <div style={{ fontSize: '13px', fontWeight: '700', color: t.text }}>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Reason */}
                <div style={{
                  fontSize: '12px', color: t.muted,
                  background: dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                  padding: '10px 14px', borderRadius: '10px', lineHeight: 1.6,
                }}>
                  🤖 {result.reason}
                </div>
              </div>
            )}
          </div>

          {/* History Card */}
          <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: t.text, marginBottom: '20px' }}>
              Prediction History
            </h3>
            {predictions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔮</div>
                <p style={{ color: t.muted }}>No predictions yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {predictions.map((pred) => (
                  <div key={pred._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderRadius: '12px',
                    background: dark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    border: `1px solid ${t.border}`,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                        fontWeight: '600', textTransform: 'capitalize', width: 'fit-content',
                        background: dark ? 'rgba(124,58,237,0.2)' : '#ede9fe',
                        color: dark ? '#a78bfa' : '#7c3aed',
                      }}>
                        {pred.mealType}
                      </span>
                      <span style={{ fontSize: '12px', color: t.muted }}>
                        {new Date(pred.date).toLocaleDateString()}
                      </span>
                      {pred.r2Score && (
                        <span style={{ fontSize: '11px', color: t.muted }}>
                          R² {((pred.r2Score) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: t.text }}>
                        {pred.predictedQuantity} kg
                      </span>
                      <span style={{
                        background: confColor(pred.confidence),
                        color: 'white', padding: '2px 8px',
                        borderRadius: '20px', fontSize: '10px', fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
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
    position: 'relative', overflow: 'hidden',
  },
  orb1: {
    position: 'fixed', width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    top: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0,
  },
  orb2: {
    position: 'fixed', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%)',
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
    padding: '32px', maxWidth: '1100px',
    margin: '0 auto', position: 'relative', zIndex: 1,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  card: { borderRadius: '20px', padding: '28px', backdropFilter: 'blur(10px)' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  input: {
    padding: '13px 16px', borderRadius: '11px', fontSize: '15px',
    outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '14px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #10b981)',
    color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(124,58,237,0.35)',
  },
};

export default PredictionPage;