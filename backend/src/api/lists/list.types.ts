import { Prisma } from "@prisma/client";

const fullList = Prisma.validator<Prisma.ListDefaultArgs>()({
  include: {
    cards: true,
    watchers: true,
  },
});

export type FullList = Prisma.ListGetPayload<typeof fullList>;
