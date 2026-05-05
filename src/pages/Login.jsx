import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', formData);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/ngo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {/* Decorative food elements */}
      <div style={{ ...styles.blob1, background: t.blob1 }} />
      <div style={{ ...styles.blob2, background: t.blob2 }} />
      <div style={styles.decorLeft}>🌿</div>
      <div style={styles.decorRight}>🍃</div>

      {/* Theme Toggle */}
      <button onClick={() => setDark(!dark)} style={{ ...styles.themeBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
        {dark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={{ ...styles.wrapper }}>
        {/* Left Panel */}
        <div style={{ ...styles.leftPanel, background: t.leftPanel }}>
          <div style={styles.brandIcon}>🍱</div>
          <h1 style={styles.brandName}>SmartServe</h1>
          <p style={styles.brandTagline}>Predict. Prevent. Redistribute.</p>
          <div style={styles.statsRow}>
            {[
              { icon: '🌾', label: 'Food Saved', value: '500+ kg' },
              { icon: '🤝', label: 'NGOs Connected', value: '10+' },
              { icon: '📊', label: 'ML Accuracy', value: '94.3%' },
            ].map((s, i) => (
              <div key={i} style={styles.statItem}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={styles.foodIcons}>
            {['🥘', '🍛', '🥗', '🫓', '🍲'].map((f, i) => (
              <span key={i} style={{ ...styles.floatingFood, animationDelay: `${i * 0.5}s` }}>{f}</span>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{ ...styles.rightPanel, background: t.card }}>
          <div style={styles.formHeader}>
            <h2 style={{ ...styles.formTitle, color: t.text }}>Welcome Back</h2>
            <p style={{ color: t.muted, fontSize: '14px', marginTop: '4px' }}>
              Sign in to manage your canteen
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Email Address</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@canteen.com"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Password</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={{ ...styles.dividerLine, background: t.border }} />
            <span style={{ ...styles.dividerText, color: t.muted }}>New to SmartServe?</span>
            <span style={{ ...styles.dividerLine, background: t.border }} />
          </div>

          <Link to="/signup" style={{ ...styles.signupBtn, border: `1.5px solid ${t.border}`, color: t.text }}>
            Create Account
          </Link>

          <p style={{ ...styles.footNote, color: t.muted }}>
            🌱 Fighting food waste, one meal at a time
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#1A0A00',
    leftPanel: 'linear-gradient(145deg, #2D1200, #FF6B35)',
    card: '#2A1500',
    border: 'rgba(255,107,53,0.3)',
    inputBg: 'rgba(255,107,53,0.08)',
    inputBorder: 'rgba(255,107,53,0.25)',
    text: '#FFF8F0',
    muted: 'rgba(255,248,240,0.5)',
    blob1: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(46,204,113,0.15) 0%, transparent 70%)',
  },
  light: {
    bg: '#FFF8F0',
    leftPanel: 'linear-gradient(145deg, #FF6B35, #FF8C5A)',
    card: '#FFFFFF',
    border: '#FFD4B8',
    inputBg: '#FFF3EC',
    inputBorder: '#FFBA9A',
    text: '#2D1200',
    muted: '#8B5E3C',
    blob1: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(46,204,113,0.1) 0%, transparent 70%)',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  blob1: {
    position: 'fixed', width: '600px', height: '600px',
    borderRadius: '50%', top: '-200px', left: '-200px',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'fixed', width: '500px', height: '500px',
    borderRadius: '50%', bottom: '-200px', right: '-200px',
    pointerEvents: 'none',
  },
  decorLeft: {
    position: 'fixed', left: '20px', top: '50%',
    fontSize: '80px', opacity: 0.15, pointerEvents: 'none',
    transform: 'translateY(-50%) rotate(-20deg)',
  },
  decorRight: {
    position: 'fixed', right: '20px', top: '50%',
    fontSize: '80px', opacity: 0.15, pointerEvents: 'none',
    transform: 'translateY(-50%) rotate(20deg)',
  },
  themeBtn: {
    position: 'fixed', top: '20px', right: '20px',
    padding: '8px 18px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    zIndex: 100, backdropFilter: 'blur(10px)',
  },
  wrapper: {
    display: 'flex',
    borderRadius: '24px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '900px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    width: '45%',
    padding: '48px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  brandIcon: { fontSize: '64px', marginBottom: '16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' },
  brandName: {
    fontSize: '36px', fontWeight: '800', color: 'white',
    margin: '0 0 8px 0', textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  brandTagline: {
    fontSize: '14px', color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', marginBottom: '32px', fontStyle: 'italic',
  },
  statsRow: {
    display: 'flex', gap: '16px', marginBottom: '24px',
  },
  statItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
    borderRadius: '12px', padding: '12px 16px', gap: '4px',
  },
  statIcon: { fontSize: '20px' },
  statValue: { fontSize: '16px', fontWeight: '800', color: 'white' },
  statLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  foodIcons: {
    display: 'flex', gap: '12px', marginTop: '16px',
  },
  floatingFood: {
    fontSize: '24px',
    animation: 'float 3s ease-in-out infinite',
    display: 'inline-block',
  },
  rightPanel: {
    flex: 1, padding: '48px 40px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  formHeader: { marginBottom: '28px' },
  formTitle: { fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  inputWrapper: {
    display: 'flex', alignItems: 'center',
    borderRadius: '12px', padding: '0 16px',
  },
  inputIcon: { fontSize: '16px', marginRight: '10px', flexShrink: 0 },
  input: {
    background: 'transparent', border: 'none', outline: 'none',
    fontSize: '15px', padding: '14px 0', width: '100%', fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '15px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #FF6B35, #FF8C00)',
    color: 'white', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', marginTop: '6px',
    boxShadow: '0 8px 25px rgba(255,107,53,0.45)',
    letterSpacing: '0.3px',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 18px',
  },
  dividerLine: { flex: 1, height: '1px' },
  dividerText: { fontSize: '13px', whiteSpace: 'nowrap' },
  signupBtn: {
    display: 'block', textAlign: 'center', padding: '14px',
    borderRadius: '12px', fontSize: '15px', fontWeight: '600',
    textDecoration: 'none', background: 'transparent',
  },
  footNote: {
    textAlign: 'center', marginTop: '20px', fontSize: '12px', fontStyle: 'italic',
  },
};

export default Login;