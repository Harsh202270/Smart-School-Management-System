/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/school';
import { storage } from '../services/storageService';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  badgeTitle: string;
  refId: string; // studentId or teacherId
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole, emailOrId: string, pass: string) => boolean;
  logout: () => void;
  quickSwitch: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('campusflow_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusflow_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusflow_auth_user');
    }
  }, [user]);

  const login = (selectedRole: UserRole, emailOrId: string, _pass: string): boolean => {
    if (selectedRole === 'student') {
      const student = storage.getStudents().find(
        s => s.id.toLowerCase() === emailOrId.toLowerCase() ||
             s.admissionNumber.toLowerCase() === emailOrId.toLowerCase() ||
             s.guardianEmail.toLowerCase() === emailOrId.toLowerCase() ||
             s.firstName.toLowerCase() === emailOrId.toLowerCase()
      ) || storage.getStudents()[0];

      const authUser: AuthUser = {
        id: student.id,
        name: student.fullName,
        role: 'student',
        email: student.guardianEmail,
        avatar: student.photoUrl,
        badgeTitle: `Class ${student.classId}-${student.section} • Roll #${student.rollNumber}`,
        refId: student.id
      };
      setUser(authUser);
      storage.logAction(authUser.name, 'Student', 'LOGIN', 'Auth', 'Student logged into portal');
      return true;
    }

    if (selectedRole === 'teacher') {
      const teacher = storage.getTeachers().find(
        t => t.id.toLowerCase() === emailOrId.toLowerCase() ||
             t.employeeCode.toLowerCase() === emailOrId.toLowerCase() ||
             t.email.toLowerCase() === emailOrId.toLowerCase() ||
             t.fullName.toLowerCase().includes(emailOrId.toLowerCase())
      ) || storage.getTeachers()[0];

      const authUser: AuthUser = {
        id: teacher.id,
        name: teacher.fullName,
        role: 'teacher',
        email: teacher.email,
        avatar: teacher.photoUrl,
        badgeTitle: teacher.designation,
        refId: teacher.id
      };
      setUser(authUser);
      storage.logAction(authUser.name, 'Teacher', 'LOGIN', 'Auth', 'Teacher logged into faculty portal');
      return true;
    }

    if (selectedRole === 'management') {
      const settings = storage.getSettings();
      const authUser: AuthUser = {
        id: 'ADMIN-01',
        name: settings.principalName,
        role: 'management',
        email: 'admin@riversidepublic.edu.in',
        avatar: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=240&auto=format&fit=crop&q=80',
        badgeTitle: 'Principal & Operations Director',
        refId: 'ADMIN-01'
      };
      setUser(authUser);
      storage.logAction(authUser.name, 'Management', 'LOGIN', 'Auth', 'Administrator opened management control center');
      return true;
    }

    return false;
  };

  const quickSwitch = (newRole: UserRole) => {
    if (newRole === 'student') {
      login('student', 'STU-2026-1042', 'password');
    } else if (newRole === 'teacher') {
      login('teacher', 'EMP-T-108', 'password');
    } else if (newRole === 'management') {
      login('management', 'admin@riversidepublic.edu.in', 'password');
    }
  };

  const logout = () => {
    if (user) {
      storage.logAction(user.name, user.role, 'LOGOUT', 'Auth', 'User logged out');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        logout,
        quickSwitch
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
