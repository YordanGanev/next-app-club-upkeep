import {
  SportType,
  Achievement,
  AchievementType,
  User,
  Player,
} from "@prisma/client";
import { ReadonlyURLSearchParams } from "next/navigation";

import {
  faDumbbell,
  faShirt,
  faTrophy,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { faHandshake, faClipboard } from "@fortawesome/free-regular-svg-icons";

export type UserAccessType = null | "owner" | "staff" | "player";

export const ManageClubTabs = [
  { slug: "teams", title: "Teams" },
  { slug: "about", title: "About" },
];

export const PlayerManageTeamTabs = [
  { slug: "players", title: "Players" },
  { slug: "medical", title: "Medicals" },
  { slug: "events", title: "Events" },
  { slug: "achievements", title: "Achievements" },
  { slug: "about", title: "About" },
];

export const StaffManageTeamTabs = [
  { slug: "players", title: "Players" },
  { slug: "staff", title: "Staff" },
  { slug: "medical", title: "Medicals" },
  { slug: "events", title: "Events" },
  { slug: "achievements", title: "Achievements" },
  { slug: "about", title: "About" },
];

export const EventActivities = {
  TRAINING: { name: "Training", icon: faDumbbell },
  MEDICAL: { name: "Medical", icon: faStethoscope },
  LEAGUE_GAME: { name: "League", icon: faTrophy },
  MEETING: { name: "Meeting", icon: faHandshake },
  TOURNAMENT_GAME: { name: "Tourney", icon: faShirt },
  TACTICS: { name: "Tactics", icon: faClipboard },
};

export const createQueryString = (
  searchParams: ReadonlyURLSearchParams,
  query: { name: string; value: string }[]
) => {
  const params = new URLSearchParams(searchParams.toString());

  console.log(query);
  query.forEach(({ name, value }) => params.set(name, value));

  console.log(params);
  return params.toString();
};

export const queryDate = (searchParams: ReadonlyURLSearchParams) => {
  const day = searchParams.get("day");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  console.log(day, month, year);

  if (!day || !month || !year) return new Date();

  return new Date(Number(year), Number(month), Number(day));
};

export const createQueryDate = (
  searchParams: ReadonlyURLSearchParams,
  year: number,
  month: number,
  day: number,
  view: "list" | "calendar" | null = null
) => {
  const params = new URLSearchParams(searchParams.toString());

  params.set("year", year.toString());
  params.set("month", month.toString());
  params.set("day", day.toString());

  if (view) params.set("view", view);

  return params.toString();
};

// Cancel player or staff invite
export const cancelInvite = async (
  router: any,
  userId: string,
  teamId: string
) => {
  try {
    await fetch("/api/invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, teamId }),
    }).then(() => {
      router.replace(router.asPath);
    });
  } catch (error) {
    console.error(error);
  }
};

// String of time passed from date
export const passTimeString = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? "a year ago" : years + " years ago";
  } else if (months > 0) {
    return months === 1 ? "a month ago" : months + " months ago";
  } else if (days > 0) {
    return days === 1 ? "a day ago" : days + " days ago";
  } else if (hours > 0) {
    return hours === 1 ? "an hour ago" : hours + " hours ago";
  } else {
    return minutes <= 1 ? "a minute ago" : minutes + " minutes ago";
  }
};

export const sportTypeOptions = [
  { value: SportType.FOOTBALL, label: "Football" },
  { value: SportType.VOLLEYBALL, label: "Volleyball" },
  { value: SportType.BASKETBALL, label: "Basketball" },
  { value: SportType.HANDBALL, label: "Handball" },
  { value: SportType.ICE_HOKEY, label: "Ice Hokey" },
  { value: SportType.FIELD_HOKEY, label: "Field Hokey" },
  { value: SportType.RUGBY, label: "Rugby" },
  { value: SportType.OTHER, label: "Other" },
];

export const achievementTypeOptions = [
  { value: AchievementType.FIRST_PLACE, label: "1st place" },
  { value: AchievementType.SECOND_PLACE, label: "2nd place" },
  { value: AchievementType.THIRD_PLACE, label: "3rd place" },
  { value: AchievementType.MVP, label: "MVP award" },
  { value: AchievementType.SPECIAL, label: "Special award" },
];

export const checkUserAccess: (
  userId: string,
  ownerId: string,
  staff: { id: string }[],
  players: { userId: string | null }[]
) => {
  access: UserAccessType;
  WriteAccess: boolean;
} = (userId, ownerId, staff, players) => {
  let access: UserAccessType = null;

  if (ownerId === userId) {
    access = "owner";
  } else {
    players?.forEach((player) => {
      if (player.userId === userId) {
        access = "player";
      }
    });
    if (access !== "player") {
      staff?.forEach((member) => {
        if (member.id === userId) {
          access = "staff";
        }
      });
    }
  }

  return { access, WriteAccess: access === "owner" || access === "staff" };
};

export const containsCyrillic = (text: string) => {
  const cyrillicRegex = /[а-яА-ЯЁё]/;
  return cyrillicRegex.test(text);
};

export const getPlaceholderImage = (signature: string) =>
  `https://i0.wp.com/cdn.auth0.com/avatars/${signature}.png?ssl=1`;
