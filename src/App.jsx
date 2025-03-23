import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Timesheet from './pages/Timesheet';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/NavBar';

// comment by milad for testing purposes.
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar for navigation */}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
