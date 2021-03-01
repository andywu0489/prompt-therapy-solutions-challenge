import React from "react";
import { deleteEvent } from "../features/events/eventsSlice";
import { useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";

function DeleteEvent(props) {
  const dispatch = useDispatch();
  const { eventId } = props;

  function handleDelete() {
    dispatch(deleteEvent({ eventId }));
  }

  return (
    <button onClick={handleDelete}>
      <DeleteIcon />
    </button>
  );
}

export default DeleteEvent;
