"use client";

import dayjs from "dayjs";
import { EventType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useWindowSize } from "@/utils/hooks";

import Connecting from "@/components/basic/connecting";
import Calendar, { calendarFilterEvents } from "@/components/basic/calendar";
import Activities from "@/components/basic/activities";

import Style from "./schedule.module.css";

export default function SchedulePage({ events }: { events: any }) {
  const disableCalendarSize = 765;

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

  if (!window?.width) {
    return <Connecting message={null} />;
  }

  return (
    <div className={Style.wrapper}>
      {window?.width > disableCalendarSize && view !== "list" && (
        <Calendar events={calendarFilterEvents(events)} />
      )}

      {(view === "list" || window?.width <= disableCalendarSize) && (
        <Activities events={events} editable={false} />
      )}
    </div>
  );
}
