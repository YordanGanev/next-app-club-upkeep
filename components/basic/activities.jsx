import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faFileCircleCheck,
  faArrowLeft,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHourglassHalf,
  faCalendarTimes,
} from "@fortawesome/free-regular-svg-icons";

import { queryDate, EventActivities, createQueryDate } from "@utils/common";
import { deleteEvent } from "@utils/actions";
import { PopoutContext } from "@contexts/PopoutContext";

/* Custom date picker component */
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers";

// Just to add pseudo elements
import "@styles/pseudo-el-fa-icons.css";
import Style from "./styles/Activities.module.css";

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ?? "Pick a date"}

      <FontAwesomeIcon icon={faCalendarAlt} />
    </Button>
  );
}

ButtonField.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    "aria-label": PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  label: PropTypes.node,
  setOpen: PropTypes.func,
};

function ButtonDatePicker(props) {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      minDate={dayjs(new Date(2023, 0, 1))}
      maxDate={dayjs(new Date(2034, 11, 31))}
    />
  );
}

ButtonDatePicker.propTypes = {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.any,
};

/* Custom date picker component */

export default function Activities({ events, editable = false }) {
  const [ticks, setTickers] = useState([]);

  const { setAction } = useContext(PopoutContext);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view");
  const date = queryDate(searchParams);

  const eventTimePassed = "Archived";

  const options = {
    weekday: "long", // full name of the day of the week
    year: "numeric", // numeric year
    month: "long", // full name of the month
    day: "numeric", // numeric day of the month
  };

  const listEvents = events
    .filter((e) => {
      return new Date(e.date).getDate() == date.getDate();
    })
    .sort((a, b) => {
      return a.date > b.date;
    });

  function tick() {
    const updatedCountdowns = listEvents.map((event) => {
      const timeLeft = new Date(event.date) - new Date();
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      let time = eventTimePassed;
      // let icon = "fa-regular fa-hourglass-empty";
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
        <div className={Style.title}>
          {view && (
            <>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("view");

                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
              <div className={Style.date}>
                {date.toLocaleDateString("en-US", options)}{" "}
              </div>
            </>
          )}
          {!view && (
            <ButtonDatePicker
              label={date.toLocaleDateString("en-US", options)}
              value={dayjs(date)}
              onChange={(newDate) => {
                if (
                  newDate.$D != date.getDate() ||
                  newDate.$M != date.getMonth() ||
                  newDate.$y != data.getYear()
                ) {
                  tick();
                  const query = createQueryDate(
                    searchParams,
                    newDate.$y,
                    newDate.$M,
                    newDate.$D
                  );

                  router.push(`${pathname}?${query}`);
                }
              }}
            ></ButtonDatePicker>
          )}
        </div>

        {listEvents.length == 0 && (
          <div className={Style.noEvents}>
            <FontAwesomeIcon icon={faCalendarTimes} />
            <div>No events that day</div>
          </div>
        )}
        {listEvents.map((e, idx) => {
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
                  {ticks[idx]?.time !== eventTimePassed && editable && (
                    <div className={Style.eventBoard}>
                      <button
                        className={Style.borderRemove}
                        onClick={() => {
                          setAction({
                            title: "Delete event",
                            message: "Delete event",
                            callback: () => {
                              deleteEvent(e.teamId, e.id);
                            },
                          });
                        }}
                      >
                        Delete
                      </button>
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
