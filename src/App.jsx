import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Timesheet from './pages/Timesheet';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/NavBar';
import { AuthProvider } from './utils/AuthContext';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> {/* Navbar for navigation */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;