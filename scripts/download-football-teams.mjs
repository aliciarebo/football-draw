import {mkdir,readFile, writeFile} from 'node:fs/promises';

import {dirname,resolve} from 'node:path';


const API_URL ='https://api.football-data.org/v4';

const API_KEY =process.env.FOOTBALL_API_KEY?.trim();


if (!API_KEY) {
  console.error('Falta la variable FOOTBALL_API_KEY con la clave de football-data.org.');
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


function normalizeText(value) {
  return value
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}


async function getExistingTeams() {
  const path = resolve('public/data/teams.json');

  try {
    const file = await readFile(
      path,
      'utf-8'
    );

    return JSON.parse(file);
  } catch {
    return [];
  }
}


async function getCompetitionTeams(
  competition
) {
  const url = `${API_URL}/competitions/${competition.code}/teams`;

  console.log(`Descargando equipos de ${competition.name}...`);

  const response = await fetch(
    url,
    {
      headers: {
        'X-Auth-Token': API_KEY,
        Accept: 'application/json'
      }
    }
  );

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


function simplifyTeam(team) {
  return {
    externalId: team.id,
    clubName: team.name,
    shortName: team.shortName,
    image: team.crest
  };
}


async function saveTeams(
  competition,
  teams
) {
  const outputPath = resolve(
    `public/data/${competition.fileName}`
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
      teams,
      null,
      2
    ),
    'utf-8'
  );

  console.log(`${competition.name}: ${teams.length} equipos guardados`);

  console.log(outputPath);
}


async function downloadFootballTeams() {

  const existingTeams = await getExistingTeams();

  console.log(`Equipos existentes: ${existingTeams.length}`);


  const competitionsData = [];


  for (const competition of COMPETITIONS) {
    const apiTeams =
      await getCompetitionTeams(
        competition
      );

    const teams =
      apiTeams.map(
        simplifyTeam
      );

    competitionsData.push({
      competition,
      teams
    });
  }



  const allTeams = competitionsData.flatMap(
      competitionData =>
        competitionData.teams
    );


  const uniqueTeams = Array.from(
      new Map(
        allTeams.map(
          team => [
            team.externalId,
            team
          ]
        )
      ).values()
    );



  uniqueTeams.sort(
    (teamA, teamB) =>
      teamA.clubName.localeCompare(
        teamB.clubName,
        'es',
        {
          sensitivity: 'base'
        }
      )
  );



  const existingIds =
    new Map(
      existingTeams.map(
        team => [
          normalizeText(
            team.clubName
          ),
          team.id
        ]
      )
    );



  let nextId =
    existingTeams.length > 0
      ? Math.max(
          ...existingTeams.map(
            team => team.id
          )
        ) + 1
      : 1;



  const teamsWithIds =
    uniqueTeams.map(
      team => {

        const key =
          normalizeText(
            team.clubName
          );

        const existingId =
          existingIds.get(key);

        if (
          existingId !== undefined
        ) {
          return {
            id: existingId,
            externalId:
              team.externalId,
            clubName:
              team.clubName,
            shortName:
              team.shortName,
            image:
              team.image
          };
        }

        return {
          id: nextId++,
          externalId:
            team.externalId,
          clubName:
            team.clubName,
          shortName:
            team.shortName,
          image:
            team.image
        };
      }
    );



  const newTeams =
    teamsWithIds.filter(
      team =>
        !existingIds.has(
          normalizeText(
            team.clubName
          )
        )
    );


  console.log('');
  console.log(`Equipos anteriores: ${existingTeams.length}`);

  console.log(`Equipos actuales: ${teamsWithIds.length}`);

  console.log(`Equipos nuevos: ${newTeams.length}`);


  if ( newTeams.length > 0) {
    console.log('');
    console.log('Nuevos equipos:');

    for (const team of newTeams) {
      console.log(`- ${team.id}: ${team.clubName}`);
    }
  }


 
  const allFinalTeams =
    teamsWithIds.map(
      team => ({
        id: team.id,
        clubName:
          team.clubName,
        shortName:
          team.shortName,
        image:
          team.image
      })
    );


  const outputPath = resolve(
    'public/data/teams.json'
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
      allFinalTeams,
      null,
      2
    ),
    'utf-8'
  );



  const teamsByExternalId =
    new Map(
      teamsWithIds.map(
        team => [
          team.externalId,
          team
        ]
      )
    );



  for (const {
      competition,
      teams
    } of competitionsData
  ) {
    const competitionTeams =
      teams.map(
        team => {

          const finalTeam =
            teamsByExternalId.get(
              team.externalId
            );

          return {
            id:
              finalTeam.id,
            clubName:
              finalTeam.clubName,
            shortName:
              finalTeam.shortName,
            image:
              finalTeam.image
          };
        }
      );

    await saveTeams(
      competition,
      competitionTeams
    );
  }


  console.log('');
  console.log('Descarga de equipos finalizada.');
}


downloadFootballTeams()
  .catch(
    error => {
      console.error('No se pudieron generar los JSON de equipos:');

      console.error(error);

      process.exit(1);
    }
  );