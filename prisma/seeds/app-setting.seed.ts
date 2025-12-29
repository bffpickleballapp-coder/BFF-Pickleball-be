import { PrismaClient } from '@src/generated/prisma/client';

export const appSettingSeed = async (prisma: PrismaClient) => {
  const appSettingsSeed = await prisma.appSettings.create({
    data: {
      key: 'Diaflow_Token',
      description: '',
      value: {},
    },
  });
  console.log(appSettingsSeed);
};
