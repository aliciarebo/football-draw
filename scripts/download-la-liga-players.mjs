import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API_URL = 'https://footballdata.io/api/v1/players';
const LEAGUE_ID = 10;
const LIMIT = 100;

const API_KEY = process.env.FOOTBALLDATA_API_KEY;

if (!API_KEY) {
  console.error(
    'Falta la variable FOOTBALLDATA_API_KEY con la clave de la API.'
  );

  process.exit(1);
}

async function getPlayersPage(page) {
  const url = new URL('https://footballdata.io/api/v1/players');

  url.searchParams.set('league_id', '10');
  url.searchParams.set('limit', '100');
  url.searchParams.set('page', page.toString());

  console.log('URL:', url.toString());
  console.log('Clave cargada:', Boolean(API_KEY));
  console.log('Longitud de la clave:', API_KEY?.length);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: 'application/json'
    },
    redirect: 'manual'
  });

  console.log('Status:', response.status);
  console.log('URL final:', response.url);
  console.log('Location:', response.headers.get('location'));

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error en la página ${page}: ${response.status} ${response.statusText}\n${bodyText}`
    );
  }

  const body = JSON.parse(bodyText);

  if (!body.success || !Array.isArray(body.data)) {
    throw new Error(`Respuesta inesperada en la página ${page}`);
  }

  return body;
}

async function downloadLaLigaPlayers() {
  console.log('Descargando la primera página...');

  const firstPage = await getPlayersPage(1);

  const totalPages = firstPage.meta.pagination.total_pages;

  let players = [...firstPage.data];

  console.log(
    `Página 1/${totalPages}: ${firstPage.data.length} jugadores`
  );

  for (let page = 2; page <= totalPages; page++) {
    console.log(`Descargando página ${page}/${totalPages}...`);

    const currentPage = await getPlayersPage(page);

    players = [...players, ...currentPage.data];

    console.log(
      `Página ${page}/${totalPages}: ${currentPage.data.length} jugadores`
    );
  }

  // Evitamos posibles duplicados por player_id.
  const uniquePlayers = Array.from(
    new Map(
      players.map((player) => [player.player_id, player])
    ).values()
  );

  // Los ordenamos por el nombre conocido o por player_name.
  uniquePlayers.sort((playerA, playerB) => {
    const nameA =
      playerA.known_name ?? playerA.player_name ?? '';

    const nameB =
      playerB.known_name ?? playerB.player_name ?? '';

    return nameA.localeCompare(nameB, 'es', {
      sensitivity: 'base'
    });
  });

  const outputPath = resolve(
    'public/data/la-liga-players.json'
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

downloadLaLigaPlayers().catch((error) => {
  console.error('No se pudo generar el JSON:');
  console.error(error);

  process.exit(1);
});