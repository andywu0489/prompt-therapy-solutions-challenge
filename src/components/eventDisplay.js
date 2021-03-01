import React from "react";
import "./styles.css";
import moment from "moment";
import EventModal from "./eventModal";
import DeleteEvent from "./deleteEvent";

function EventDisplay(props) {
  const { selectedDate, events } = props;

  const filteredEvents = events.filter((event) =>
    event.date.isSame(selectedDate, "day")
  );

  const dateFromStart = (time) => new Date("1970/01/01 " + time);

  const sorted = filteredEvents.sort(
    (a, b) => dateFromStart(a.start) - dateFromStart(b.start)
  );

  function renderEvents() {
    return (
      <div className="events-container">
        <div className="title">Events</div>
        {sorted.map((event) => (
          <div className="event">
             <div className='text'> 
            {moment(event.start, "HH:mm A").format("h:mm A")} -{" "}
            {moment(event.end, "HH:mm A").format("h:mm A")}: {event.note}
            </div>
            <div className='icon-container'>
            <DeleteEvent eventId={event.id} />
            <EventModal
              events={filteredEvents}
              edit={true}
              event={event}
              eventId={event.id}
              selectedDate={selectedDate}
            />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderAddEventModal() {
    return (
      <div>
        <EventModal selectedDate={selectedDate} events={filteredEvents} />
      </div>
    );
  }

  return (
    <div className="event-display">
      <div className="date-display">{selectedDate.format("ll")}</div>
      <div className="events-list">
        {filteredEvents.length ? renderEvents() : "No Events"}
        {!selectedDate.isBefore(moment(), "day") && renderAddEventModal()}
      </div>
    </div>
  );
}

export default EventDisplay;
