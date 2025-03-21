import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="header">
      <div className="logo">FDM Timesheet</div>
      <nav>
        <ul className="navbar-buttons">
          <li><button className="navbar-btn"><Link to="/">Home</Link></button></li>
          <li><button className="navbar-btn"><Link to="/login">Login</Link></button></li>
          <li><button className="navbar-btn"><Link to="/timesheet">Timesheet</Link></button></li>
          <li><button className="navbar-btn"><Link to="/admin">Admin Panel</Link></button></li>
        </ul>
      </nav>
    </header>
  );
}
