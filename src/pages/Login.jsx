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
      {dark && <div style={styles.orb1} />}
      {dark && <div style={styles.orb2} />}
      {dark && <div style={styles.orb3} />}

      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          ...styles.themeBtn,
          background: t.card,
          border: `1px solid ${t.border}`,
          color: t.text,
        }}
      >
        {dark ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={{
        ...styles.card,
        background: t.card,
        border: `1px solid ${t.border}`,
        boxShadow: dark
          ? '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.1)'
          : '0 25px 60px rgba(0,0,0,0.12)',
      }}>

        {/* Logo */}
        <div style={styles.logoWrapper}>
          <div style={{
            ...styles.logoBg,
            background: dark
              ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))'
              : 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(219,39,119,0.1))',
          }}>
            <span style={styles.logoEmoji}>🍱</span>
          </div>
        </div>

        <h1 style={{ ...styles.title, color: t.titleColor }}>SmartServe</h1>
        <p style={{ ...styles.subtitle, color: t.muted }}>
          Predictive Food Demand System
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: t.muted }}>Email Address</label>
            <div style={{
              ...styles.inputWrapper,
              background: t.inputBg,
              border: `1.5px solid ${t.inputBorder}`,
            }}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{ ...styles.input, color: t.text }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: t.muted }}>Password</label>
            <div style={{
              ...styles.inputWrapper,
              background: t.inputBg,
              border: `1.5px solid ${t.inputBorder}`,
            }}>
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

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={{ ...styles.dividerLine, background: t.border }} />
          <span style={{ ...styles.dividerText, color: t.muted }}>New here?</span>
          <span style={{ ...styles.dividerLine, background: t.border }} />
        </div>

        <Link to="/signup" style={{
          ...styles.signupBtn,
          border: `1.5px solid ${t.border}`,
          color: t.text,
          background: 'transparent',
        }}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#0d0d14',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    inputBg: 'rgba(255,255,255,0.07)',
    inputBorder: 'rgba(255,255,255,0.12)',
    text: '#ffffff',
    titleColor: '#ffffff',
    muted: 'rgba(255,255,255,0.45)',
  },
  light: {
    bg: '#f0f2f8',
    card: '#ffffff',
    border: '#e2e8f0',
    inputBg: '#f8fafc',
    inputBorder: '#cbd5e1',
    text: '#1e293b',
    titleColor: '#1e293b',
    muted: '#64748b',
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
  },
  orb1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
    top: '-150px',
    left: '-150px',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(219,39,119,0.2) 0%, transparent 70%)',
    bottom: '-100px',
    right: '-100px',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
    top: '40%',
    right: '20%',
    pointerEvents: 'none',
  },
  themeBtn: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '8px 18px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  card: {
    backdropFilter: 'blur(24px)',
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logoBg: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: '36px',
  },
  title: {
    fontSize: '30px',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '36px',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    padding: '0 16px',
    transition: 'border 0.2s',
  },
  inputIcon: {
    fontSize: '16px',
    marginRight: '12px',
    flexShrink: 0,
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    padding: '14px 0',
    width: '100%',
    fontFamily: 'inherit',
  },
  button: {
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
    letterSpacing: '0.3px',
    boxShadow: '0 8px 25px rgba(124,58,237,0.45)',
    transition: 'opacity 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 18px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
  },
  dividerText: {
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  signupBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
};

export default Login;