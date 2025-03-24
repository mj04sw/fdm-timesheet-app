// index.js (backend)
const express = require('express');
const app = express();
const cors = require('cors');

// Use middleware
app.use(cors());
app.use(express.json());

// Hardcoded users (you can expand this later with a database)
const users = [
  { id: 1, email: 'test1@example.com', password: 'password1', name: 'Test User 1' },
  { id: 2, email: 'test2@example.com', password: 'password2', name: 'Test User 2' }
];

// Login route to authenticate users
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = users.find((u) => u.email === email);
  
  if (!user || user.password !== password) {
    // Invalid credentials
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Valid login, return user info and a fake token
  const token = `fake-token-${user.id}`;  // In real applications, use JWT tokens
  return res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

// Start the server
const PORT = 5174;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
