import React from 'react';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/timesheet">Timesheet</a></li>
        <li><a href="/admin">Admin Panel</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;  {/* This is the correct export statement! */}
