import { useRouter } from "next/router";
import Style from "./styles/Activities.module.css";
import { useEffect, useState, useContext } from "react";

import Image from "next/image";
import Head from "next/head";
// import Button from "next/button";

import { queryPushDate, EventActivities } from "utils/common";
import { queryDateHook } from "utils/hooks";

import { ConfirmActionContext } from "contexts/ConfirmActionContext";
/* Custom date picker component */
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import dayjs from "dayjs";

import { DatePicker, StaticDatePicker } from "@mui/x-date-pickers";

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

      <i className="fas fa-calendar-alt"></i>
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

  const { ConfirmActionSetup } = useContext(ConfirmActionContext);

  const router = useRouter();

  const { view } = router.query;
  const date = queryDateHook(router);

  const eventTimePassed = "Archived";

  const options = {
    weekday: "long", // full name of the day of the week
    year: "numeric", // numeric year
    month: "long", // full name of the month
    day: "numeric", // numeric day of the month
  };

  async function deleteEvent(teamId, id) {
    console.log("delete event", id);

    const resp = await fetch(`/api/team/${teamId}/event`, {
      method: "DELETE",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamId, id }),
    }).then((res) => {
      console.log(res.json());
      router.replace(router.asPath);
    });
  }

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
      let icon = "fa-solid fa-file-circle-check";

      if (timeLeft > 0) {
        icon = "fa-regular fa-hourglass-half";
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
  }, [router.query]);

  return (
    <>
      <div className={Style.wrapper}>
        <div className={Style.title}>
          {view && (
            <>
              <button
                onClick={() => {
                  delete router.query?.view;
                  router.push({ query: router.query });
                }}
              >
                <i className="fa-solid fa-arrow-left"></i> Back
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
                  queryPushDate(router, newDate.$y, newDate.$M, newDate.$D);
                }
              }}
            ></ButtonDatePicker>
          )}
        </div>

        {listEvents.length == 0 && (
          <div className={Style.noEvents}>
            <i className="fa-regular fa-calendar-times"></i>
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
                className={Style.listTitle}
                activity={EventActivities[e.type].name.toLowerCase()}
              >
                <i className={EventActivities[e.type].icon}></i>
                {EventActivities[e.type].name}
              </label>
              <div
                border={EventActivities[e.type].name.toLowerCase()}
                className={Style.listExtend}
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
                    <i className={ticks[idx]?.icon}></i>
                  </div>
                </div>
                {e.note.length > 0 && (
                  <div className={Style.eventNote}>
                    <i className="fa-solid fa-circle-info"></i>
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
                      {/* <button border="view">Edit</button> */}
                      <button
                        border="remove"
                        onClick={() => {
                          ConfirmActionSetup("Delete event", () => {
                            deleteEvent(e.teamId, e.id);
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
