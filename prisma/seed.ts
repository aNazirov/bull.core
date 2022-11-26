import { PrismaClient } from '@prisma/client';
import MeiliSearch from 'meilisearch';
import { appConfiguration } from '../config/config';

interface JSONRoleType {
  id: number;
  title: string;
}

interface JSONUserType {
  id: number;
  name: string;
  email: string;
  roleId: number;
  password: string;
}

interface JSONStatuseType {
  title: string;
  data: [{ id: number; title: string }];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rolesJSON = require('./seed_data/roles.json') as JSONRoleType[];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const usersJSON = require('./seed_data/users.json') as JSONUserType[];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const statusesTypesJSON =
  require('./seed_data/statuses&types.json') as JSONStatuseType[];

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    rolesJSON.map(({ id, title }) =>
      prisma.role.create({ data: { id, title } }),
    ),
  );

  await Promise.all(
    usersJSON.map(({ name, email, roleId, password }) =>
      prisma.user.create({
        data: {
          name,
          contact: {
            create: {
              email,
            },
          },
          role: { connect: { id: roleId } },
          password,
        },
      }),
    ),
  );

  for (let i = 0; i < statusesTypesJSON.length; i++) {
    const statusOrType = statusesTypesJSON[i];

    await Promise.all(
      statusOrType.data.map(({ id, title }) =>
        prisma[statusOrType.title].create({
          data: {
            id,
            title,
          },
        }),
      ),
    );
  }

  const client = new MeiliSearch({
    host: appConfiguration().meili.host,
    apiKey: appConfiguration().meili.key,
  });

  const genresIndex = client.index('genres');
  const categoriesIndex = client.index('categories');
  const countriesIndex = client.index('counries');
  const producersIndex = client.index('producers');
  const actersIndex = client.index('acters');
  const moviesIndex = client.index('movies');

  // await genresIndex.deleteAllDocuments();
  // await categoriesIndex.deleteAllDocuments();
  // await countriesIndex.deleteAllDocuments();
  // await producersIndex.deleteAllDocuments();
  // await actersIndex.deleteAllDocuments();
  // await moviesIndex.deleteAllDocuments();

  await genresIndex.updateSettings({
    searchableAttributes: ['title'],
    filterableAttributes: ['id'],
  });

  await categoriesIndex.updateSettings({
    searchableAttributes: ['title'],
    filterableAttributes: ['id'],
  });

  await countriesIndex.updateSettings({
    searchableAttributes: ['title'],
    filterableAttributes: ['id'],
  });

  await producersIndex.updateSettings({
    searchableAttributes: ['name'],
    filterableAttributes: ['id'],
  });

  await actersIndex.updateSettings({
    searchableAttributes: ['name'],
    filterableAttributes: ['id'],
  });

  await moviesIndex.updateSettings({
    searchableAttributes: ['title'],
    filterableAttributes: ['year', 'genres', 'acters', 'countries'],
    sortableAttributes: ['id', 'title', 'imdb', 'rating', 'createdAt'],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
