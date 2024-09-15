import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface Task {
  _id: string;
  task_id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit: Task;
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [task, setTask] = useState<Task>(taskToEdit);
  const [deadline, setDeadline] = useState<Date | null>(
    taskToEdit.deadline ? new Date(taskToEdit.deadline) : null
  );

  useEffect(() => {
    setTask(taskToEdit);
    setDeadline(taskToEdit.deadline ? new Date(taskToEdit.deadline) : null);
  }, [taskToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, status: event.target.value as string }));
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, priority: event.target.value as string }));
  };

  const handleDeadlineChange = (date: Date | null) => {
    setDeadline(date);
    setTask((prev) => ({
      ...prev,
      deadline: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleSave = () => {
    onSave(task);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="task_id"
          label="Task ID"
          type="text"
          fullWidth
          variant="standard"
          value={task.task_id}
          onChange={handleChange}
          disabled
        />
        <TextField
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={task.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={task.description}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={task.priority || ""}
            onChange={handlePriorityChange}
            label="Priority"
          >
            <MenuItem value="Urgent">Urgent</MenuItem>
            <MenuItem value="Not Urgent">Not Urgent</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={task.status || ""}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="ToDo">ToDo</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="standard">
          <div className="date-picker-wrapper">
            <DatePicker
              selected={deadline}
              onChange={handleDeadlineChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a deadline"
              className="react-datepicker"
            />
          </div>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
