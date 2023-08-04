"use client";

// import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Achievement } from "@prisma/client";
import { useParams } from "next/navigation";
import { useContext } from "react";

import { achievementTypeOptions } from "@utils/common";
import { addAchievement } from "@utils/actions";
import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

import WizzardButton from "@components/basic/wizButton";

export default function AchievementsPage({
  appUser,
  writeAccess,
}: {
  appUser: any;
  writeAccess: boolean;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const params = useParams();

  const { id } = params;

  const today = new Date();

  const form = {
    fetch: {
      master_data: { teamId: id },
    },
    title: "Add achievement",
    persist: true,
    inputs: [
      {
        type: "Select",
        name: "type",
        required: true,
        options: achievementTypeOptions,
        placeholder: "Select achievement",
      },
      {
        type: "text",
        name: "competition",
        required: true,
        placeholder: "Competition (ex. EFL Cup)",
      },
      {
        type: "text",
        name: "description",
        placeholder: "*optional (ex. U18, regional)",
      },
      {
        type: "Date",
        name: "date",
        required: true,
        value: dayjs(today),
        minDate: dayjs(new Date(2000, 1, 1)),
        maxDate: dayjs(today),
        views: ["month", "year"],
      },
    ],
    onSubmitAction: addAchievement,
  };

  return <>{writeAccess && <WizzardButton form={form} extra={null} />}</>;
}
