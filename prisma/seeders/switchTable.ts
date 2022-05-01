import { Prisma, PrismaClient } from '@prisma/client';

const switchTableData: Prisma.SwitchTableCreateInput[] = [
  {
    datasetId: 'reporting_spr_class_roster',
    verInUse: 'A',
  },
  {
    datasetId: 'reporting_spr_perform_by_lo',
    verInUse: 'A',
  },
  {
    datasetId: 'reporting_spr_perform_by_score',
    verInUse: 'A',
  },
  {
    datasetId: 'reporting_spr_scheduled_classes',
    verInUse: 'A',
  },
];

export async function switchTableSeeder(prismaClient: PrismaClient) {
  /* eslint-disable-next-line no-console */
  console.log(`>> switch_table`);
  await prismaClient.switchTable.createMany({
    data: switchTableData,
    skipDuplicates: true,
  });
}
