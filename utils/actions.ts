"use server";
import { prisma } from "@/utils/db";
import { startsWithCyrillic, getPlaceholderImage } from "@/utils/common";

import { getSession } from "@auth0/nextjs-auth0";

import {
  Achievement,
  AchievementType,
  EventType,
  GenderType,
  InviteType,
  Prisma,
  SportType,
} from "@prisma/client";
import { FormSubmitResultType } from "@/contexts/PopoutContext";

// const SESSION_EXPIRED = { success: false, message: "Session expired" };
const SESSION_EXPIRED = { success: false };
const MAX_CLUB_COUNT = 15;
const MAX_TEAM_COUNT = 15;

export async function addClub(data: FormData) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const name = data.get("name") as string;

  let pic: string = name.slice(0, 2).toLowerCase();

  if (startsWithCyrillic(name)) {
    pic = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }

  const picture = getPlaceholderImage(pic);

  try {
    const clubsCount = await prisma.club.count({
      where: {
        owner: {
          email: session.user.email,
        },
      },
    });

    if (clubsCount === MAX_CLUB_COUNT)
      return { success: false, message: "Clubs limit reached!" };

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        club: {
          create: {
            name,
            picture,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { success: false, message: "Club name already taken" };
      }
      return { success: false };
    }
  }

  return { success: true };
}

export async function addTeam(
  data: FormData,
  master_data: { clubId: string } | undefined
) {
  if (!master_data) return SESSION_EXPIRED;

  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;
  const sport = data.get("sport") as SportType;
  const age = data.get("age") as string;
  const gender = data.get("gender") as GenderType;

  const ageGroup = age ? Number(age) : null;

  let pic: string = name.slice(0, 2).toLowerCase();

  if (startsWithCyrillic(name)) {
    pic = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  const picture = getPlaceholderImage(pic);

  try {
    const teamCount = await prisma.team.count({
      where: {
        clubId: master_data.clubId,
      },
    });

    if (teamCount === MAX_TEAM_COUNT)
      return { success: false, message: "Teams limit reached!" };

    const updated = await prisma.club.update({
      where: {
        id: master_data.clubId,
      },
      data: {
        teams: {
          create: {
            name,
            sport,
            picture,
            ageGroup,
            gender,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { success: false, message: "Team with this name already exist" };
      }
      return { success: false };
    }
  }

  return { success: true };
}

export async function updateUser(data: FormData) {
  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;
  const date = data.get("birthdate") as string;
  const gender = data.get("gender") as GenderType;

  const [day, month, year] = date.split("/");
  const birthdate = new Date(`${year}-${month}-${day}`);

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name,
      birthdate: new Date(birthdate),
      gender,
    },
  });

  return { success: true };
}

export async function addMedicalRecord(data: FormData) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const weight = Number(data.get("weight")) as number;

  const height = Number(data.get("height")) as number;

  const id = data.get("id") as string;

  let age = 0;

  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!player) return { success: false, message: "Player not found" };

  if (player.user?.birthdate) {
    const diff =
      new Date().getTime() - new Date(player.user.birthdate).getTime();
    age = Math.floor(diff / (1000 * 3600 * 24 * 365.25));
  }

  const updated = await prisma.player.update({
    where: {
      id,
    },
    data: {
      medical: {
        create: {
          weight,
          height,
          age,
        },
      },
    },
  });

  return { success: true };
}

export async function invitePlayer(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const { teamId } = master_data;

  const emails: string[] = [];

  data.forEach((value, name) => {
    if (name === "email") {
      emails.push(value as string);
    }
  });

  const users = await prisma.user.findMany({
    where: {
      email: { in: emails },
    },
    select: {
      id: true,
    },
  });

  const invites = users.map((user) => {
    return { teamId, userId: user.id };
  });

  const invite = await prisma.invite.createMany({
    data: invites,
  });

  await prisma.user.updateMany({
    where: { email: { in: emails } },
    data: {
      unseenInvites: {
        increment: 1,
      },
    },
  });

  return { success: true };
}

export async function inviteStaff(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;
  const { teamId } = master_data;

  const emails: string[] = [];

  data.forEach((value, name) => {
    if (name === "email") {
      emails.push(value as string);
    }
  });

  const users = await prisma.user.findMany({
    where: {
      email: { in: emails },
    },
    select: {
      id: true,
    },
  });

  const invites = users.map((user) => {
    return { teamId, userId: user.id, type: InviteType.STAFF };
  });

  const invite = await prisma.invite.createMany({
    data: invites,
  });

  await prisma.user.updateMany({
    where: { email: { in: emails } },
    data: {
      unseenInvites: {
        increment: 1,
      },
    },
  });

  return { success: true };
}

export async function createPlayer(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();
  if (!session) return SESSION_EXPIRED;

  const name = data.get("name") as string;

  let pic: string = name.slice(0, 2).toLowerCase();

  if (startsWithCyrillic(name)) {
    pic = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }

  const picture = getPlaceholderImage(pic);

  try {
    const player = await prisma.player.create({
      data: {
        name: name,
        picture,
        Team: {
          connect: {
            id: master_data.teamId,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { success: false, message: "Player already exists" };
      }
      return { success: false };
    }
  }

  return { success: true };
}

export async function addEvent(
  data: FormData,
  master_data: { teamId: string; offset: number }
) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const { teamId, offset } = master_data;

  // console.log(teamId, offset);

  const type = data.get("type") as string;
  const date = data.get("date") as string;
  const time = data.get("time") as string;
  const note = data.get("note") as string;

  const [day, month, year] = date.split("/");
  const [hours, mins] = time.split(":");

  const dateInput = new Date(`${month}/${day}/${year}`);

  dateInput.setHours(Number(hours));
  dateInput.setMinutes(Number(mins));

  try {
    const event = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        events: {
          create: {
            type: type as EventType,
            date: dateInput,
            note,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { success: false, message: "Event already exists" };
      }
    }
    return { success: false };
  }

  return { success: true };
}

export async function addAchievement(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const { teamId } = master_data;

  const type = data.get("type") as AchievementType;
  const competition = data.get("competition") as string;
  const description = data.get("description") as string;
  const date = data.get("date") as string;

  const dateInput = new Date(date);

  // console.log(type, competition, description, date, dateInput);
  try {
    const achievement = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        achievements: {
          create: {
            type,
            competition,
            description,
            date: dateInput,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Unexpected error occured! Please try again!",
    };
  }

  return { success: true };
}

export async function addPost(data: FormData, master_data: { teamId: string }) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const { teamId } = master_data;

  const title = data.get("title") as string;
  const message = data.get("message") as string;

  try {
    const post = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        posts: {
          create: {
            title,
            message,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Unexpected error occured! Please try again!",
    };
  }

  return { success: true };
}

// Custom invoaction methods
// Simulating api calls

export async function cancelInvite(teamId: string, userId: string) {
  const session = await getSession();

  if (!session) return;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      unseenInvites: true,
    },
  });

  if (!user) return;

  const invite = await prisma.invite.delete({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (user?.unseenInvites > 0) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        unseenInvites: {
          decrement: 1,
        },
      },
    });
  }
}

export async function acceptInvite(teamId: string, userId: string) {
  const session = await getSession();

  if (!session) return;

  const invite = await prisma.invite.delete({
    where: {
      teamId_userId: { teamId, userId },
    },
  });

  if (invite.type === InviteType.PLAYER) {
    const player = await prisma.player.create({
      data: { userId, teamId },
    });
  } else if (invite.type === InviteType.STAFF) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        team: {
          connect: {
            id: teamId,
          },
        },
      },
    });
  }
}

export async function removePlayer(id: string) {
  const session = await getSession();

  if (!session) return;

  const player = await prisma.player.delete({
    where: {
      id,
    },
  });
}

export async function removeStaff(teamId: string, userId: string) {
  const session = await getSession();

  if (!session) return;

  console.log(teamId, userId);

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      team: {
        disconnect: {
          id: teamId,
        },
      },
    },
  });

  console.log(user);
}

export async function deleteEvent(eventId: string, teamId: string) {
  const session = await getSession();

  if (!session) return;

  console.log(eventId, teamId);
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        teamId: true,
      },
    });

    console.log(event);
    if (event?.teamId !== teamId) return { success: false };

    const deleted = await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    console.log(deleted);
  } catch (e) {
    console.log(e);
    return { success: false };
  }
  return { success: true };
}

export async function deleteMedicalRecord(id: string) {
  "use server";
  const session = await getSession();

  if (!session) return false;

  const find = await prisma.medical.findUnique({
    where: {
      id,
    },
  });

  if (!find) return false;

  const medical = await prisma.medical.delete({
    where: {
      id,
    },
  });

  return true;
}

export async function incrementUnseenInvites(text: string) {
  const session = await getSession();

  if (!session) return;

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      unseenInvites: {
        increment: 1,
      },
    },
  });
}

export async function deleteTeam(teamId: string) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const playerCount = await prisma.player.count({
    where: {
      teamId,
    },
  });

  if (playerCount > 0)
    return { success: false, message: "Team still has players" };

  try {
    const team = await prisma.team.delete({
      where: {
        id: teamId,
      },
    });
  } catch (e) {
    console.log(e);
    return { success: false };
  }

  return { success: true };
}

export async function deleteClub(clubId: string) {
  const session = await getSession();

  if (!session) return SESSION_EXPIRED;

  const teamsCount = await prisma.team.count({
    where: {
      clubId,
    },
  });

  if (teamsCount > 0)
    return { success: false, message: "Club still has teams" };

  try {
    const club = await prisma.club.delete({
      where: {
        id: clubId,
      },
    });
  } catch (e) {
    console.log(e);
    return { success: false };
  }

  return { success: true };
}
