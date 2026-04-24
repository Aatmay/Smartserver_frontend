import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    organization: '',
  });
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organization: formData.organization,
      });
      login(data.user, data.token);
      toast.success(`Welcome to SmartServe, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/ngo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      {dark && <div style={styles.orb1} />}
      {dark && <div style={styles.orb2} />}

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
          ? '0 25px 60px rgba(0,0,0,0.6)'
          : '0 25px 60px rgba(0,0,0,0.12)',
      }}>

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

        <h1 style={{ ...styles.title, color: t.titleColor }}>Join SmartServe</h1>
        <p style={{ ...styles.subtitle, color: t.muted }}>Create your account to get started</p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Full Name</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Organization</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>🏢</span>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Canteen / NGO name"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: t.muted }}>Email Address</label>
            <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
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

          {/* Role Selector */}
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: t.muted }}>Register as</label>
            <div style={styles.roleRow}>
              <div
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                style={{
                  ...styles.roleCard,
                  border: formData.role === 'admin'
                    ? '2px solid #7c3aed'
                    : `1.5px solid ${t.inputBorder}`,
                  background: formData.role === 'admin'
                    ? (dark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.08)')
                    : t.inputBg,
                }}
              >
                <span style={styles.roleIcon}>🏫</span>
                <span style={{ ...styles.roleLabel, color: t.text }}>Canteen Admin</span>
                <span style={{ ...styles.roleDesc, color: t.muted }}>Manage food logs & predictions</span>
              </div>
              <div
                onClick={() => setFormData({ ...formData, role: 'ngo' })}
                style={{
                  ...styles.roleCard,
                  border: formData.role === 'ngo'
                    ? '2px solid #10b981'
                    : `1.5px solid ${t.inputBorder}`,
                  background: formData.role === 'ngo'
                    ? (dark ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.08)')
                    : t.inputBg,
                }}
              >
                <span style={styles.roleIcon}>🤝</span>
                <span style={{ ...styles.roleLabel, color: t.text }}>NGO Partner</span>
                <span style={{ ...styles.roleDesc, color: t.muted }}>Claim surplus food alerts</span>
              </div>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Password</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Confirm Password</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  style={{ ...styles.input, color: t.text }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: formData.role === 'ngo'
                ? 'linear-gradient(135deg, #059669, #10b981)'
                : 'linear-gradient(135deg, #7c3aed, #db2777)',
              boxShadow: formData.role === 'ngo'
                ? '0 8px 25px rgba(16,185,129,0.45)'
                : '0 8px 25px rgba(124,58,237,0.45)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ ...styles.footerText, color: t.muted }}>
          Already have an account?{' '}
          <Link to="/login" style={{ ...styles.link, color: dark ? '#a78bfa' : '#7c3aed' }}>
            Sign in here
          </Link>
        </p>
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
    padding: '40px 16px',
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
    background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
    bottom: '-100px',
    right: '-100px',
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
    padding: '44px 40px',
    width: '100%',
    maxWidth: '580px',
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
  logoEmoji: { fontSize: '36px' },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '11px',
    padding: '0 14px',
  },
  inputIcon: {
    fontSize: '15px',
    marginRight: '10px',
    flexShrink: 0,
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    padding: '12px 0',
    width: '100%',
    fontFamily: 'inherit',
  },
  roleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  roleCard: {
    padding: '16px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  roleIcon: { fontSize: '28px', marginBottom: '4px' },
  roleLabel: {
    fontSize: '13px',
    fontWeight: '700',
  },
  roleDesc: {
    fontSize: '11px',
    lineHeight: 1.4,
  },
  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
    letterSpacing: '0.3px',
    transition: 'opacity 0.2s',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
  link: {
    fontWeight: '700',
    textDecoration: 'none',
  },
};

export default Signup;