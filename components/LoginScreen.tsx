
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import TrophyIcon from './icons/TrophyIcon';

const LoginScreen: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Niepoprawny format adresu e-mail.');
          break;
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          setError('Nieprawidłowy e-mail lub hasło.');
          break;
        case 'auth/wrong-password':
          setError('Nieprawidłowe hasło.');
          break;
        case 'auth/email-already-in-use':
          setError('Ten adres e-mail jest już zajęty.');
          break;
        case 'auth/weak-password':
          setError('Hasło musi mieć co najmniej 6 znaków.');
          break;
        default:
          setError('Wystąpił błąd. Spróbuj ponownie.');
          break;
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <TrophyIcon className="w-16 h-16 mx-auto text-cyan-500 dark:text-cyan-400 mb-2" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">ADHD_Quest</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Zmień swoje zadania w przygodę!</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-6">
            {isLoginView ? 'Logowanie' : 'Rejestracja'}
          </h2>
          <form onSubmit={handleAuthAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-bold py-3 rounded-md transition"
            >
              {isLoading ? 'Przetwarzanie...' : (isLoginView ? 'Zaloguj się' : 'Zarejestruj się')}
            </button>
          </form>
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              {isLoginView ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;