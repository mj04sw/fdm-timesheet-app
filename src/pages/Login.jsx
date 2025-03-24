import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null); 


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    setError(null);  
    try {
      const response = await fetch("http://localhost:5174/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        
        console.log("Login successful", user, token);
        login(user, token);
        navigate("/timesheet"); 
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-box">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={error ? 'error' : ''}
              />
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>




      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>


        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;