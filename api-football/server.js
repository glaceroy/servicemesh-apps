const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
  next();
});

const champions = [
  { year: "1992-93", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "1993-94", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "1994-95", team: "Blackburn Rovers",   manager: "Kenny Dalglish" },
  { year: "1995-96", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "1996-97", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "1997-98", team: "Arsenal",            manager: "Arsène Wenger" },
  { year: "1998-99", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "1999-00", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2000-01", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2001-02", team: "Arsenal",            manager: "Arsène Wenger" },
  { year: "2002-03", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2003-04", team: "Arsenal",            manager: "Arsène Wenger" },
  { year: "2004-05", team: "Chelsea",            manager: "José Mourinho" },
  { year: "2005-06", team: "Chelsea",            manager: "José Mourinho" },
  { year: "2006-07", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2007-08", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2008-09", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2009-10", team: "Chelsea",            manager: "Carlo Ancelotti" },
  { year: "2010-11", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2011-12", team: "Manchester City",    manager: "Roberto Mancini" },
  { year: "2012-13", team: "Manchester United",  manager: "Alex Ferguson" },
  { year: "2013-14", team: "Manchester City",    manager: "Manuel Pellegrini" },
  { year: "2014-15", team: "Chelsea",            manager: "José Mourinho" },
  { year: "2015-16", team: "Leicester City",     manager: "Claudio Ranieri" },
  { year: "2016-17", team: "Chelsea",            manager: "Antonio Conte" },
  { year: "2017-18", team: "Manchester City",    manager: "Pep Guardiola" },
  { year: "2018-19", team: "Manchester City",    manager: "Pep Guardiola" },
  { year: "2019-20", team: "Liverpool",          manager: "Jürgen Klopp" },
  { year: "2020-21", team: "Manchester City",    manager: "Pep Guardiola" },
  { year: "2021-22", team: "Manchester City",    manager: "Pep Guardiola" },
  { year: "2022-23", team: "Manchester City",    manager: "Pep Guardiola" },
  { year: "2023-24", team: "Manchester City",    manager: "Pep Guardiola" },
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Premier League Champions API', timestamp: new Date().toISOString() }));

app.get('/champions', (req, res) => {
  const { team, manager } = req.query;
  let data = champions;
  if (team)    data = data.filter(c => c.team.toLowerCase().includes(team.toLowerCase()));
  if (manager) data = data.filter(c => c.manager.toLowerCase().includes(manager.toLowerCase()));
  res.json(data);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Premier League Champions API running on port ${PORT}`);
});
