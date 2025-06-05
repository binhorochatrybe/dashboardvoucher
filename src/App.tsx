import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth, database } from './firebaseConfig';
import { ref, get } from "firebase/database";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import DashboardInsights from './components/DashboardInsights';
import Footer from './components/Footer';

import './App.css';

function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userEmailFormatted = currentUser.email!.replace(/\./g, ',');
        const allowedUserRef = ref(database, `allowed_users/${userEmailFormatted}`);
        
        try {
          const snapshot = await get(allowedUserRef);
          if (snapshot.exists()) {
            setUser(currentUser);
            if (window.location.pathname !== '/dashboard') {
              navigate('/dashboard');
            }
          } else {
            alert("Acesso negado. Esta conta de e-mail não tem permissão.");
            await signOut(auth);
            setUser(null);
            navigate('/');
          }
        } catch (error) {
          alert("Acesso negado. Você não tem permissão para aceder a esta aplicação.");
          await signOut(auth);
          setUser(null);
          navigate('/');
        }
      } else {
        setUser(null);
        if (window.location.pathname !== '/') {
          navigate('/');
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loadingAuth) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Verificando permissões...</p>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <DashboardInsights /> : <LoginPage />} />
      <Route path="/dashboard" element={user ? <DashboardInsights /> : <LoginPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;