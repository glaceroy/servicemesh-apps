const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
  next();
});

const champions = [
  { year: 1950, driver: "Nino Farina",        team: "Alfa Romeo" },
  { year: 1951, driver: "Juan Manuel Fangio", team: "Alfa Romeo" },
  { year: 1952, driver: "Alberto Ascari",     team: "Ferrari" },
  { year: 1953, driver: "Alberto Ascari",     team: "Ferrari" },
  { year: 1954, driver: "Juan Manuel Fangio", team: "Mercedes / Maserati" },
  { year: 1955, driver: "Juan Manuel Fangio", team: "Mercedes" },
  { year: 1956, driver: "Juan Manuel Fangio", team: "Ferrari" },
  { year: 1957, driver: "Juan Manuel Fangio", team: "Maserati" },
  { year: 1958, driver: "Mike Hawthorn",      team: "Ferrari" },
  { year: 1959, driver: "Jack Brabham",       team: "Cooper" },
  { year: 1960, driver: "Jack Brabham",       team: "Cooper" },
  { year: 1961, driver: "Phil Hill",          team: "Ferrari" },
  { year: 1962, driver: "Graham Hill",        team: "BRM" },
  { year: 1963, driver: "Jim Clark",          team: "Lotus" },
  { year: 1964, driver: "John Surtees",       team: "Ferrari" },
  { year: 1965, driver: "Jim Clark",          team: "Lotus" },
  { year: 1966, driver: "Jack Brabham",       team: "Brabham" },
  { year: 1967, driver: "Denny Hulme",        team: "Brabham" },
  { year: 1968, driver: "Graham Hill",        team: "Lotus" },
  { year: 1969, driver: "Jackie Stewart",     team: "Matra" },
  { year: 1970, driver: "Jochen Rindt",       team: "Lotus" },
  { year: 1971, driver: "Jackie Stewart",     team: "Tyrrell" },
  { year: 1972, driver: "Emerson Fittipaldi", team: "Lotus" },
  { year: 1973, driver: "Jackie Stewart",     team: "Tyrrell" },
  { year: 1974, driver: "Emerson Fittipaldi", team: "McLaren" },
  { year: 1975, driver: "Niki Lauda",         team: "Ferrari" },
  { year: 1976, driver: "James Hunt",         team: "McLaren" },
  { year: 1977, driver: "Niki Lauda",         team: "Ferrari" },
  { year: 1978, driver: "Mario Andretti",     team: "Lotus" },
  { year: 1979, driver: "Jody Scheckter",     team: "Ferrari" },
  { year: 1980, driver: "Alan Jones",         team: "Williams" },
  { year: 1981, driver: "Nelson Piquet",      team: "Brabham" },
  { year: 1982, driver: "Keke Rosberg",       team: "Williams" },
  { year: 1983, driver: "Nelson Piquet",      team: "Brabham" },
  { year: 1984, driver: "Niki Lauda",         team: "McLaren" },
  { year: 1985, driver: "Alain Prost",        team: "McLaren" },
  { year: 1986, driver: "Alain Prost",        team: "McLaren" },
  { year: 1987, driver: "Nelson Piquet",      team: "Williams" },
  { year: 1988, driver: "Ayrton Senna",       team: "McLaren" },
  { year: 1989, driver: "Alain Prost",        team: "McLaren" },
  { year: 1990, driver: "Ayrton Senna",       team: "McLaren" },
  { year: 1991, driver: "Ayrton Senna",       team: "McLaren" },
  { year: 1992, driver: "Nigel Mansell",      team: "Williams" },
  { year: 1993, driver: "Alain Prost",        team: "Williams" },
  { year: 1994, driver: "Michael Schumacher", team: "Benetton" },
  { year: 1995, driver: "Michael Schumacher", team: "Benetton" },
  { year: 1996, driver: "Damon Hill",         team: "Williams" },
  { year: 1997, driver: "Jacques Villeneuve", team: "Williams" },
  { year: 1998, driver: "Mika Häkkinen",      team: "McLaren" },
  { year: 1999, driver: "Mika Häkkinen",      team: "McLaren" },
  { year: 2000, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2001, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2002, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2003, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2004, driver: "Michael Schumacher", team: "Ferrari" },
  { year: 2005, driver: "Fernando Alonso",    team: "Renault" },
  { year: 2006, driver: "Fernando Alonso",    team: "Renault" },
  { year: 2007, driver: "Kimi Räikkönen",     team: "Ferrari" },
  { year: 2008, driver: "Lewis Hamilton",     team: "McLaren" },
  { year: 2009, driver: "Jenson Button",      team: "Brawn GP" },
  { year: 2010, driver: "Sebastian Vettel",   team: "Red Bull" },
  { year: 2011, driver: "Sebastian Vettel",   team: "Red Bull" },
  { year: 2012, driver: "Sebastian Vettel",   team: "Red Bull" },
  { year: 2013, driver: "Sebastian Vettel",   team: "Red Bull" },
  { year: 2014, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2015, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2016, driver: "Nico Rosberg",       team: "Mercedes" },
  { year: 2017, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2018, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2019, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2020, driver: "Lewis Hamilton",     team: "Mercedes" },
  { year: 2021, driver: "Max Verstappen",     team: "Red Bull" },
  { year: 2022, driver: "Max Verstappen",     team: "Red Bull" },
  { year: 2023, driver: "Max Verstappen",     team: "Red Bull" },
  { year: 2024, driver: "Max Verstappen",     team: "Red Bull" },
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Formula 1 Champions API', timestamp: new Date().toISOString() }));

app.get('/champions', (req, res) => {
  const { year, driver } = req.query;
  let data = champions;
  if (year)   data = data.filter(c => c.year === parseInt(year));
  if (driver) data = data.filter(c => c.driver.toLowerCase().includes(driver.toLowerCase()));
  res.json(data);
});

app.get('/champions/:year', (req, res) => {
  const record = champions.find(c => c.year === parseInt(req.params.year));
  if (!record) return res.status(404).json({ error: 'Year not found' });
  res.json(record);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Formula 1 Champions API running on port ${PORT}`);
});
