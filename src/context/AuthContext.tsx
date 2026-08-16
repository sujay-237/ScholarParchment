'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';

// 7 Pre-Seeded Authorized Database Accounts
export const PRESEEDED_USERS: User[] = [
  {
    id: 'STU-2026-8941',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@iitd.ac.in',
    role: 'student',
    studentId: '2022CSB1042',
    institution: 'Indian Institute of Technology Delhi',
    department: 'Computer Science & Engineering',
    aadhaarLast4: '8842',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'STU-2026-8942',
    name: 'Priya Patel',
    email: 'priya.patel@vjti.ac.in',
    role: 'student',
    studentId: '2023ECB2011',
    institution: 'Veermata Jijabai Technological Institute',
    department: 'Electronics & Communication Engineering',
    aadhaarLast4: '9102',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'STU-2026-8943',
    name: 'Rahul Verma',
    email: 'rahul.verma@nitt.edu',
    role: 'student',
    studentId: '2021MEB3055',
    institution: 'National Institute of Technology Tiruchirappalli',
    department: 'Mechanical Engineering',
    aadhaarLast4: '4431',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'STU-2026-8944',
    name: 'Ananya Sen',
    email: 'ananya.sen@ju.ac.in',
    role: 'student',
    studentId: '2024CSE1089',
    institution: 'Jadavpur University Kolkata',
    department: 'Computer Science & Technology',
    aadhaarLast4: '6120',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'STU-2026-8945',
    name: 'Vikram Singh',
    email: 'vikram.singh@bits.edu',
    role: 'student',
    studentId: '2022EEE4012',
    institution: 'BITS Pilani',
    department: 'Electrical & Electronics Engineering',
    aadhaarLast4: '3319',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'COL-OFF-109',
    name: 'Dr. Rajeshwari Menon',
    email: 'verifications@iitd.ac.in',
    role: 'college',
    institution: 'Indian Institute of Technology Delhi (AISHE: U-0100)',
    designation: 'Dean of Student Welfare & Nodal Verification Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'MIN-DIR-042',
    name: 'Shri Vikramaditya Roy, IAS',
    email: 'director.scholarships@education.gov.in',
    role: 'ministry',
    department: 'Department of Higher Education, Ministry of Education, Govt. of India',
    designation: 'Joint Secretary & Director General of Central Schemes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

interface AuthContextType {
  currentUser: User;
  activeRole: UserRole;
  allUsers: User[];
  isAuthenticated: boolean;
  login: (role: UserRole, userId?: string) => void;
  loginWithUser: (user: User) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(PRESEEDED_USERS[0]);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>(PRESEEDED_USERS);

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('sp_auth_user');
      if (savedUserStr) {
        const savedUser: User = JSON.parse(savedUserStr);
        setCurrentUser(savedUser);
        setActiveRole(savedUser.role);
        setIsAuthenticated(true);
      }
    } catch {
      // fallback default
    }

    // Attempt to sync user accounts from Supabase database
    async function loadUsersFromSupabase() {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (data && data.length > 0 && !error) {
          const dbUsers: User[] = data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role as UserRole,
            studentId: u.student_id,
            institution: u.institution,
            department: u.department,
            designation: u.designation,
            aadhaarLast4: u.aadhaar_last4,
            avatarUrl: u.avatar_url,
          }));
          setAllUsers(dbUsers);
        }
      } catch {
        // use preseeded fallbacks
      }
    }

    loadUsersFromSupabase();
  }, []);

  const loginWithUser = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('sp_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  };

  const login = (role: UserRole, userId?: string) => {
    let targetUser: User | undefined;
    if (userId) {
      targetUser = allUsers.find((u) => u.id === userId);
    }
    if (!targetUser) {
      targetUser = allUsers.find((u) => u.role === role) || PRESEEDED_USERS[0];
    }
    loginWithUser(targetUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('sp_auth_user');
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  };

  const setRole = (role: UserRole) => {
    if (role === 'guest') {
      logout();
    } else {
      login(role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        allUsers,
        isAuthenticated,
        login,
        loginWithUser,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
