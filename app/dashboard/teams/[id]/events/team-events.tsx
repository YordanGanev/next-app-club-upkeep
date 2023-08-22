"use client";

import dayjs from "dayjs";
import { EventType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useWindowSize } from "@/utils/hooks";

import { addEvent } from "@/utils/actions";

import Connecting from "@/components/basic/connecting";
import WizzardButton from "@/components/basic/wizButton";
import Calendar, { calendarFilterEvents } from "@/components/basic/calendar";
import Activities from "@/components/basic/activities";

import Style from "../../teams.module.css";

export default function TeamEventsPage({
  writeAccess,
  team,
}: {
  writeAccess: boolean;
  team: any;
}) {
  const today = new Date();
  const window = useWindowSize();
  const searchParams = useSearchParams();

  const view = searchParams.get("view");

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
      master_data: { teamId: team.id, offset: new Date().getTimezoneOffset() },
    },
    title: "Add event",
    persist: true,
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
    onSubmitAction: addEvent,
  };

  if (!window?.width) {
    return (
      <>
        <Connecting message={null} />
        {writeAccess && <WizzardButton form={form} extra={null} />}
      </>
    );
  }

  return (
    <>
      <div className={Style.wrapper}>
        {window?.width > disableCalendarSize && view !== "list" && (
          <Calendar events={calendarFilterEvents(team.events)} />
        )}

        {(view === "list" || window?.width <= disableCalendarSize) && (
          <Activities events={team.events} editable={writeAccess} />
        )}
      </div>
      {writeAccess && <WizzardButton form={form} extra={null} />}
    </>
  );
}
