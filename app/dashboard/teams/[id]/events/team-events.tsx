"use client";

import dayjs from "dayjs";
import { EventType } from "@prisma/client";
import { useParams, useSearchParams } from "next/navigation";
import { useWindowSize } from "@utils/hooks";
import { useContext, useRef } from "react";
import {
  NotificationContext,
  NotificationUpdate,
} from "@contexts/NotificationContext";

import WizzardButton from "@/components/basic/wizButton";

// import Calendar from "@components/basic/calendar";
// import Activities from "@components/basic/activities";

import Style from "../../teams.module.css";

export default function TeamEventsPage({
  appUser,
  writeAccess,
  team,
}: {
  appUser: any;
  writeAccess: boolean;
  team: any;
}) {
  const { setNotifyInvites, setNotifyOptions } =
    useContext(NotificationContext);

  NotificationUpdate(appUser, setNotifyInvites, setNotifyOptions);

  const ref = useRef();
  const today = new Date();
  const window = useWindowSize();
  const searchParams = useSearchParams();

  const view = searchParams.get("view");

  const { id } = useParams();

  const eventTypeOptions = [
    { value: EventType.TRAINING, label: "Training" },
    { value: EventType.LEAGUE_GAME, label: "League game" },
    { value: EventType.TOURNAMENT_GAME, label: "Tournament game" },
    { value: EventType.TACTICS, label: "Tactics" },
    { value: EventType.MEETING, label: "Meeting" },
    { value: EventType.MEDICAL, label: "Medical" },
  ];

  const disableCalendarSize = 765;

  const form = {
    fetch: {
      url: `/api/team/${id}/event`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      master_data: { offset: new Date().getTimezoneOffset() },
    },
    title: "Add event",
    inputs: [
      {
        type: "Select",
        name: "type",
        required: true,
        options: eventTypeOptions,
        placeholder: "Select event type",
      },
      {
        type: "Date",
        name: "date",
        required: true,
        value: dayjs(today),
        minDate: dayjs(today),
        maxDate: dayjs(new Date(2034, 11, 31)),
        format: "DD/MM/YYYY",
        inputRef: ref,
      },
      {
        type: "Time",
        name: "time",
        required: true,
        placeholder: "Start hh:mm",
        format: "HH:mm",
      },
      {
        type: "text",
        name: "note",
        placeholder: "Notes (optional)",
      },
    ],
  };

  if (!window?.width) {
    return (
      <>
        <h1>{id}</h1>
        <div className={Style.wrapper}>
          <h1>Calendar</h1>
          <h1>Activity</h1>
        </div>
        {writeAccess && <WizzardButton form={form} extra={null} />}
      </>
    );
  }

  return (
    <>
      <h1>{id}</h1>

      <div className={Style.wrapper}>
        {/* {window?.width > disableCalendarSize && view !== "list" && (
          <Calendar events={calendarFilterEvents(team.events)} />
        )}
        {(view === "list" || window?.width <= disableCalendarSize) && (
          <Activities
            events={events}
            editable={access == UserAccess.staff || access == UserAccess.owner}
          />
        )} */}
        {window?.width > disableCalendarSize && view !== "list" && (
          <h2>Calendar</h2>
        )}
        {(view === "list" || window?.width <= disableCalendarSize) && (
          <h2>Activity</h2>
        )}
      </div>
      {writeAccess && <WizzardButton form={form} extra={null} />}
    </>
  );
}
