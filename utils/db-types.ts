import {
  Prisma,
  Player,
  Club,
  Event,
  Invite,
  Team,
  Medical,
  User,
} from "@prisma/client";

const Player_UserMedical = Prisma.validator<Prisma.PlayerArgs>()({
  include: {
    user: true,
    medical: true,
  },
});

export type Player_UserMedical_t = Prisma.PlayerGetPayload<
  typeof Player_UserMedical
>;
