const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// External API URLs from environment variables / configmap
const API_URLS = {
  f1:       process.env.F1_API_URL       || 'http://formual1-api.ocp.cloud.lab',
  football: process.env.FOOTBALL_API_URL || 'http://football-api.ocp.cloud.lab',
  cricket:  process.env.CRICKET_API_URL  || 'http://cricket-api.ocp.cloud.lab',
  tennis:   process.env.TENNIS_API_URL   || 'http://tennis-api.ocp.cloud.lab',
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Request logger middleware
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} - UA: ${req.headers['user-agent'] || '-'}`);
  next();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Config endpoint so frontend can discover API labels
app.get('/api/config', (req, res) => {
  res.json({
    apis: [
      { id: 'f1',       name: 'Formula 1 Champions',       url: '/api/proxy/f1' },
      { id: 'football', name: 'Premier League Champions',  url: '/api/proxy/football' },
      { id: 'cricket',  name: 'Cricket World Cup Champions',url: '/api/proxy/cricket' },
      { id: 'tennis',   name: 'Tennis Grand Slam Champions',url: '/api/proxy/tennis' },
    ]
  });
});

// Generic proxy handler
async function proxyRequest(apiKey, endpoint, req, res) {
  const baseUrl = API_URLS[apiKey];
  const targetUrl = `${baseUrl}${endpoint}`;
  const ts = new Date().toISOString();
  console.log(`[${ts}] PROXY → ${apiKey.toUpperCase()} | ${targetUrl}`);
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`[${ts}] PROXY ← ${apiKey.toUpperCase()} | status: ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response ? err.response.status : 503;
    const msg = err.response ? err.response.data : err.message;
    console.error(`[${ts}] PROXY ERROR ← ${apiKey.toUpperCase()} | status: ${status} | ${JSON.stringify(msg)}`);
    res.status(status).json({ error: true, message: msg || 'Upstream error', api: apiKey });
  }
}

app.all('/api/proxy/f1*',       (req, res) => proxyRequest('f1',       req.url.replace('/api/proxy/f1', '') || '/', req, res));
app.all('/api/proxy/football*', (req, res) => proxyRequest('football', req.url.replace('/api/proxy/football', '') || '/', req, res));
app.all('/api/proxy/cricket*',  (req, res) => proxyRequest('cricket',  req.url.replace('/api/proxy/cricket', '') || '/', req, res));
app.all('/api/proxy/tennis*',   (req, res) => proxyRequest('tennis',   req.url.replace('/api/proxy/tennis', '') || '/', req, res));

// Fallback to index
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] API Orchestration Console running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] External API endpoints:`);
  Object.entries(API_URLS).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
});
