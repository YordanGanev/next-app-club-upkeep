"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleCheck,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faHourglassHalf } from "@fortawesome/free-regular-svg-icons";

import { EventActivities } from "@/utils/common";
import { deleteEvent } from "@/utils/actions";

// Just to add pseudo elements
import "@/styles/pseudo-el-fa-icons.css";
import "@/styles/activity-list.css";
import Style from "./styles/Activities.module.css";

export default function ListEvents({ events }) {
  const eventTimePassed = "Archived";

  const [ticks, setTickers] = useState([]);

  function tick() {
    const updatedCountdowns = events.map((event) => {
      const timeLeft = new Date(event.date) - new Date();
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      let time = eventTimePassed;

      let icon = faFileCircleCheck;

      if (timeLeft > 0) {
        icon = faHourglassHalf;
        time =
          days == 0
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${days}d ${hours}h ${minutes}m`;
      }

      return { ...event, icon, time };
    });

    setTickers(updatedCountdowns);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      tick();
    }, 1000);

    tick();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <div className={Style.wrapper}>
        <div className={Style.title}></div>
        {events.map((e, idx) => {
          const eventDate = new Date(e.date);
          return (
            <div key={e.id} className={Style.list}>
              <input type="checkbox" id={e.id} />
              <label
                htmlFor={e.id}
                className={`${
                  Style.listTitle
                } has-icon activity-${EventActivities[
                  e.type
                ].name.toLowerCase()}`}
              >
                <FontAwesomeIcon icon={EventActivities[e.type].icon} />
                {EventActivities[e.type].name}
              </label>
              <div
                className={`${
                  Style.listExtend
                } activity-brd brd-${EventActivities[
                  e.type
                ].name.toLowerCase()}`}
              >
                <div className={Style.eventTime}>
                  <div className={Style.eventTimeText}>
                    {`${eventDate
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${eventDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`}
                  </div>
                  <div>
                    {ticks[idx]?.time}
                    <FontAwesomeIcon icon={ticks[idx]?.icon} />
                  </div>
                </div>
                {e.note.length > 0 && (
                  <div className={Style.eventNote}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    {e.note}
                  </div>
                )}
                <div className={Style.eventBoard}>
                  {e?.team?.name && (
                    <div className={Style.eventTeam}>
                      <Image
                        width="25"
                        height="25"
                        src={e.team?.picture}
                        alt={`${e.team.name}-logo`}
                      />
                      <span>{e.team.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
