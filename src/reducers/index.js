import { combineReducers } from "redux";
import eventReducer from "../features/events/eventsSlice";

const rootReducer = combineReducers({
    events: eventReducer
});

export default rootReducer;