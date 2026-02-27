const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
  next();
});

// Recent Grand Slam winners (2010-2024) - representative data
const champions = [
  // Australian Open
  { year: 2010, tournament: "Australian Open", winner: "Roger Federer",     nationality: "Switzerland" },
  { year: 2011, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2012, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2013, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2014, tournament: "Australian Open", winner: "Stan Wawrinka",     nationality: "Switzerland" },
  { year: 2015, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2016, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2017, tournament: "Australian Open", winner: "Roger Federer",     nationality: "Switzerland" },
  { year: 2018, tournament: "Australian Open", winner: "Roger Federer",     nationality: "Switzerland" },
  { year: 2019, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2020, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2021, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2022, tournament: "Australian Open", winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2023, tournament: "Australian Open", winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2024, tournament: "Australian Open", winner: "Jannik Sinner",     nationality: "Italy" },
  // French Open
  { year: 2010, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2011, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2012, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2013, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2014, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2015, tournament: "French Open",     winner: "Stan Wawrinka",     nationality: "Switzerland" },
  { year: 2016, tournament: "French Open",     winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2017, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2018, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2019, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2020, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2021, tournament: "French Open",     winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2022, tournament: "French Open",     winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2023, tournament: "French Open",     winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2024, tournament: "French Open",     winner: "Carlos Alcaraz",    nationality: "Spain" },
  // Wimbledon
  { year: 2010, tournament: "Wimbledon",       winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2011, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2012, tournament: "Wimbledon",       winner: "Roger Federer",     nationality: "Switzerland" },
  { year: 2013, tournament: "Wimbledon",       winner: "Andy Murray",       nationality: "Great Britain" },
  { year: 2014, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2015, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2016, tournament: "Wimbledon",       winner: "Andy Murray",       nationality: "Great Britain" },
  { year: 2017, tournament: "Wimbledon",       winner: "Roger Federer",     nationality: "Switzerland" },
  { year: 2018, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2019, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2021, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2022, tournament: "Wimbledon",       winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2023, tournament: "Wimbledon",       winner: "Carlos Alcaraz",    nationality: "Spain" },
  { year: 2024, tournament: "Wimbledon",       winner: "Carlos Alcaraz",    nationality: "Spain" },
  // US Open
  { year: 2010, tournament: "US Open",         winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2011, tournament: "US Open",         winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2012, tournament: "US Open",         winner: "Andy Murray",       nationality: "Great Britain" },
  { year: 2013, tournament: "US Open",         winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2014, tournament: "US Open",         winner: "Marin Čilić",       nationality: "Croatia" },
  { year: 2015, tournament: "US Open",         winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2016, tournament: "US Open",         winner: "Stan Wawrinka",     nationality: "Switzerland" },
  { year: 2017, tournament: "US Open",         winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2018, tournament: "US Open",         winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2019, tournament: "US Open",         winner: "Rafael Nadal",      nationality: "Spain" },
  { year: 2020, tournament: "US Open",         winner: "Dominic Thiem",     nationality: "Austria" },
  { year: 2021, tournament: "US Open",         winner: "Daniil Medvedev",   nationality: "Russia" },
  { year: 2022, tournament: "US Open",         winner: "Carlos Alcaraz",    nationality: "Spain" },
  { year: 2023, tournament: "US Open",         winner: "Novak Djokovic",    nationality: "Serbia" },
  { year: 2024, tournament: "US Open",         winner: "Jannik Sinner",     nationality: "Italy" },
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Tennis Grand Slam Champions API', timestamp: new Date().toISOString() }));

app.get('/champions', (req, res) => {
  const { winner, tournament, year } = req.query;
  let data = champions;
  if (winner)     data = data.filter(c => c.winner.toLowerCase().includes(winner.toLowerCase()));
  if (tournament) data = data.filter(c => c.tournament.toLowerCase().includes(tournament.toLowerCase()));
  if (year)       data = data.filter(c => c.year === parseInt(year));
  res.json(data);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Tennis Grand Slam Champions API running on port ${PORT}`);
});
