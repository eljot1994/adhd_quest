// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { Profile, Theme } from "../types";
import {
  getProfile,
  createProfile,
  updateProfile as updateProfileInDb,
} from "../services/firebaseService";
import { auth } from "../firebaseConfig";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  updateProfile: (updatedProfile: Profile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
          userProfile = await createProfile(
            firebaseUser.uid,
            firebaseUser.email || "Nowy Gracz"
          );
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

  const updateProfile = (updatedProfile: Profile) => {
    if (user) {
      updateProfileInDb(user.uid, updatedProfile);
      setProfile(updatedProfile);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
