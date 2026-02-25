# API Orchestration Console — OpenShift Deployment

## Architecture

```
Namespace 1: api-frontend
└── api-orchestration-console (Node.js + HTML UI)
    │  Reads API URLs from ConfigMap / env vars
    │  Proxies browser calls → external APIs
    └──► Route: api-console.ocp.cloud.lab

Namespace 2: api-external
├── formula1-api   ──► Route: formual1-api.ocp.cloud.lab
├── football-api   ──► Route: football-api.ocp.cloud.lab
├── cricket-api    ──► Route: cricket-api.ocp.cloud.lab
└── tennis-api     ──► Route: tennis-api.ocp.cloud.lab
```

## Project Structure

```
ocp-project/
├── frontend/               # UI + proxy server (Namespace 1)
│   ├── server.js           # Express proxy + static server
│   ├── public/index.html   # API Orchestration Console UI
│   ├── package.json
│   └── Dockerfile
├── api-f1/                 # Formula 1 Champions API
├── api-football/           # Premier League Champions API
├── api-cricket/            # Cricket World Cup Champions API
├── api-tennis/             # Tennis Grand Slam Champions API
├── k8s/
│   ├── namespace1/
│   │   └── frontend.yaml          # Deployment, Service, Route, ConfigMap
│   └── namespace2/
│       ├── external-apis.yaml     # All 4 APIs: Deployment, Service, Route
│       └── networkpolicy.yaml     # Allow frontend NS → external APIs
└── build-and-deploy.sh
```

## Configuration

External API URLs are **never hardcoded** in the frontend application.
They are set via the `frontend-config` ConfigMap in `k8s/namespace1/frontend.yaml`:

```yaml
data:
  F1_API_URL:       "http://formual1-api.ocp.cloud.lab"
  FOOTBALL_API_URL: "http://football-api.ocp.cloud.lab"
  CRICKET_API_URL:  "http://cricket-api.ocp.cloud.lab"
  TENNIS_API_URL:   "http://tennis-api.ocp.cloud.lab"
```

To change any URL, edit the ConfigMap and roll the deployment:
```bash
oc edit configmap frontend-config -n api-frontend
oc rollout restart deployment/api-orchestration-console -n api-frontend
```

## Security

All pods run as **non-root, unprivileged**:
- `runAsNonRoot: true`
- `runAsUser: 1001`
- `allowPrivilegeEscalation: false`
- `capabilities.drop: ["ALL"]`
- OpenShift SCC: `restricted`

## Request Logging

Every incoming HTTP request is logged to stdout in the format:
```
[2024-01-15T10:23:45.123Z] GET /champions - IP: 10.0.0.1
```
Logs are accessible via:
```bash
oc logs -f deployment/api-orchestration-console -n api-frontend
oc logs -f deployment/formula1-api -n api-external
```

## API Endpoints

| Service | Endpoint | Description |
|---------|----------|-------------|
| All APIs | `GET /health` | Health check |
| Formula 1 | `GET /champions` | All F1 world champions |
| Formula 1 | `GET /champions/:year` | Champion for a specific year |
| Premier League | `GET /champions` | All PL champions |
| Cricket | `GET /champions` | All World Cup winners |
| Tennis | `GET /champions` | All Grand Slam winners |

All champions endpoints support query-string filters, e.g.:
- `?year=2023`
- `?driver=Hamilton` (F1)
- `?team=Liverpool` (Football)
- `?winner=India` (Cricket)
- `?tournament=Wimbledon` (Tennis)

## Deploy

```bash
# Set your registry
export REGISTRY=image-registry.openshift-image-registry.svc:5000
export TAG=latest

# Build, push and deploy everything
chmod +x build-and-deploy.sh
./build-and-deploy.sh
```
