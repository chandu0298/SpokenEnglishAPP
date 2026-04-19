import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserProfile, getMyProfile } from '../api/user';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true, 
  refreshProfile: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    try {
      const userProfile = await getMyProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('AuthContext: Failed to refresh profile:', error);
    }
  };

  useEffect(() => {
    // onAuthStateChanged is the source of truth for Firebase login state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Begin sync sequence
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Attempt to fetch profile from our backend
          const userProfile = await getMyProfile();
          setProfile(userProfile);
        } catch (err: any) {
          // 404 is expected for new users - profile will be created on first backend interaction
          if (err?.response?.status !== 404) {
            console.error('AuthContext: Profile fetch failed:', err);
          }
          // App continues normally - profile will sync on next interaction
        }
      } else {
        setProfile(null);
      }
      
      // Critical: Only stop loading once the full identity sync is attempted
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
