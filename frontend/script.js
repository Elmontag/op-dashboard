const { useState, useEffect } = React;
const {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} = MaterialUI;

// Determine the backend base URL by replacing the frontend port with the
// backend port. This allows the setup to work both locally and in Docker.
const BACKEND_BASE = window.location.origin.replace(/:\d+$/, ':3000');

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  const loadProjects = async () => {
    const response = await fetch(`${BACKEND_BASE}/api/projects`);
    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return; // Ignore empty submissions

    await fetch(`${BACKEND_BASE}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });

    setName('');
    loadProjects();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        OpenProject Dashboard
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Projektname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Hinzufügen
        </Button>
      </form>
      <List>
        {projects.map((p) => (
          <ListItem key={p.id} divider>
            <ListItemText primary={`${p.name} (priority: ${p.priority})`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
