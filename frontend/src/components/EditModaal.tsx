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

interface Task {
  TaskId: string;
  Title: string;
  Description: string;
  Priority: string;
  Status: string;
  Deadline: string; // Keeping Deadline as a string
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

  useEffect(() => {
    setTask(taskToEdit);
    console.log(taskToEdit);
  }, [taskToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, Status: event.target.value as string }));
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setTask((prev) => ({ ...prev, Priority: event.target.value as string }));
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
          name="TaskId"
          label="Task ID"
          type="text"
          fullWidth
          variant="standard"
          value={task.TaskId}
          onChange={handleChange}
          disabled
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
        />
        

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel>Priority</InputLabel>
          <Select
            name="Status"
            value={task.Priority || ""}
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
            name="Status"
            value={task.Status || ""}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="ToDo">ToDo</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="Deadline"
          label="Deadline"
          type="text"
          fullWidth
          variant="standard"
          value={task.Deadline}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
