const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for users and timesheets (for testing purposes)
let users = [
  { id: '1', email: 'test1@example.com', password: 'password1' },
  { id: '2', email: 'test2@example.com', password: 'password2' },
];

let timesheets = {}; // Store timesheets per user: { userId: [{...timesheet1}, {...timesheet2}] }

// Add a new timesheet for the authenticated user
app.post('/api/timesheet', (req, res) => {
  const { userId, dateRange } = req.body; // userId is sent with the request (you can get it from a JWT or session)
  
  // Create a new timesheet
  const newTimesheet = {
    id: uuidv4(),
    dateRange,
    entries: [],
    status: 'Draft',
    totalHours: 0,
  };

  if (!timesheets[userId]) {
    timesheets[userId] = [];
  }
  
  timesheets[userId].push(newTimesheet);
  
  res.status(201).json(newTimesheet);
});

// Get a user's timesheets
app.get('/api/timesheet/:userId', (req, res) => {
  const { userId } = req.params;
  const userTimesheets = timesheets[userId] || [];
  res.json(userTimesheets);
});

// Other endpoints (login, etc.) would go here...

const PORT = 5174;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
