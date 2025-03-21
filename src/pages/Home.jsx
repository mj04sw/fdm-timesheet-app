export default function Home() {
    return (
      <div className="hero">
        <h1>Welcome to FDM Timesheet App</h1>
        <p>Dashboard and overview go here.</p>
        <div className="cta">
          {/* Make these links into buttons */}
          <button className="cta-btn" onClick={() => window.location.href = "/"}>Home</button>
          <button className="cta-btn" onClick={() => window.location.href = "/login"}>Login</button>
          <button className="cta-btn" onClick={() => window.location.href = "/timesheet"}>Timesheet</button>
          <button className="cta-btn" onClick={() => window.location.href = "/admin"}>Admin Panel</button>
        </div>
      </div>
    );
  }
  