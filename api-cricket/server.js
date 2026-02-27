const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
  next();
});

const champions = [
  // ODI World Cup
  { year: 1975, winner: "West Indies",  format: "ODI World Cup",  venue: "England" },
  { year: 1979, winner: "West Indies",  format: "ODI World Cup",  venue: "England" },
  { year: 1983, winner: "India",        format: "ODI World Cup",  venue: "England" },
  { year: 1987, winner: "Australia",    format: "ODI World Cup",  venue: "India & Pakistan" },
  { year: 1992, winner: "Pakistan",     format: "ODI World Cup",  venue: "Australia & NZ" },
  { year: 1996, winner: "Sri Lanka",    format: "ODI World Cup",  venue: "Asia" },
  { year: 1999, winner: "Australia",    format: "ODI World Cup",  venue: "England" },
  { year: 2003, winner: "Australia",    format: "ODI World Cup",  venue: "South Africa" },
  { year: 2007, winner: "Australia",    format: "ODI World Cup",  venue: "West Indies" },
  { year: 2011, winner: "India",        format: "ODI World Cup",  venue: "Asia" },
  { year: 2015, winner: "Australia",    format: "ODI World Cup",  venue: "Australia & NZ" },
  { year: 2019, winner: "England",      format: "ODI World Cup",  venue: "England" },
  { year: 2023, winner: "Australia",    format: "ODI World Cup",  venue: "India" },
  // T20 World Cup
  { year: 2007, winner: "India",        format: "T20 World Cup",  venue: "South Africa" },
  { year: 2009, winner: "Pakistan",     format: "T20 World Cup",  venue: "England" },
  { year: 2010, winner: "England",      format: "T20 World Cup",  venue: "West Indies" },
  { year: 2012, winner: "West Indies",  format: "T20 World Cup",  venue: "Sri Lanka" },
  { year: 2014, winner: "Sri Lanka",    format: "T20 World Cup",  venue: "Bangladesh" },
  { year: 2016, winner: "West Indies",  format: "T20 World Cup",  venue: "India" },
  { year: 2021, winner: "Australia",    format: "T20 World Cup",  venue: "UAE" },
  { year: 2022, winner: "England",      format: "T20 World Cup",  venue: "Australia" },
  { year: 2024, winner: "India",        format: "T20 World Cup",  venue: "West Indies & USA" },
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Cricket World Cup Champions API', timestamp: new Date().toISOString() }));

app.get('/champions', (req, res) => {
  const { winner, format } = req.query;
  let data = champions;
  if (winner) data = data.filter(c => c.winner.toLowerCase().includes(winner.toLowerCase()));
  if (format) data = data.filter(c => c.format.toLowerCase().includes(format.toLowerCase()));
  res.json(data);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Cricket World Cup Champions API running on port ${PORT}`);
});
