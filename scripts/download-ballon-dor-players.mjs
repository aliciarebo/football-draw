import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API_URL = 'https://footballdata.io/api/v1';
const API_KEY = process.env.FOOTBALLDATA_API_KEY?.trim();

const TEAMS = [
  { id: 77, name: 'FC Barcelona' },
  { id: 78, name: 'Real Madrid CF' },
  { id: 109, name: 'Club Atletico de Madrid' },
  { id: 37, name: 'FC Bayern Munchen' },
  { id: 62, name: 'Paris Saint Germain FC' },
  { id: 57, name: 'Arsenal FC' },
  { id: 87, name: 'Manchester City FC' },
  { id: 135, name: 'Liverpool FC' }
];
const TEAM_ALIASES = {
  'paris saint germain fc': 'paris saint-germain fc'
};
const MANUAL_PLAYERS = [

  {
    name: 'Lamine Yamal',
    position: 'Forward',
    teamName: 'FC Barcelona'
  },
  {
    name: 'Rodri',
    position: 'Midfielder',
    teamName: 'FC Barcelona'
  },
  {
    name: 'Fermín López',
    position: 'Midfielder',
    teamName: 'FC Barcelona'
  },
  {
    name: 'Anthony Gordon',
    position: 'Forward',
    teamName: 'FC Barcelona'
  },
  {
    name: 'Karim Adeyemi',
    position: 'Forward',
    teamName: 'FC Barcelona'
  },
  {
    name: 'Kylian Mbappé',
    position: 'Forward',
    teamName: 'Real Madrid CF'
  },
  {
    name: 'Karim Adeyemi',
    position: 'Forward',
    teamName: 'Real Madrid CF'
  },
  {
    name: "Jude Bellingham",
    position: "Midfielder",
    teamName: 'Real Madrid CF'
  },
  {
    name: "Bernardo Silva",
    position: "Midfielder",
    teamName: 'Real Madrid CF'
  },
  {
    name: "Jérémy Doku",
    position: "Forward",
    teamName: 'Manchester City FC'
  },
  {
    name: "Erling Haaland",
    position: "Forward",
    teamName: 'Manchester City FC'
  },
  {
    name: "Omar Marmoush",
    position: "Forward",
    teamName: 'Manchester City FC'
  },
  {
    name: "Florian Wirtz",
    position: "Midfielder",
    teamName: 'Liverpool FC'
  },
  {
    name: "Cody Gakpo",
    position: "Forward",
    teamName: 'Liverpool FC'
  },
  {
    name: "Víctor Muñoz",
    position: "Forward",
    teamName: 'Liverpool FC'
  },
  {
    name: "Alexander Isak",
    position: "Forward",
    teamName: 'Liverpool FC'
  },
  {
    name: "Hugo Ekitiké",
    position: "Forward",
    teamName: 'Liverpool FC'
  },
  {
    name: "Luis Díaz",
    position: "Forward",
    teamName: 'FC Bayern Munchen'
  },
  {
    name: "Michael Olise",
    position: "Forward",
    teamName: 'FC Bayern Munchen'
  },
  {
    name: "Serge Gnabry",
    position: "Forward",
    teamName: 'FC Bayern Munchen'
  },
  {
    name: "Harry Kane",
    position: "Forward",
    teamName: 'FC Bayern Munchen'
  },
  {
    name: "Vitinha",
    position: "Midfielder",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "João Neves",
    position: "Midfielder",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "Khvicha Kvaratskhelia",
    position: "Forward",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "Bradley Barcola",
    position: "Forward",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "Désiré Doué",
    position: "Forward",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "Ousmane Dembélé",
    position: "Forward",
    teamName: 'Paris Saint Germain FC'
  },
  {
    name: "Declan Rice",
    position: "Midfielder",
    teamName: 'Arsenal FC'
  },
  {
    name: "Bukayo Saka",
    position: "Forward",
    teamName: 'Arsenal FC'
  },
  {
    name: "Noni Madueke",
    position: "Forward",
    teamName: 'Arsenal FC'
  }

];

if (!API_KEY) {
  console.error('Falta la variable FOOTBALLDATA_API_KEY');
  process.exit(1);
}

function normalizeText(value) {
  return value
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

async function getTeams() {
  const teamsPath = resolve(
    'public/data/teams.json'
  );

  const file = await readFile(
    teamsPath,
    'utf-8'
  );

  return JSON.parse(file);
}

function findTeam(teamName, teams) {
  let normalizedTeamName = normalizeText(teamName);

  normalizedTeamName =
    TEAM_ALIASES[normalizedTeamName] ??
    normalizedTeamName;

  return teams.find(team => {
    return (
      normalizeText(team.clubName) === normalizedTeamName ||
      normalizeText(team.shortName) === normalizedTeamName
    );
  });
}

async function getTeamPlayers(team) {
  const url = new URL(
    `${API_URL}/teams/${team.id}/players`
  );

  console.log(
    `Descargando plantilla de ${team.name}...`
  );

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json'
    }
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error en ${team.name}: ` +
      `${response.status} ${response.statusText}\n` +
      bodyText
    );
  }

  const body = JSON.parse(bodyText);

  if (
    !body.success ||
    !body.data ||
    !Array.isArray(body.data.players)
  ) {
    throw new Error(
      `Respuesta inesperada para ${team.name}`
    );
  }

  return body.data.players.map(player => ({
    playerId: player.player_id,
    name:
      player.known_name ??
      player.player_name,
    position:
      player.position ?? null,
    teamName:
      body.data.team.team_name
  }));
}

function normalizeApiPlayer(player, teams) {
  const team = findTeam(
    player.teamName,
    teams
  );

  if (!team) {
    console.warn(
      `No se encontró equipo para: ` +
      `${player.name} -> ${player.teamName}`
    );

    return null;
  }

  return {
    externalId: player.playerId,
    name: player.name,
    position: player.position,
    teamId: team.id
  };
}

function normalizeManualPlayer(player, teams) {
  const team = findTeam(
    player.teamName,
    teams
  );

  if (!team) {
    console.warn(
      `No se encontró equipo manual: ` +
      `${player.name} -> ${player.teamName}`
    );

    return null;
  }

  return {
    name: player.name,
    position:
      player.position ?? null,
    teamId: team.id
  };
}

async function downloadBallonDorPlayers() {
  const teams = await getTeams();

  let apiPlayers = [];

  for (const team of TEAMS) {
    const teamPlayers =
      await getTeamPlayers(team);

    console.log(
      `${team.name}: ${teamPlayers.length} jugadores`
    );

    apiPlayers = [
      ...apiPlayers,
      ...teamPlayers
    ];
  }

  const uniqueApiPlayers = Array.from(
    new Map(
      apiPlayers.map(player => [
        player.playerId,
        player
      ])
    ).values()
  );

  const normalizedApiPlayers =
    uniqueApiPlayers
      .map(player =>
        normalizeApiPlayer(
          player,
          teams
        )
      )
      .filter(Boolean);

  const normalizedManualPlayers =
    MANUAL_PLAYERS
      .map(player =>
        normalizeManualPlayer(
          player,
          teams
        )
      )
      .filter(Boolean);

  const allPlayers = [
    ...normalizedApiPlayers,
    ...normalizedManualPlayers
  ];

  const uniquePlayers = Array.from(
    new Map(
      allPlayers.map(player => [
        `${normalizeText(player.name)}-${player.teamId}`,
        player
      ])
    ).values()
  );

  uniquePlayers.sort(
    (playerA, playerB) =>
      playerA.name.localeCompare(
        playerB.name,
        'es',
        {
          sensitivity: 'base'
        }
      )
  );

  const finalPlayers =
    uniquePlayers.map(
      (player, index) => ({
        id: index + 1,
        name: player.name,
        position: player.position,
        teamId: player.teamId
      })
    );

  const outputPath = resolve(
    'public/data/ballon-dor-players.json'
  );

  await mkdir(
    dirname(outputPath),
    {
      recursive: true
    }
  );

  await writeFile(
    outputPath,
    JSON.stringify(
      finalPlayers,
      null,
      2
    ),
    'utf-8'
  );

  console.log(
    `Archivo creado con ${finalPlayers.length} jugadores:`
  );

  console.log(outputPath);
}

downloadBallonDorPlayers().catch(error => {
  console.error(
    'No se pudo generar el JSON:'
  );

  console.error(error);

  process.exit(1);
});