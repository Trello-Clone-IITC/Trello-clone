import { prisma } from "../../lib/prismaClient.js";
import { mapActivityLogToDto } from "./activity-log.mapper.js";

const getGeneralActivityLogs = async (userId: string) => {
  const activityLogs = await prisma.activityLog.findMany({
    where: {
      board: {
        boardMembers: {
          some: { userId },
        },
      },
    },
    include: {
      user: true,
      board: true,
      card: true,
    },
  });

  return activityLogs.map(mapActivityLogToDto);
};

export const activityLogService = {
  getGeneralActivityLogs,
};
