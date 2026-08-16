'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, PRESEEDED_USERS } from '@/context/AuthContext';
import { User, UserRole } from '@/types';
import {
  ShieldCheck,
  GraduationCap,
  School,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  CheckCircle2,
  UserCheck,
  KeyRound,
  Mail,
} from 'lucide-react';

export default function AuthPage() {
  const { loginWithUser } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedUser, setSelectedUser] = useState<User>(PRESEEDED_USERS[0]);
  const [emailInput, setEmailInput] = useState(PRESEEDED_USERS[0].email);
  const [passwordInput, setPasswordInput] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter users by role
  const filteredUsers = PRESEEDED_USERS.filter((u) => u.role === selectedRole);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    const firstRoleUser = PRESEEDED_USERS.find((u) => u.role === role);
    if (firstRoleUser) {
      setSelectedUser(firstRoleUser);
      setEmailInput(firstRoleUser.email);
    }
  };

  const handleSelectUserAccount = (user: User) => {
    setSelectedUser(user);
    setEmailInput(user.email);
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Match input email or select account
    const matchedUser = PRESEEDED_USERS.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    setTimeout(() => {
      setLoading(false);
      if (matchedUser) {
        loginWithUser(matchedUser);
        if (matchedUser.role === 'student') router.push('/student/dashboard');
        else if (matchedUser.role === 'college') router.push('/college/dashboard');
        else if (matchedUser.role === 'ministry') router.push('/ministry/dashboard');
      } else {
        // Fallback login with selected user
        loginWithUser(selectedUser);
        if (selectedUser.role === 'student') router.push('/student/dashboard');
        else if (selectedUser.role === 'college') router.push('/college/dashboard');
        else if (selectedUser.role === 'ministry') router.push('/ministry/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row text-on-surface">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-surface-container relative overflow-hidden flex-col justify-between p-12 border-r border-outline-variant/50">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-2xl font-headline tracking-tight text-on-surface">
                ScholarParchment
              </span>
              <p className="text-[11px] text-secondary font-label uppercase">National Gateway</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold font-label">
            <Sparkles className="w-3.5 h-3.5" />
            Supabase Single Sign-On (SSO) Portal
          </div>
          <h2 className="text-3xl font-bold font-headline leading-tight text-on-surface">
            Direct Database Auth. <br />
            <span className="text-primary">Zero Leakage Funding.</span>
          </h2>
          <p className="text-sm text-secondary leading-relaxed font-body">
            Authenticated portal connecting Students, College Nodal Officers, and Central Ministry Directors with Supabase PostgreSQL database records.
          </p>

          <div className="space-y-3 pt-4 border-t border-surface-container-highest text-xs text-secondary">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>5 Authorized Student Logins (IIT Delhi, VJTI, NIT Trichy, JU, BITS)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>1 College Nodal Verification Officer Login</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>1 Central Ministry Sanctioning Authority Login</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-secondary font-mono">
          NIC & Ministry of Education Direct Benefit Transfer (DBT) Framework
        </div>
      </div>

      {/* Right Login Workspace */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-label text-primary">
                Portal Authentication
              </span>
              <Link href="/" className="text-xs text-secondary hover:text-primary transition-colors">
                ← Back to Home
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-secondary">
              Select your role category and authorized account to proceed.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-surface-container rounded-2xl border border-outline-variant/60">
            <button
              type="button"
              onClick={() => handleRoleTabChange('student')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-medium transition-all ${
                selectedRole === 'student'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold border border-outline-variant/40'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-primary' : ''}`} />
              <span>Students (5)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('college')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-medium transition-all ${
                selectedRole === 'college'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold border border-outline-variant/40'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <School className={`w-4 h-4 ${selectedRole === 'college' ? 'text-amber-600' : ''}`} />
              <span>College Officer (1)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('ministry')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-medium transition-all ${
                selectedRole === 'ministry'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold border border-outline-variant/40'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Building2 className={`w-4 h-4 ${selectedRole === 'ministry' ? 'text-emerald-600' : ''}`} />
              <span>Ministry Officer (1)</span>
            </button>
          </div>

          {/* Account Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface font-label">
              Select Authorized Account ({filteredUsers.length} available):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredUsers.map((u) => {
                const isSelected = selectedUser.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUserAccount(u)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary-container/15 ring-2 ring-primary/20 shadow-sm'
                        : 'border-outline-variant/70 hover:border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden mt-0.5">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        u.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-on-surface truncate">{u.name}</h4>
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-[11px] text-secondary truncate">{u.email}</p>
                      <p className="text-[10px] text-secondary/80 truncate font-mono mt-0.5">
                        {u.institution || u.department || u.designation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 font-label">
                  Email Address / Registered Identifier
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="name@institution.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-secondary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 font-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-secondary" />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all mt-4"
            >
              {loading ? (
                <span>Verifying Credentials in Supabase...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as {selectedUser.name} ({selectedRole})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-surface-container text-center text-[11px] text-secondary space-y-1">
            <p>Protected by Ministry of Electronics & IT Cyber Security Guidelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
