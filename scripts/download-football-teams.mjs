import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY?.trim();

if (!API_KEY) {
  console.error(
    'Falta la variable FOOTBALL_API_KEY con la clave de football-data.org.'
  );

  process.exit(1);
}

const COMPETITIONS = [
  {
    code: 'PD',
    fileName: 'la-liga-teams.json',
    name: 'LaLiga'
  },
  {
    code: 'CL',
    fileName: 'champions-league-teams.json',
    name: 'Champions League'
  }
];

async function getCompetitionTeams(competition) {
  const url =
    `${API_URL}/competitions/${competition.code}/teams`;

  console.log(
    `Descargando equipos de ${competition.name}...`
  );

  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY,
      Accept: 'application/json'
    }
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error descargando ${competition.name}: ` +
      `${response.status} ${response.statusText}\n` +
      bodyText
    );
  }

  const body = JSON.parse(bodyText);

  if (!Array.isArray(body.teams)) {
    throw new Error(
      `Respuesta inesperada para ${competition.name}`
    );
  }

  return body.teams;
}

function simplifyTeams(teams) {
  return teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: team.crest
    }))
    .sort((teamA, teamB) =>
      teamA.name.localeCompare(teamB.name, 'es', {
        sensitivity: 'base'
      })
    );
}

async function saveTeams(competition, teams) {
  const outputPath = resolve(
    `public/data/${competition.fileName}`
  );

  await mkdir(dirname(outputPath), {
    recursive: true
  });

  await writeFile(
    outputPath,
    JSON.stringify(teams, null, 2),
    'utf-8'
  );

  console.log(
    `${competition.name}: ${teams.length} equipos guardados`
  );

  console.log(outputPath);
}

async function downloadFootballTeams() {
  for (const competition of COMPETITIONS) {
    const apiTeams =
      await getCompetitionTeams(competition);

    const teams = simplifyTeams(apiTeams);

    await saveTeams(
      competition,
      teams
    );
  }

  console.log('Descarga de equipos finalizada.');
}

downloadFootballTeams().catch((error) => {
  console.error(
    'No se pudieron generar los JSON de equipos:'
  );

  console.error(error);

  process.exit(1);
});