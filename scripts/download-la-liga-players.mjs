import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API_URL = 'https://footballdata.io/api/v1/players';
const LEAGUE_ID = 10;
const LIMIT = 100;

const API_KEY = process.env.FOOTBALLDATA_API_KEY?.trim();

if (!API_KEY) {
  console.error(
    'Falta la variable FOOTBALLDATA_API_KEY con la clave de la API.'
  );

  process.exit(1);
}

const MANUAL_PLAYERS = [
  {
    name: 'Karim Adeyemi',
    position: 'Forward'
  },
  {
    name: 'Anthony Gordon',
    position: 'Forward'
  },
  {
    name: 'Rodri',
    position: 'Midfielder'
  },
  {
    name: 'Ibrahima Konaté',
    position: 'Defender'
  },
  {
    name: 'Marc Cucurella',
    position: 'Defender'
  },
  {
    name: 'Denzel Dumfries',
    position: 'Defender'
  },
  {
    name: 'Bernardo Silva',
    position: 'Midfielder'
  },
  {
    name: 'Yan Diomande',
    position: 'Forward'
  }
];

async function getPlayersPage(page) {
  const url = new URL(API_URL);

  url.searchParams.set(
    'league_id',
    LEAGUE_ID.toString()
  );

  url.searchParams.set(
    'limit',
    LIMIT.toString()
  );

  url.searchParams.set(
    'page',
    page.toString()
  );

  console.log(
    `Descargando página ${page}...`
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
      `Error en la página ${page}: ` +
      `${response.status} ${response.statusText}\n` +
      bodyText
    );
  }

  const body = JSON.parse(bodyText);

  if (
    !body.success ||
    !Array.isArray(body.data)
  ) {
    throw new Error(
      `Respuesta inesperada en la página ${page}`
    );
  }

  return body;
}

function normalizeText(value) {
  return value
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function normalizeApiPlayer(player) {
  return {
    name:
      player.known_name ??
      player.player_name,

    position:
      player.position ?? null
  };
}

function normalizeManualPlayer(player) {
  return {
    name: player.name,
    position: player.position ?? null
  };
}

async function downloadLaLigaPlayers() {
  console.log(
    'Descargando la primera página...'
  );

  const firstPage =
    await getPlayersPage(1);

  const totalPages =
    firstPage.meta.pagination.total_pages;

  let apiPlayers = [...firstPage.data];

  console.log(
    `Página 1/${totalPages}: ` +
    `${firstPage.data.length} jugadores`
  );

  for (
    let page = 2;
    page <= totalPages;
    page++
  ) {
    const currentPage =
      await getPlayersPage(page);

    apiPlayers = [
      ...apiPlayers,
      ...currentPage.data
    ];

    console.log(
      `Página ${page}/${totalPages}: ` +
      `${currentPage.data.length} jugadores`
    );
  }

  /*
   * Eliminamos posibles duplicados de la API
   * usando su player_id.
   */
  const uniqueApiPlayers = Array.from(
    new Map(
      apiPlayers.map(player => [
        player.player_id,
        player
      ])
    ).values()
  );

  /*
   * Convertimos los datos de la API
   * a nuestro formato.
   */
  const normalizedApiPlayers =
    uniqueApiPlayers.map(
      normalizeApiPlayer
    );

  /*
   * Normalizamos también los jugadores
   * añadidos manualmente.
   */
  const normalizedManualPlayers =
    MANUAL_PLAYERS.map(
      normalizeManualPlayer
    );

  /*
   * Juntamos API + jugadores manuales.
   */
  const allPlayers = [
    ...normalizedApiPlayers,
    ...normalizedManualPlayers
  ];

  /*
   * Eliminamos duplicados por nombre.
   */
  const uniquePlayers = Array.from(
    new Map(
      allPlayers.map(player => [
        normalizeText(player.name),
        player
      ])
    ).values()
  );

  /*
   * Ordenamos antes de asignar nuestros IDs.
   */
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

  /*
   * Asignamos nuestros propios IDs.
   */
  const finalPlayers =
    uniquePlayers.map(
      (player, index) => ({
        id: index + 1,
        name: player.name,
        position: player.position
      })
    );

  const outputPath = resolve(
    'public/data/la-liga-players.json'
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
    `Archivo creado con ` +
    `${finalPlayers.length} jugadores:`
  );

  console.log(outputPath);
}

downloadLaLigaPlayers().catch(
  error => {
    console.error(
      'No se pudo generar el JSON:'
    );

    console.error(error);

    process.exit(1);
  }
);