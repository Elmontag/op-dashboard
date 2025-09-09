const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');

// Create the express application
const app = express();
const PORT = process.env.PORT || 3000;

// Data directory and file locations
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure the data directory exists so we can persist project data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to read projects from disk in a safe way
function readProjects() {
  try {
    const raw = fs.readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    // If the file does not exist or is invalid, return an empty array
    return [];
  }
}

// Helper function to persist projects to disk
function writeProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// Security middleware and JSON body parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Return all known projects
app.get('/api/projects', (req, res) => {
  res.json(readProjects());
});

// Create a new project with minimal validation
app.post('/api/projects', (req, res) => {
  const { name, priority = 'normal', deadline = null, status = 'open' } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid project name' });
  }

  const projects = readProjects();
  const newProject = {
    id: Date.now(),
    name: name.trim(),
    priority,
    deadline,
    status,
  };

  projects.push(newProject);
  writeProjects(projects);

  res.status(201).json(newProject);
});

// Only start the server if this file is executed directly. This allows tests
// to import the app without creating multiple listeners.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export the app for testing purposes
module.exports = app;

