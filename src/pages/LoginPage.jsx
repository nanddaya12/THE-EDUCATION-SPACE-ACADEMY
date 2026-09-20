import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogoEmblem } from '../components/common/Logo';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  User,
  UserPlus,
  School,
  CheckCircle2
} from 'lucide-react';

export const LoginPage = () => {
  const { handleLogin, handleRegister, authError, authLoading, setCurrentView } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState('STUDENT');
  const [localError, setLocalError] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    handleLogin(email, password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (registerPassword !== registerConfirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    if (registerPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    await handleRegister({
      fullName: registerName,
      email: registerEmail,
      password: registerPassword,
      role: registerRole
    });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-white p-2.5 flex items-center justify-center shadow-lg border border-slate-200/80 transition-transform hover:scale-105">
            <LogoEmblem className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="font-display font-extrabold text-2xl text-on-surface tracking-tight">
              The Education <span className="text-primary">Space</span>
            </h1>
            <span className="text-[11px] font-bold tracking-widest text-primary uppercase block mt-1">
              ACADEMY MANAGEMENT PORTAL
            </span>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Create Account) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLocalError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setLocalError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-primary" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {(authError || localError) && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-semibold">{localError || authError}</div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. SIGN IN FORM                                                           */}
        {/* ========================================================================= */}
        {authMode === 'login' ? (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@educationspace.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-soft transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Institutional Security Notice */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Institutional Portal Access
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Authorized faculty, administrators, parents, and enrolled students should sign in using their issued credentials.
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentView('public-admissions')}
                  className="text-primary hover:text-primary-hover font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>New Student? Go to Online Admissions Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* 2. CREATE ACCOUNT / SIGN UP FORM                                          */
          /* ========================================================================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@edu.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Select Account Role
              </label>
              <select
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
                className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium bg-white"
              >
                <option value="STUDENT">🎓 Student (Access Learning Hub & Courses)</option>
                <option value="PARENT">👨‍👩‍👧 Parent / Guardian (Track Progress & Grades)</option>
                <option value="TEACHER">👩‍🏫 Teacher / Faculty (Manage Classes & Attendance)</option>
                <option value="ACCOUNTANT">💼 Accountant / Finance (Fee Management & Ledger)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-soft transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create My Account & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentView('website')}
            className="text-xs text-slate-500 hover:text-primary font-medium hover:underline inline-flex items-center gap-1 transition-colors"
          >
            ← Return to Public Academy Website
          </button>
        </div>
      </div>
    </div>
  );
};
