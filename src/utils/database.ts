import { PrismaClient } from '@prisma/client';
import { ReportEntity } from 'src/types';

const prisma = new PrismaClient();

export const getVerInUse = async (reportEntity: ReportEntity): Promise<string> => {
  const datasetId = getDatasetId(reportEntity);

  try {
    const dataSet = await prisma.switchTable.findUnique({
      where: {
        datasetId: datasetId,
      },
    });

    if (!dataSet) throw new Error(`DatasetId ${datasetId} is invalid.`);

    return dataSet?.verInUse;
  } catch (error) {
    throw new Error(`Failed to get VerInUse with error ${error}.`);
  }
}

function getDatasetId(reportEntity: ReportEntity) {
  let datasetId = 'reporting_spr_perform_by_lo';
  switch (reportEntity) {
    case ReportEntity.CLASS:
      datasetId = 'reporting_spr_class_roster';
      break;

    case ReportEntity.SCHEDULE:
      datasetId = 'reporting_spr_scheduled_classes';
      break;

    case ReportEntity.PERFORMANCE_SCORE:
      datasetId = 'reporting_spr_perform_by_score';
      break;

    default:
      break;
  }

  return datasetId;
}
