import {
  createSlice
} from "@reduxjs/toolkit";

let id = 0;

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
  },
  reducers: {
    addEvent(state, action) {
      const {
        date,
        start,
        end,
        note
      } = action.payload;
      const obj = {
        id: id,
        date: date,
        start: start,
        end: end,
        note: note,
      };
      state.events = state.events.concat(obj);
      id++;
    },
    deleteEvent(state, action) {
      const {
        eventId
      } = action.payload
      state.events = state.events.filter(event => event.id !== eventId)
    },
    editEvent(state, action) {
      const {
        event,
        eventId
      } = action.payload

      const obj = {
        id: eventId,
        date: event.date,
        start: event.start,
        end: event.end,
        note: event.note
      }

      state.events = state.events.filter(event => event.id !== eventId).concat(obj)
    }
  },
});

export const {
  addEvent,
  deleteEvent,
  editEvent
} = eventsSlice.actions;
export default eventsSlice.reducer;