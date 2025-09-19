import { Prisma } from "@prisma/client";

const activityLogWithRelations =
  Prisma.validator<Prisma.ActivityLogDefaultArgs>()({
    include: {
      user: true,
      board: true,
      card: true,
    },
  });

export type ActivityLogWithRelations = Prisma.ActivityLogGetPayload<
  typeof activityLogWithRelations
>;
