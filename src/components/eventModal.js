import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, TextField } from "@material-ui/core";
import "./styles.css";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { addEvent, editEvent } from "../features/events/eventsSlice";
import { useDispatch } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";

const moment = extendMoment(Moment);

const format = "hh:mm A";

function EventModal(props) {
  const { selectedDate, events, edit, event, eventId } = props;

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(undefined);
  const [start, setStart] = useState(undefined);
  const [end, setEnd] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);

  function Event() {
    this.date = selectedDate;
    this.start = moment(start, "HH:mm").format(format);
    this.end = moment(end, "HH:mm").format(format);
    this.note = note;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNote(undefined);
    setStart(undefined);
    setEnd(undefined);
  };

  const handleSubmit = () => {
    const event = new Event(selectedDate, start, end, note);
    if (edit) {
      dispatch(editEvent({ event, eventId }));
    } else {
      dispatch(addEvent(event));
    }
    setErrorMessage(undefined);
    handleClose();
  };

  const runValidation = (e) => {
    e.preventDefault();

    if (moment(end, format).isSameOrBefore(moment(start, format))) {
      return setErrorMessage("End time is before or same as start time.");
    } else if (events.length) {
      const array = edit
        ? events.filter((event) => event.id !== eventId)
        : events;

      let arr = [];
      array.forEach((event) => {
        const range1 = moment.range(moment(start, format), moment(end, format));
        const range2 = moment.range(
          moment(event.start, format),
          moment(event.end, format)
        );
        if (range1.overlaps(range2) || range2.overlaps(range1)) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      });

      if (arr.some((val) => val === true)) {
        return setErrorMessage("Scheduling conflict.");
      } else {
        handleSubmit();
      }
    } else {
      handleSubmit();
    }
  };

  return (
    <div>
      <button onClick={handleClickOpen}>
        {edit ? <EditIcon /> : "Add Event"}
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={runValidation}>
          <DialogTitle id="alert-dialog-title">
            {edit ? "Edit Event" : "Add Event"}
          </DialogTitle>
          <div className="errorMessage">{errorMessage ? errorMessage : ""}</div>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
                className="field"
                InputLabelProps={{ shrink: true }}
                name="date"
                type="date"
                variant="outlined"
                label="date"
                defaultValue={
                  edit
                    ? event.date.format("YYYY-MM-DD")
                    : selectedDate.format("YYYY-MM-DD")
                }
                disabled={true}
                required
                InputProps={{
                  style: { margin: "5px" },
                }}
              />
              <TextField
                className="field"
                InputLabelProps={{ shrink: true }}
                name="start"
                value={start}
                type="time"
                variant="outlined"
                label="start"
                required={edit ? true : false}

                onChange={(e) => setStart(e.target.value)}
                InputProps={{
                  style: { margin: "5px" },
                }}
              />
              <TextField
                className="field"
                InputLabelProps={{ shrink: true }}
                name="end"
                value={end}
                type="time"
                variant="outlined"
                label="end"
                required={edit ? true : false}
                onChange={(e) => setEnd(e.target.value)}
                InputProps={{
                  style: { margin: "5px" },
                }}
              />
              <TextField
                className="field"
                InputLabelProps={{ shrink: true }}
                name="note"
                value={note}
                type="string"
                variant="outlined"
                label="note"
                onChange={(e) => setNote(e.target.value)}
                required
                InputProps={{
                  style: {
                    margin: "5px",
                  },
                }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" autoFocus>
              Submit
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default EventModal;
