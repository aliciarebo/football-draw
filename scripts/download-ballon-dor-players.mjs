import { mkdir, writeFile } from 'node:fs/promises';
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

if (!API_KEY) {
  console.error('Falta la variable FOOTBALLDATA_API_KEY');
  process.exit(1);
}

async function getTeamPlayers(team) {
  const url = new URL(
    `${API_URL}/teams/${team.id}/players`
  );

  console.log(`Descargando plantilla de ${team.name}...`);

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
      `${response.status} ${response.statusText}\n${bodyText}`
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

  return body.data.players.map((player) => {
    return {
      player_id: player.player_id,
      player_name: player.player_name,
      known_name: player.known_name,
      nationality: player.nationality,
      position: player.position,
      player_image: player.player_image,
      team_id: body.data.team.team_id,
      team_name: body.data.team.team_name
    };
  });
}

async function downloadBallonDorPlayers() {
  let players = [];

  for (const team of TEAMS) {
    const teamPlayers = await getTeamPlayers(team);

    console.log(
      `${team.name}: ${teamPlayers.length} jugadores`
    );

    players = [...players, ...teamPlayers];
  }

  const uniquePlayers = Array.from(
    new Map(
      players.map((player) => [
        player.player_id,
        player
      ])
    ).values()
  );

  uniquePlayers.sort((playerA, playerB) => {
    return playerA.player_name.localeCompare(
      playerB.player_name,
      'es',
      { sensitivity: 'base' }
    );
  });

  const outputPath = resolve(
    'public/data/ballon-dor-players.json'
  );

  await mkdir(dirname(outputPath), {
    recursive: true
  });

  await writeFile(
    outputPath,
    JSON.stringify(uniquePlayers, null, 2),
    'utf-8'
  );

  console.log(
    `Archivo creado con ${uniquePlayers.length} jugadores:`
  );

  console.log(outputPath);
}

downloadBallonDorPlayers().catch((error) => {
  console.error('No se pudo generar el JSON:');
  console.error(error);

  process.exit(1);
});