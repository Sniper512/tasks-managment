import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import AddModal from "./modals/AddModal";
import EditModal from "./modals/EditModal";
import DeleteModal from "./modals/DeleteModal";
import { Task } from "../types/taskTypes";
import deleteTaskFromDBService from "../services/deleteTaskFromDBService";
import editTaskToDBService from "../services/editTaskToDBService";
import addTaskToDBService from "../services/addTaskToDBService";
import getAllTasksFromDBService from "../services/getAllTasksFromDBService";
import Alert from '@mui/material/Alert';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
    fontWeight: "bold",
    padding: theme.spacing(2, 1),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "18px",
    fontFamily: "Roboto, sans-serif",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "18px",
    padding: theme.spacing(1),
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontFamily: "Roboto, sans-serif",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const statusStyles = {
  ToDo: {},
  InProgress: {},
  Done: {},
};

const PriorityStyles = {
  Urgent: {},
  "Not Urgent": {},
};

function CustomizedTables() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [rows, setRows] = useState<Task[]>([]);
  const [alertOpen, setAlertOpen] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success"); 

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllTasksFromDBService();
      const data = response.data;

      // Sorting tasks based on status
      const sortedData = data.sort((a: Task, b: Task) => {
        const statusOrder: { [key: string]: number } = {
          InProgress: 1,
          ToDo: 2,
          Done: 3,
        };

        return (
          (statusOrder[a.status as keyof typeof statusOrder] || 0) -
          (statusOrder[b.status as keyof typeof statusOrder] || 0)
        );
      });

      setRows(sortedData);
    };

    fetchData();
  }, [rows]);

  const handleClickOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleAddTask = async (newTask: Task) => {
    const response = await addTaskToDBService(newTask);
    if (response.type === "success") {
      setRows((prev) => [...prev, newTask]);
      showAlert("Task added successfully", "success");
    } else if (response.type === "error") {
      showAlert("Failed to add task", "error");
    }
  };

  const handleClickOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setTaskToEdit(null);
  };

  const handleEditTask = async (updatedTask: Task) => {
    const response = await editTaskToDBService(updatedTask);
    if (response.type === "success") {
      setRows((prev) =>
        prev.map((task) =>
          task.task_id === updatedTask.task_id ? updatedTask : task
        )
      );
      showAlert("Task updated successfully", "success");
    } else if (response.type === "error") {
      showAlert("Failed to update task", "error");
    }
    handleCloseEdit();
  };

  const handleClickOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleTaskDeleteFunc = async (id: string) => {
    const response = await deleteTaskFromDBService({ id });
    if (response.type === "success") {
      setRows((prev) => prev.filter((task) => task.task_id !== id));
      showAlert("Task deleted successfully", "success");
      handleCloseDelete();
    } else if (response.type === "error") {
      showAlert("Failed to delete task", "error");
    }
  };

  const showAlert = (message: string, severity: "success" | "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpenAdd}
        sx={{
          marginLeft: "5%",
          marginTop: 10,
          padding: "10px 24px",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "bold",
        }}
      >
        Add Task
      </Button>

      <AddModal open={openAddModal} onClose={handleCloseAdd} onAdd={handleAddTask} />
      <EditModal open={openEditModal} onClose={handleCloseEdit} onSave={handleEditTask} taskToEdit={taskToEdit || ({} as Task)} />
      <DeleteModal
        open={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleTaskDeleteFunc}
        taskName={taskToDelete?.title || ""}
        taskId={taskToDelete?._id || ""}
      />

      <TableContainer
        component={Paper}
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "90%",
          marginTop: 3,
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Task Id</StyledTableCell>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Priority</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">Deadline</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.task_id} style={{ textDecoration: row.status === "Done" ? "line-through" : "none", cursor: "pointer" }}>
                <StyledTableCell align="left" style={{ paddingLeft: 16 }} component="th" scope="row">
                  {row.task_id}
                </StyledTableCell>
                <StyledTableCell align="left">{row.title}</StyledTableCell>
                <StyledTableCell align="left" sx={{ maxWidth: 300, minWidth: 250 }}>
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="left" sx={PriorityStyles[row.priority as keyof typeof PriorityStyles]} style={{ paddingLeft: 16, whiteSpace: "nowrap" }}>
                  {row.priority}
                </StyledTableCell>
                <StyledTableCell align="left" sx={statusStyles[row.status as keyof typeof statusStyles]} style={{ paddingLeft: 16, whiteSpace: "nowrap" }}>
                  {row.status}
                </StyledTableCell>
                <StyledTableCell align="left">{formatDate(row.deadline)}</StyledTableCell>
                <StyledTableCell align="left" style={{ paddingLeft: 16, whiteSpace: "nowrap" }}>
                  <IconButton color="primary" onClick={() => handleClickOpenEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleClickOpenDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CustomizedTables;
