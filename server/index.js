// filepath: c:\Users\Mathu\Documents\Software Engineering Group Project\FDM Timesheet App\fdm-timesheet-app\server\index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  { email: 'test1@example.com', password: 'password1', user: { name: 'Test User 1' }, token: 'token1' },
  { email: 'test2@example.com', password: 'password2', user: { name: 'Test User 2' }, token: 'token2' },
];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ user: user.user, token: user.token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(5173, () => {
  console.log('Server is running on http://localhost:5173');
});