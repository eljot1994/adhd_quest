
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Profile, Theme } from './types';
import MainAppScreen from './components/MainAppScreen';
import LoginScreen from './components/LoginScreen';
import { getProfile, createProfile, updateProfile } from './services/firebaseService';
import { auth } from './firebaseConfig';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        let userProfile = await getProfile(firebaseUser.uid);
        if (!userProfile) {
          userProfile = await createProfile(firebaseUser.uid, firebaseUser.email || 'Nowy Gracz');
        }
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!profile) {
      document.body.classList.remove('dark');
    } else {
      if (profile.theme === Theme.Dark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, [profile]);


  const handleUpdateProfile = async (updatedProfile: Profile) => {
    if (user) {
        await updateProfile(user.uid, updatedProfile);
        setProfile(updatedProfile);
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">Wczytywanie...</p>
      </div>
    );
  }

  return (
    <div>
      {profile ? (
        <MainAppScreen 
            profile={profile} 
            onUpdateProfile={handleUpdateProfile} 
            onLogout={handleLogout}
        />
      ) : (
        <LoginScreen />
      )}
    </div>
  );
};

export default App;