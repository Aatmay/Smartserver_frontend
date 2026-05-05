import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'admin', organization: '', phone: '', location: '',
  });
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!formData.name || !formData.email || !formData.organization) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        organization: formData.organization.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
      };
      console.log('Sending signup payload:', payload);
      const { data } = await API.post('/auth/signup', payload);
      login(data.user, data.token);
      toast.success(`Welcome to SmartServe, ${data.user.name}!`);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/ngo');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ ...styles.container, background: t.bg }}>
      <div style={{ ...styles.blob1, background: t.blob1 }} />
      <div style={{ ...styles.blob2, background: t.blob2 }} />

      <button onClick={() => setDark(!dark)} style={{ ...styles.themeBtn, background: t.card, border: `1px solid ${t.border}`, color: t.text }}>
        {dark ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={{ ...styles.card, background: t.card, border: `1px solid ${t.border}` }}>
        {/* Header Banner */}
        <div style={{ ...styles.headerBanner, background: t.banner }}>
          <span style={styles.bannerIcon}>🍱</span>
          <div>
            <h1 style={styles.bannerTitle}>SmartServe</h1>
            <p style={styles.bannerSub}>Join the food sustainability movement</p>
          </div>
          <div style={styles.bannerDecor}>🌿</div>
        </div>

        <div style={styles.formBody}>
          <h2 style={{ ...styles.formTitle, color: t.text }}>Create Your Account</h2>

          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Row 1: Name + Organization */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Full Name</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>👤</span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your full name" required style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Organization</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>🏢</span>
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange}
                    placeholder="Canteen / NGO name" required style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Email Address</label>
              <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                <span style={styles.icon}>✉️</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" required style={{ ...styles.input, color: t.text }} />
              </div>
            </div>

            {/* Row 2: Phone + Location */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Contact Number</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>📞</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+91 9876543210" style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Location / Area</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>📍</span>
                  <input type="text" name="location" value={formData.location} onChange={handleChange}
                    placeholder="Bandra, Mumbai" style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: t.muted }}>Register as</label>
              <div style={styles.roleRow}>
                <div onClick={() => setFormData({ ...formData, role: 'admin' })} style={{
                  ...styles.roleCard,
                  border: formData.role === 'admin' ? '2px solid #FF6B35' : `1.5px solid ${t.inputBorder}`,
                  background: formData.role === 'admin' ? (dark ? 'rgba(255,107,53,0.15)' : 'rgba(255,107,53,0.08)') : t.inputBg,
                }}>
                  <span style={styles.roleEmoji}>🏫</span>
                  <span style={{ ...styles.roleTitle, color: t.text }}>Canteen Admin</span>
                  <span style={{ ...styles.roleDesc, color: t.muted }}>Manage food logs & predictions</span>
                  {formData.role === 'admin' && <span style={styles.roleCheck}>✓</span>}
                </div>
                <div onClick={() => setFormData({ ...formData, role: 'ngo' })} style={{
                  ...styles.roleCard,
                  border: formData.role === 'ngo' ? '2px solid #2ECC71' : `1.5px solid ${t.inputBorder}`,
                  background: formData.role === 'ngo' ? (dark ? 'rgba(46,204,113,0.15)' : 'rgba(46,204,113,0.08)') : t.inputBg,
                }}>
                  <span style={styles.roleEmoji}>🤝</span>
                  <span style={{ ...styles.roleTitle, color: t.text }}>NGO Partner</span>
                  <span style={{ ...styles.roleDesc, color: t.muted }}>Claim surplus food alerts</span>
                  {formData.role === 'ngo' && <span style={{ ...styles.roleCheck, background: '#2ECC71' }}>✓</span>}
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Password</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>🔐</span>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="Min 6 characters" required style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={{ ...styles.label, color: t.muted }}>Confirm Password</label>
                <div style={{ ...styles.inputWrapper, background: t.inputBg, border: `1.5px solid ${t.inputBorder}` }}>
                  <span style={styles.icon}>🔐</span>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password" required style={{ ...styles.input, color: t.text }} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              ...styles.submitBtn,
              background: formData.role === 'ngo'
                ? 'linear-gradient(135deg, #27AE60, #2ECC71)'
                : 'linear-gradient(135deg, #FF6B35, #FF8C00)',
              boxShadow: formData.role === 'ngo'
                ? '0 8px 25px rgba(46,204,113,0.4)'
                : '0 8px 25px rgba(255,107,53,0.4)',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? '⏳ Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ ...styles.footerText, color: t.muted }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF6B35', fontWeight: '700', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const themes = {
  dark: {
    bg: '#1A0A00', card: '#2A1500',
    banner: 'linear-gradient(135deg, #FF6B35, #CC4400)',
    border: 'rgba(255,107,53,0.3)', inputBg: 'rgba(255,107,53,0.08)',
    inputBorder: 'rgba(255,107,53,0.25)',
    text: '#FFF8F0', muted: 'rgba(255,248,240,0.5)',
    blob1: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(46,204,113,0.15) 0%, transparent 70%)',
  },
  light: {
    bg: '#FFF8F0', card: '#FFFFFF',
    banner: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
    border: '#FFD4B8', inputBg: '#FFF3EC', inputBorder: '#FFBA9A',
    text: '#2D1200', muted: '#8B5E3C',
    blob1: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
    blob2: 'radial-gradient(circle, rgba(46,204,113,0.1) 0%, transparent 70%)',
  },
};

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: 'relative', overflow: 'hidden', padding: '40px 16px',
  },
  blob1: { position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', top: '-150px', left: '-150px', pointerEvents: 'none' },
  blob2: { position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', bottom: '-150px', right: '-150px', pointerEvents: 'none' },
  themeBtn: { position: 'fixed', top: '20px', right: '20px', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', zIndex: 100, backdropFilter: 'blur(10px)' },
  card: { borderRadius: '24px', width: '100%', maxWidth: '640px', overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 30px 80px rgba(0,0,0,0.35)' },
  headerBanner: { padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', overflow: 'hidden' },
  bannerIcon: { fontSize: '44px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' },
  bannerTitle: { fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 },
  bannerSub: { fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: '4px 0 0 0', fontStyle: 'italic' },
  bannerDecor: { fontSize: '60px', position: 'absolute', right: '20px', opacity: 0.3 },
  formBody: { padding: '24px 32px 32px' },
  formTitle: { fontSize: '22px', fontWeight: '800', margin: '0 0 18px 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase' },
  inputWrapper: { display: 'flex', alignItems: 'center', borderRadius: '11px', padding: '0 14px' },
  icon: { fontSize: '15px', marginRight: '10px', flexShrink: 0 },
  input: { background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', padding: '12px 0', width: '100%', fontFamily: 'inherit' },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  roleCard: { padding: '14px', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', transition: 'all 0.2s', position: 'relative' },
  roleEmoji: { fontSize: '26px', marginBottom: '4px' },
  roleTitle: { fontSize: '13px', fontWeight: '700' },
  roleDesc: { fontSize: '11px', lineHeight: 1.4 },
  roleCheck: { position: 'absolute', top: '8px', right: '8px', background: '#FF6B35', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' },
  submitBtn: { padding: '14px', borderRadius: '12px', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '4px', letterSpacing: '0.3px' },
  footerText: { textAlign: 'center', marginTop: '18px', fontSize: '14px' },
};

export default Signup;