# op-dashboard

PM-Management OP Dashboard

Geschrieben wird ein OpenProject-Dashboard, das per API relevante Projektdaten abruft. Ziel ist, eine übersichtliche Strategie- und Managementansicht für Teams zu erhalten, auf deren Basis die weitere Portfolioplanung stattfindet.

## Entwicklung

Ein erster Express-Backend-Prototyp befindet sich im Ordner `backend`.

### Lokal starten

```bash
cd backend
npm install
npm start
```

### Tests

```bash
npm test
```

### Docker

Ein Dockerfile ist unter `backend/Dockerfile` vorhanden. Die Daten werden in einem persistierten Volume `backend-data` abgelegt.

```bash
docker build -t op-dashboard-backend backend
# oder mit docker compose
# docker compose up --build
```

