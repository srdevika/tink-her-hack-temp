import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Home from './pages/Home';
import Track from './pages/Track';
import EmergencyContacts from './pages/EmergencyContacts';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous auth failed:", error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/track/:alertId" element={<Track />} />
          <Route path="/contacts" element={<EmergencyContacts user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

