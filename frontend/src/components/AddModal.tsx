import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";


interface Task {
  TaskId: string;
  Title: string;
  Description: string;
  Priority: string;
  Status: string;
  Deadline: string; // Store the date as a string in YYYY-MM-DD format
}

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

const AddModal: React.FC<AddModalProps> = ({ open, onClose, onAdd }) => {
  const [task, setTask] = useState<Task>({
    TaskId: "",
    Title: "",
    Description: "",
    Priority: "",
    Status: "",
    Deadline: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});
  const [deadline, setDeadline] = useState<Date | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name as string]: value as string }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, Status: event.target.value }));
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, Priority: event.target.value }));
  };

  const handleDeadlineChange = (date: Date | null) => {
    setDeadline(date);
    setTask((prev) => ({
      ...prev,
      Deadline: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Task, string>> = {};
    if (!task.TaskId) newErrors.TaskId = "Task ID is required";
    if (!task.Title) newErrors.Title = "Title is required";
    if (!task.Description) newErrors.Description = "Description is required";
    if (!task.Priority) newErrors.Priority = "Priority is required";
    if (!task.Status) newErrors.Status = "Status is required";
    if (!task.Deadline) newErrors.Deadline = "Deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd(task);
      setTask({
        TaskId: "",
        Title: "",
        Description: "",
        Priority: "",
        Status: "",
        Deadline: "",
      });
      setErrors({});
      setDeadline(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="TaskId"
          label="Task ID"
          type="text"
          fullWidth
          variant="standard"
          value={task.TaskId}
          onChange={handleChange}
          error={!!errors.TaskId}
          helperText={errors.TaskId}
        />
        <TextField
          margin="dense"
          name="Title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={task.Title}
          onChange={handleChange}
          error={!!errors.Title}
          helperText={errors.Title}
        />
        <TextField
          margin="dense"
          name="Description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={task.Description}
          onChange={handleChange}
          error={!!errors.Description}
          helperText={errors.Description}
        />
        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.Priority}
        >
          <InputLabel>Priority</InputLabel>
          <Select
            name="Priority"
            value={task.Priority}
            onChange={handlePriorityChange}
            label="Priority"
          >
            <MenuItem value="Urgent">Urgent</MenuItem>
            <MenuItem value="Not Urgent">Not Urgent</MenuItem>
          </Select>
          {errors.Priority && (
            <FormHelperText>{errors.Priority}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.Status}
        >
          <InputLabel>Status</InputLabel>
          <Select
            name="Status"
            value={task.Status}
            onChange={handleSelectChange}
            label="Status"
          >
            <MenuItem value="ToDo">ToDo</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
          {errors.Status && <FormHelperText>{errors.Status}</FormHelperText>}
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.Deadline}
        >
          <InputLabel>Deadline</InputLabel>
          <div className="date-picker-wrapper">
            <DatePicker
              selected={deadline}
              onChange={handleDeadlineChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a deadline"
              className="react-datepicker"
            />
          </div>
          {errors.Deadline && (
            <FormHelperText>{errors.Deadline}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
