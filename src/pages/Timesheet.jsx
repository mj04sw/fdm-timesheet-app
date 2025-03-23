import { useState, useEffect } from 'react';
import './Timesheet.css';

const Timesheet = () => {
  // State for the entire timesheet
  const [timesheet, setTimesheet] = useState({
    id: null,
    dateRange: {
      startDate: '',
      endDate: '',
    },
    entries: [],
    status: 'Draft', // Draft, Submitted, Approved
    totalHours: 0,
  });

  // State for current entry being edited
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    startTime: '',
    endTime: '',
    breakDuration: 0,
    project: '',
    notes: '',
    hours: 0,
  });

  // States for UI control
  const [isEditing, setIsEditing] = useState(false);
  const [entryIndex, setEntryIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [autoFillSuggestions, setAutoFillSuggestions] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock historical data for autofill suggestions - in a real app, this would come from API
  const historicalProjects = [
    { name: 'Web Development', recentNotes: ['API integration', 'Frontend fixes', 'Backend optimization'] },
    { name: 'Database Migration', recentNotes: ['Data validation', 'Schema update', 'Testing'] },
    { name: 'Client Meeting', recentNotes: ['Sprint planning', 'Demo', 'Requirements gathering'] },
    { name: 'DevOps', recentNotes: ['CI/CD pipeline', 'Deployment', 'Server maintenance'] },
  ];

  // Initialize a new timesheet
  const createTimesheet = (dateRange) => {
    // In a real app, this would make an API call
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const newTimesheet = {
        id: Date.now().toString(),
        dateRange,
        entries: [],
        status: 'Draft',
        totalHours: 0,
      };
      
      setTimesheet(newTimesheet);
      setIsLoading(false);
      showNotificationWithTimeout('Timesheet created successfully');
    }, 500);
  };

  // Calculate total hours from all entries
  const calculateTotalHours = (entries) => {
    return entries.reduce((total, entry) => total + entry.hours, 0);
  };

  // Calculate hours for a single entry
  const calculateHours = (startTime, endTime, breakDuration) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);
    
    // Calculate difference in milliseconds
    let diffMs = end - start;
    
    // Convert break from minutes to milliseconds and subtract
    diffMs -= breakDuration * 60 * 1000;
    
    // Convert to hours
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  // Handle date range selection
  const handleDateRangeChange = (event) => {
    const { name, value } = event.target;
    setTimesheet({
      ...timesheet,
      dateRange: {
        ...timesheet.dateRange,
        [name]: value,
      },
    });
  };

  // Generate autofill suggestions based on user input
  const generateAutoFillSuggestions = (field, value) => {
    if (field === 'project' && value.length > 0) {
      const suggestions = historicalProjects
        .filter(project => project.name.toLowerCase().includes(value.toLowerCase()))
        .map(project => project.name);
      
      setAutoFillSuggestions(suggestions);
    } else if (field === 'notes' && currentEntry.project && value.length > 0) {
      const project = historicalProjects.find(
        p => p.name.toLowerCase() === currentEntry.project.toLowerCase()
      );
      
      if (project) {
        const suggestions = project.recentNotes.filter(
          note => note.toLowerCase().includes(value.toLowerCase())
        );
        
        setAutoFillSuggestions(suggestions);
      }
    } else {
      setAutoFillSuggestions([]);
    }
  };

  // Select a suggestion from the autofill dropdown
  const selectSuggestion = (suggestion) => {
    if (autoFillSuggestions.length > 0) {
      if (currentEntry.notes === '') {
        setCurrentEntry({ ...currentEntry, project: suggestion });
      } else {
        setCurrentEntry({ ...currentEntry, notes: suggestion });
      }
      setAutoFillSuggestions([]);
    }
  };

  // Handle changes in the timesheet entry form
  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    const updatedEntry = { ...currentEntry, [name]: value };
    
    // Calculate hours whenever start time, end time, or break duration changes
    if (name === 'startTime' || name === 'endTime' || name === 'breakDuration') {
      const hours = calculateHours(
        name === 'startTime' ? value : currentEntry.startTime,
        name === 'endTime' ? value : currentEntry.endTime,
        name === 'breakDuration' ? parseInt(value) || 0 : currentEntry.breakDuration
      );
      
      updatedEntry.hours = hours;
    }
    
    // Generate autofill suggestions for project and notes fields
    if (name === 'project' || name === 'notes') {
      generateAutoFillSuggestions(name, value);
    }
    
    setCurrentEntry(updatedEntry);
    
    // Validate the updated entry
    validateEntry(updatedEntry);
  };

  // Validate timesheet entry
  const validateEntry = (entry) => {
    const newErrors = {};
    
    // Check for required fields
    if (!entry.startTime) newErrors.startTime = 'Start time is required';
    if (!entry.endTime) newErrors.endTime = 'End time is required';
    if (!entry.project) newErrors.project = 'Project name is required';
    
    // Check if end time is after start time
    if (entry.startTime && entry.endTime) {
      const start = new Date(`2023-01-01T${entry.startTime}`);
      const end = new Date(`2023-01-01T${entry.endTime}`);
      
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    // Check if break duration is valid
    if (entry.breakDuration < 0) {
      newErrors.breakDuration = 'Break duration cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add a new entry to the timesheet
  const addEntry = () => {
    if (!validateEntry(currentEntry)) return;
    
    const newEntry = {
      ...currentEntry,
      id: Date.now().toString(),
    };
    
    const updatedEntries = [...timesheet.entries, newEntry];
    const totalHours = calculateTotalHours(updatedEntries);
    
    setTimesheet({
      ...timesheet,
      entries: updatedEntries,
      totalHours,
    });
    
    // Reset current entry form
    setCurrentEntry({
      id: null,
      startTime: '',
      endTime: '',
      breakDuration: 0,
      project: '',
      notes: '',
      hours: 0,
    });
    
    setAutoFillSuggestions([]);
    showNotificationWithTimeout('Entry added successfully');
  };

  // Start editing an existing entry
  const editEntry = (index) => {
    if (timesheet.status !== 'Draft') {
      showNotificationWithTimeout('Cannot edit a submitted timesheet');
      return;
    }
    
    setCurrentEntry({ ...timesheet.entries[index] });
    setIsEditing(true);
    setEntryIndex(index);
  };

  // Update an existing entry
  const updateEntry = () => {
    if (!validateEntry(currentEntry)) return;
    
    const updatedEntries = [...timesheet.entries];
    updatedEntries[entryIndex] = currentEntry;
    
    const totalHours = calculateTotalHours(updatedEntries);
    
    setTimesheet({
      ...timesheet,
      entries: updatedEntries,
      totalHours,
    });
    
    // Reset editing state
    setIsEditing(false);
    setEntryIndex(null);
    setCurrentEntry({
      id: null,
      startTime: '',
      endTime: '',
      breakDuration: 0,
      project: '',
      notes: '',
      hours: 0,
    });
    
    setAutoFillSuggestions([]);
    showNotificationWithTimeout('Entry updated successfully');
  };

  // Delete an entry from the timesheet
  const deleteEntry = (index) => {
    if (timesheet.status !== 'Draft') {
      showNotificationWithTimeout('Cannot delete entries from a submitted timesheet');
      return;
    }
    
    const updatedEntries = timesheet.entries.filter((_, i) => i !== index);
    const totalHours = calculateTotalHours(updatedEntries);
    
    setTimesheet({
      ...timesheet,
      entries: updatedEntries,
      totalHours,
    });
    
    showNotificationWithTimeout('Entry deleted successfully');
  };

  // Submit the timesheet
  const submitTimesheet = () => {
    if (timesheet.entries.length === 0) {
      showNotificationWithTimeout('Cannot submit an empty timesheet');
      return;
    }
    
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setTimesheet({
        ...timesheet,
        status: 'Submitted',
      });
      
      setIsLoading(false);
      showNotificationWithTimeout('Timesheet submitted successfully');
    }, 1000);
  };

  // Show notification and auto-dismiss after a timeout
  const showNotificationWithTimeout = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Initialize new timesheet when date range is selected
  useEffect(() => {
    const { startDate, endDate } = timesheet.dateRange;
    if (startDate && endDate) {
      createTimesheet(timesheet.dateRange);
    }
  }, [timesheet.dateRange.startDate, timesheet.dateRange.endDate]);

  // Auto-save timesheet every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (timesheet.id && timesheet.status === 'Draft' && timesheet.entries.length > 0) {
        // In a real app, this would make an API call to save the current state
        console.log('Auto-saving timesheet...', timesheet);
        showNotificationWithTimeout('Timesheet auto-saved');
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [timesheet]);

  return (
    <div className="timesheet-container">
      <h1>Create/Edit Timesheet</h1>
      
      {/* Notification Component */}
      {showNotification && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
      
      {/* Date Selection */}
      <div className="date-selection">
        <h2>Select Date Range</h2>
        <div className="date-inputs">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={timesheet.dateRange.startDate}
              onChange={handleDateRangeChange}
              disabled={timesheet.status !== 'Draft' && timesheet.id !== null}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={timesheet.dateRange.endDate}
              onChange={handleDateRangeChange}
              disabled={timesheet.status !== 'Draft' && timesheet.id !== null}
            />
          </div>
        </div>
      </div>
      
      {/* Timesheet Status and Total Hours */}
      {timesheet.id && (
        <div className="timesheet-info">
          <div className="status-badge">
            Status: <span className={`status-${timesheet.status.toLowerCase()}`}>{timesheet.status}</span>
          </div>
          <div className="total-hours">
            Total Hours: <span>{timesheet.totalHours.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      {/* Entry Form */}
      {timesheet.id && timesheet.status === 'Draft' && (
        <div className="entry-form">
          <h2>{isEditing ? 'Edit Entry' : 'Add New Entry'}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={currentEntry.startTime}
                onChange={handleEntryChange}
                className={errors.startTime ? 'error' : ''}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={currentEntry.endTime}
                onChange={handleEntryChange}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="breakDuration">Break (minutes):</label>
              <input
                type="number"
                id="breakDuration"
                name="breakDuration"
                value={currentEntry.breakDuration}
                onChange={handleEntryChange}
                min="0"
                className={errors.breakDuration ? 'error' : ''}
              />
              {errors.breakDuration && <span className="error-message">{errors.breakDuration}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group project-group">
              <label htmlFor="project">Project:</label>
              <input
                type="text"
                id="project"
                name="project"
                value={currentEntry.project}
                onChange={handleEntryChange}
                className={errors.project ? 'error' : ''}
                aria-describedby="project-suggestions"
              />
              {errors.project && <span className="error-message">{errors.project}</span>}
              
              {/* Autofill suggestions for projects */}
              {autoFillSuggestions.length > 0 && currentEntry.notes === '' && (
                <ul className="autofill-suggestions" id="project-suggestions">
                  {autoFillSuggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      onClick={() => selectSuggestion(suggestion)}
                      tabIndex="0"
                      role="option"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="form-group notes-group">
              <label htmlFor="notes">Notes (optional):</label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={currentEntry.notes}
                onChange={handleEntryChange}
                aria-describedby="notes-suggestions"
              />
              
              {/* Autofill suggestions for notes */}
              {autoFillSuggestions.length > 0 && currentEntry.notes !== '' && (
                <ul className="autofill-suggestions" id="notes-suggestions">
                  {autoFillSuggestions.map((suggestion, index) => (
                    <li 
                      key={index} 
                      onClick={() => selectSuggestion(suggestion)}
                      tabIndex="0"
                      role="option"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="calculated-hours">
            Calculated Hours: <span>{currentEntry.hours.toFixed(2)}</span>
          </div>
          
          <div className="form-actions">
            {isEditing ? (
              <>
                <button className="btn update-btn" onClick={updateEntry}>Update Entry</button>
                <button className="btn cancel-btn" onClick={() => {
                  setIsEditing(false);
                  setEntryIndex(null);
                  setCurrentEntry({
                    id: null,
                    startTime: '',
                    endTime: '',
                    breakDuration: 0,
                    project: '',
                    notes: '',
                    hours: 0,
                  });
                  setErrors({});
                }}>Cancel</button>
              </>
            ) : (
              <button className="btn add-btn" onClick={addEntry}>Add Entry</button>
            )}
          </div>
        </div>
      )}
      
      {/* Entries List */}
      {timesheet.id && timesheet.entries.length > 0 && (
        <div className="entries-list">
          <h2>Timesheet Entries</h2>
          
          <table className="entries-table">
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Break (min)</th>
                <th>Project</th>
                <th>Notes</th>
                <th>Hours</th>
                {timesheet.status === 'Draft' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {timesheet.entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{entry.startTime}</td>
                  <td>{entry.endTime}</td>
                  <td>{entry.breakDuration}</td>
                  <td>{entry.project}</td>
                  <td>{entry.notes}</td>
                  <td>{entry.hours.toFixed(2)}</td>
                  {timesheet.status === 'Draft' && (
                    <td className="entry-actions">
                      <button 
                        className="btn edit-btn" 
                        onClick={() => editEntry(index)}
                        aria-label={`Edit entry for ${entry.project}`}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn delete-btn" 
                        onClick={() => deleteEntry(index)}
                        aria-label={`Delete entry for ${entry.project}`}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Submit Button */}
      {timesheet.id && timesheet.status === 'Draft' && (
        <div className="submit-section">
          <button 
            className="btn submit-btn" 
            onClick={submitTimesheet}
            disabled={timesheet.entries.length === 0 || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Timesheet'}
          </button>
          <p className="submit-note">
            Note: You won't be able to edit the timesheet after submission.
          </p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;