// Determine the backend base URL by replacing the frontend port with the
// backend port. This allows the setup to work both locally and in Docker.
const BACKEND_BASE = window.location.origin.replace(/:\d+$/, ':3000');

const listEl = document.getElementById('projects');
const formEl = document.getElementById('project-form');
const nameEl = document.getElementById('name');

// Render the project list to the page
async function loadProjects() {
  const response = await fetch(`${BACKEND_BASE}/api/projects`);
  const projects = await response.json();
  listEl.innerHTML = '';
  projects.forEach((p) => {
    const li = document.createElement('li');
    // Using textContent prevents injection of HTML and keeps the UI safe
    li.textContent = `${p.name} (priority: ${p.priority})`;
    listEl.appendChild(li);
  });
}

// Handle creation of new projects
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameEl.value.trim();
  if (!name) return; // Ignore empty submissions

  await fetch(`${BACKEND_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  nameEl.value = '';
  loadProjects();
});

// Initial load on page startup
loadProjects();

