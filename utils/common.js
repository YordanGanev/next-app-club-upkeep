import { SportType } from "@prisma/client";

export const ManageClubTabs = [
    { slug: "teams", title: "Teams" },
    { slug: "about", title: "About" },
]

export const ManageTeamTabs = [
    { slug: "players", title: "Players" },
    { slug: "medical", title: "Medicals" },
    { slug: "events", title: "Events" },
    { slug: "about", title: "About" },
];

export const StaffTeamTab = {
    slug: "staff",
    title: "Staff",
}

export const UserAccess = {
    owner: "owner",
    staff: "staff",
    player: "player",
};

export const EventActivities = {
    TRAINING: { name: "Training", icon: "fa-solid fa-dumbbell" },
    MEDICAL: { name: "Medical", icon: "fa-solid fa-stethoscope" },
    LEAGUE_GAME: { name: "League", icon: "fa-solid fa-trophy" },
    MEETING: { name: "Meeting", icon: "fa-regular fa-handshake" },
    TOURNAMENT_GAME: { name: "Tourney", icon: "fa-solid fa-shirt" },
    TACTICS: { name: "Tactics", icon: "fa-regular fa-clipboard" },
};


export const queryPushDate = (router, year, month, day, view = null) => {
    router.query["year"] = year;
    router.query["month"] = month;
    router.query["day"] = day;

    if (view) router.query["view"] = view;

    router.push({
        query: router.query,
    });
}

// Cancel player or staff invite
export const cancelInvite = async (router, userId, teamId) => {
    try {
        await fetch("/api/invite", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({userId,teamId}),
        }).then(() => {
          router.replace(router.asPath);
        });
      } catch (error) {
        console.error(error);
      }
}

// String of time passed from date
export const passTimeString = (date) => {
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
}

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