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
  _id: string;
  task_id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
}

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

const AddModal: React.FC<AddModalProps> = ({ open, onClose, onAdd }) => {
  const [task, setTask] = useState<Task>({
    _id: "",
    task_id: "",
    title: "",
    description: "",
    priority: "",
    status: "",
    deadline: "",
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
    setTask((prev) => ({ ...prev, status: event.target.value }));
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, priority: event.target.value }));
  };

  const handleDeadlineChange = (date: Date | null) => {
    setDeadline(date);
    setTask((prev) => ({
      ...prev,
      deadline: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof Task, string>> = {};
    if (!task.task_id) newErrors.task_id = "Task ID is required";
    if (!task.title) newErrors.title = "Title is required";
    if (!task.description) newErrors.description = "Description is required";
    if (!task.priority) newErrors.priority = "Priority is required";
    if (!task.status) newErrors.status = "Status is required";
    if (!task.deadline) newErrors.deadline = "Deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd(task);
      setTask({
        _id: "",
        task_id: "",
        title: "",
        description: "",
        priority: "",
        status: "",
        deadline: "",
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
          name="task_id"
          label="Task ID"
          type="text"
          fullWidth
          variant="standard"
          value={task.task_id}
          onChange={handleChange}
          error={!!errors.task_id}
          helperText={errors.task_id}
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
          error={!!errors.title}
          helperText={errors.title}
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
          error={!!errors.description}
          helperText={errors.description}
        />
        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.priority}
        >
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={task.priority}
            onChange={handlePriorityChange}
            label="Priority"
          >
            <MenuItem value="Urgent">Urgent</MenuItem>
            <MenuItem value="Not Urgent">Not Urgent</MenuItem>
          </Select>
          {errors.priority && (
            <FormHelperText>{errors.priority}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.status}
        >
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={task.status}
            onChange={handleSelectChange}
            label="Status"
          >
            <MenuItem value="ToDo">ToDo</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
          variant="standard"
          error={!!errors.deadline}
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
          {errors.deadline && (
            <FormHelperText>{errors.deadline}</FormHelperText>
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
