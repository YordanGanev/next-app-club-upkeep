"use server";
import { prisma } from "@utils/db";
import { getPlaceholderImage } from "@utils/common";

import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";
import {
  Achievement,
  AchievementType,
  EventType,
  InviteType,
  SportType,
} from "@prisma/client";

export async function addClub(data: FormData) {
  const session = await getSession();

  if (!session) {
    return;
  }

  const name = data.get("name") as string;

  const picture = getPlaceholderImage(name.slice(0, 2).toLowerCase());

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
}

export async function addTeam(
  data: FormData,
  master_data: { clubId: string } | undefined
) {
  if (!master_data) return;

  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;
  const sport = data.get("sport") as SportType;
  const picture = getPlaceholderImage(name.slice(0, 2).toLowerCase());

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
        },
      },
    },
  });
}

export async function updateUser(data: FormData) {
  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;
  const date = data.get("birthdate") as string;

  const [day, month, year] = date.split("/");
  const birthdate = new Date(`${year}-${month}-${day}`);

  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      name,
      birthdate: new Date(birthdate),
    },
  });
}

export async function addMedicalRecord(
  data: FormData,
  master_data: { teamId: string } | undefined
) {
  const session = await getSession();

  if (!session) return;

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

  if (!player) return;

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

  return;
}

export async function invitePlayer(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return;

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
}

export async function inviteStaff(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return;

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
}

export async function createPlayer(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return;

  const name = data.get("name") as string;

  const picture = getPlaceholderImage(name.slice(0, 2).toLowerCase());

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

  console.log(player, name, picture);
  //TODO add to prisma
}

export async function addEvent(
  data: FormData,
  master_data: { teamId: string; offset: number }
) {
  const session = await getSession();

  if (!session) return;

  const { teamId, offset } = master_data;

  console.log(teamId, offset);

  const type = data.get("type") as string;
  const date = data.get("date") as string;
  const time = data.get("time") as string;
  const note = data.get("note") as string;

  console.log("type", type);
  console.log("date", date);
  console.log("time", time);
  console.log("note", note);

  const dateInput = new Date(date);

  const [hours, mins] = time.split(":");

  console.log(dateInput, hours, mins);

  dateInput.setHours(Number(hours));
  dateInput.setMinutes(Number(mins));

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
}

export async function addAchievement(
  data: FormData,
  master_data: { teamId: string }
) {
  const session = await getSession();

  if (!session) return;

  const { teamId } = master_data;

  const type = data.get("type") as AchievementType;
  const competition = data.get("competition") as string;
  const description = data.get("description") as string;
  const date = data.get("date") as string;

  const dateInput = new Date(date);

  // console.log(type, competition, description, date, dateInput);

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

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      teamId: true,
    },
  });

  if (event?.teamId !== teamId) return;

  const deleted = await prisma.event.delete({
    where: {
      id: eventId,
    },
  });
}

export async function deleteMedicalRecord(id: string) {
  "use server";
  const session = await getSession();

  if (!session) return;

  const find = await prisma.medical.findUnique({
    where: {
      id,
    },
  });

  const medical = await prisma.medical.delete({
    where: {
      id,
    },
  });
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
