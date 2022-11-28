import { PrismaClient } from '@prisma/client';

interface JSONRoleType {
  id: number;
  title: string;
}

interface JSONUserType {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  password: string;
}

interface JSONStatusesType {
  title: string;
  data: [{ id: number; title: string }];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rolesJSON = require('./seed_data/roles.json') as JSONRoleType[];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const usersJSON = require('./seed_data/users.json') as JSONUserType[];

const statusesTypesJSON =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./seed_data/types&statuses.json') as JSONStatusesType[];

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    rolesJSON.map(({ id, title }) =>
      prisma.role.create({ data: { id, title } }),
    ),
  );

  await Promise.all(
    usersJSON.map(({ name, email, phone, roleId, password }) =>
      prisma.user.create({
        data: {
          name,
          email,
          phone,
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
