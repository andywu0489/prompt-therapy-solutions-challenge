import React, { useState, useEffect } from "react";
import moment from "moment";
import "./styles.css";
import EventDisplay from "./eventDisplay";
import { useSelector } from "react-redux";
import StarIcon from "@material-ui/icons/Star";

function Calendar() {
  const events = useSelector((state) => state.events.events);

  function Day(day, filteredEvents) {
    this.date = day;
    this.events = filteredEvents;
  }

  const filteredEvents = events.filter((event) => {
    event.date.isSame(moment(), "day");
  });

  const [currentDate, setCurrentDate] = useState(
    new Day(moment(), filteredEvents)
  );
  const [calendar, setCalendar] = useState([]);

  const firstDay = currentDate.date.clone().startOf("month").startOf("week");
  const lastDay = currentDate.date.clone().endOf("month").endOf("week");

  useEffect(() => {
    const day = firstDay.clone().subtract(1, "day");
    let array = [];

    while (day.isBefore(lastDay, "day")) {
      array.push(new Array(7).fill(null).map(() => day.add(1, "day").clone()));
    }

    let array2 = [];

    array.forEach((week) => {
      let weekArr = [];
      week.forEach((day) => {
        const filteredEvents = events.filter((event) =>
          event.date.isSame(day, "day")
        );
        if (filteredEvents.length) {
          const a = new Day(day, filteredEvents);
          weekArr.push(a);
        } else {
          weekArr.push(new Day(day, []));
        }
      });
      array2.push(weekArr);
    });
    setCalendar(array2);
  }, [currentDate, events]);

  function currentMonth() {
    return currentDate.date.format("MMMM");
  }

  function currentYear() {
    return currentDate.date.format("YYYY");
  }

  function previousMonth() {
    const filtered = events.filter((event) =>
      event.date.isSame(currentDate.date.clone().subtract(1, "month"), "day")
    );
    return new Day(currentDate.date.clone().subtract(1, "month"), filtered);
  }

  function nextMonth() {
    const filtered = events.filter((event) =>
      event.date.isSame(currentDate.date.clone().add(1, "month"), "day")
    );
    return new Day(currentDate.date.clone().add(1, "month"), filtered);
  }

  function previousYear() {
    const filtered = events.filter((event) =>
      event.date.isSame(currentDate.date.clone().subtract(1, "year"), "day")
    );
    return new Day(currentDate.date.clone().subtract(1, "year"), filtered);
  }

  function nextYear() {
    const filtered = events.filter((event) =>
      event.date.isSame(currentDate.date.clone().add(1, "year"), "day")
    );
    return new Day(currentDate.date.clone().add(1, "year"), filtered);
  }

  function renderDot() {
    return (
      <div>
        <StarIcon />
      </div>
    );
  }

  return (
    <div className="cal-container">
      <div className="calendar">
        <div className="header">
          <div className="button" onClick={() => setCurrentDate(previousYear)}>
            --
          </div>
          <div
            className="button"
            onClick={() => setCurrentDate(previousMonth())}
          >
            -
          </div>
          <div className="month-year-display">
            {currentMonth()} {currentYear()}
          </div>
          <div className="button" onClick={() => setCurrentDate(nextMonth())}>
            +
          </div>
          <div className="button" onClick={() => setCurrentDate(nextYear)}>
            ++
          </div>
        </div>
        <div className="body">
          <div className="week">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div className="day-of-week">{day}</div>
            ))}
          </div>
          {calendar.map((week) => (
            <div className="week">
              {week.map((day) => (
                <div
                  className={
                    currentDate.date.isSame(day.date, "day")
                      ? "selected"
                      : currentDate.date.isSame(day.date, "month")
                      ? "day"
                      : "diff-month"
                  }
                  onClick={() => setCurrentDate(day)}
                >
                  <div className="num">{day.date.format("D")}</div>
                  <div>{day.events.length > 0 && renderDot()}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <EventDisplay selectedDate={currentDate.date} events={events} />
    </div>
  );
}

export default Calendar;
