"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers";

import {
  EventActivities,
  createQueryString,
  createQueryDate,
  queryDate,
} from "utils/common";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import Style from "./styles/Calendar.module.css";
import "@styles/activity-list.css";

const weekdayStrings = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const calendarFilterEvents = (events) => {
  const filteredEvents = {};

  events.forEach((event) => {
    const { type, date } = event;

    const eventDate = new Date(date);
    const dateWithoutMinutes = new Date(
      eventDate?.getFullYear(),
      eventDate?.getMonth(),
      eventDate?.getDate(),
      0,
      0,
      0,
      0
    );

    // If the current date hasn't been added to the filteredEvents object, add it with the current event object
    if (!filteredEvents[dateWithoutMinutes.getTime()]) {
      filteredEvents[dateWithoutMinutes.getTime()] = [event];
    }
    // If the current date already exists in the filteredEvents object, check if an event of the same type has been added
    else {
      const existingEvent = filteredEvents[dateWithoutMinutes.getTime()].find(
        (e) => e.type === type
      );
      // If an event of the same type hasn't been added for the current date, add the current event object
      if (!existingEvent) {
        filteredEvents[dateWithoutMinutes.getTime()].push(event);
      }
    }
  });

  console.warn(filteredEvents);
  return Object.values(filteredEvents).flat(); // Convert back to an array
};

export default function Calendar({ events }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const date = queryDate(searchParams);

  useEffect(() => {
    if (
      !searchParams.get("year") ||
      !searchParams.get("month") ||
      !searchParams.get("day")
    ) {
      const query = createQueryDate(
        searchParams,
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      router.push(`${pathname}?${query}`);
    }
  }, []);

  const fill = (days, date) => {
    const current = new Date();
    let currentDay = current.getDate();

    if (
      current.getMonth() != date.getMonth() ||
      current.getFullYear() != date.getFullYear()
    )
      currentDay = null;

    let arr = [];
    for (let i = 1; i <= days; i++) {
      arr.push(i);
    }

    return arr.map((i) => {
      return (
        <button
          key={`${date.getFullYear()}-${date.getMonth()}-${i}`}
          className={currentDay === i ? Style.currentDay : null}
          onClick={() => {
            const query = createQueryDate(
              searchParams,
              date.getFullYear(),
              date.getMonth(),
              i,
              "list"
            );
            router.push(`${pathname}?${query}`);
          }}
        >
          <div className={Style.date}>{i}</div>
          {addActivity(i)}
        </button>
      );
    });
  };

  const offset = (offset, date, isNext = false) => {
    let arr = [];

    const monthdir = isNext ? 1 : -1;
    let offsetMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1 + monthdir,
      0
    );

    //console.log("offsetMonth", offsetMonth);
    //console.log("offsetMonth.getDate()", offsetMonth.getDate());
    if (isNext) {
      for (let i = 1; i <= offset; i++) {
        arr.push(i);
      }
    } else {
      for (
        let i = offsetMonth.getDate() - offset + 1;
        i <= offsetMonth.getDate();
        i++
      ) {
        //console.log(i);
        arr.push(i);
      }
    }

    return arr.map((i) => {
      return (
        <button
          key={`btn-${i}-day`}
          onClick={() => {
            const query = createQueryString(
              searchParams,
              offsetMonth.getFullYear(),
              offsetMonth.getMonth(),
              i,
              "list"
            );
            router.push(`${pathname}?${query}`);
          }}
          className={Style.unactiveMonth}
        >
          <div className={Style.date}>{i}</div>
        </button>
      );
    });
  };

  const loadCalendar = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, daysInMonth);

    const result = offset((firstDay.getDay() + 6) % 7, date).concat(
      fill(daysInMonth, date),
      offset(7 - lastDay.getDay() !== 7 ? 7 - lastDay.getDay() : 0, date, true)
    );

    return result;
  };

  const addActivity = (day) => {
    // console.log(day);
    const eventsDay = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day;
    });

    // console.log(eventsDay);

    const activities = eventsDay?.map((event) => {
      // console.warn(event);
      return (
        <div
          key={`${event.id}-${event.type}`}
          className={`${Style.activity} activity-${EventActivities[
            event.type
          ].name.toLowerCase()}`}
        >
          <FontAwesomeIcon icon={EventActivities[event.type].icon} />
          <span> {EventActivities[event.type].name}</span>
        </div>
      );
    });

    return (
      <div key={`${date.getDate()}`} className={Style.activityContainer}>
        {activities}
      </div>
    );
  };

  return (
    <>
      <div>
        <div className={Style.calendar}>
          <div className={Style.control}>
            <button
              className={Style.dir}
              onClick={() => {
                date.setMonth(date.getMonth() - 1);
                const query = createQueryDate(
                  searchParams,
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );
                router.push(`${pathname}?${query}`);
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className={`${Style.selectDate} title`}>
              <DatePicker
                views={["month", "year"]}
                value={dayjs(new Date(date))}
                onChange={(value) => {
                  console.log(value);
                  console.warn(searchParams.get("year"), value.$y);
                  console.warn(searchParams.get("month"), value.$M);

                  if (
                    searchParams.get("year") != value.$y ||
                    searchParams.get("month") != value.$M
                  ) {
                    const query = createQueryDate(
                      searchParams,
                      value.$y,
                      value.$M,
                      1
                    );

                    router.push(`${pathname}?${query}`);
                  }
                }}
                minDate={dayjs(new Date(2023, 0, 1))}
                maxDate={dayjs(new Date(2034, 11, 31))}
              />
            </div>

            <button
              className={Style.dir}
              onClick={() => {
                date.setMonth(date.getMonth() + 1);
                const query = createQueryDate(
                  searchParams,
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );

                router.push(`${pathname}?${query}`);
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className={Style.header}>
            {weekdayStrings.map((day) => {
              return <span key={`cal-week-title-${day}`}>{day}</span>;
            })}
          </div>
          <div className={Style.weeks}>{loadCalendar(date)}</div>
        </div>
      </div>
    </>
  );
}
