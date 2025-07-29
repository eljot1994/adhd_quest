// App.tsx
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainAppScreen from "./components/MainAppScreen";
import LoginScreen from "./components/LoginScreen";
import { useEffect } from "react";
import { Theme } from "./types";

const AppContent = () => {
  const { profile, isLoading } = useAuth();

  useEffect(() => {
    if (!profile) {
      document.body.classList.remove("dark");
    } else {
      if (profile.theme === Theme.Dark) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">Wczytywanie...</p>
      </div>
    );
  }

  return profile ? <MainAppScreen /> : <LoginScreen />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
