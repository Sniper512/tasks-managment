import { useState } from "react";
import {Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddModal from "./AddModal";
import EditModal from "./EditModaal";
import DeleteModal from "./DeleteModal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
    fontWeight: "bold",
    padding: theme.spacing(2,1),
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
    fontFamily: "Roboto, sans-serif", // Consistent font family
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
  ToDo: {
    backgroundColor: "red",
    color: "white",
    fontWeight: "bold",
  },
  InProgress: {
    backgroundColor: "orange",
    color: "white",
    fontWeight: "bold",
  },
  Done: {
    backgroundColor: "green",
    color: "white",
    fontWeight: "bold",
  },
};

const PriorityStyles = {
  Urgent: {
    backgroundColor: "red",
    color: "white", // Ensure the text is visible against the background
    fontWeight: "bold",
  },
  "Not Urgent": {
    backgroundColor: "green",
    color: "white",
    fontWeight: "bold",
  },
  // Add other priorities as needed
};

interface Task {
  TaskId: string;
  Title: string;
  Description: string;
  Priority: string;
  Status: string;
  Deadline: string;
}

const initialRows: Task[] = [
  {
    TaskId: "1",
    Title: "HSNI",
    Description: "something will come",
    Priority: "Urgent",
    Status: "ToDo",
    Deadline: "9/13/2024", // please provide MM/DD/YYYY if hardcoded
  },
];

function CustomizedTables() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [rows, setRows] = useState<Task[]>(initialRows);

  const handleClickOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleAdd = (newTask: Task) => {
    setRows((prev) => [...prev, newTask]);
  };

  const handleClickOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setTaskToEdit(null);
  };

  const handleSaveEdit = (updatedTask: Task) => {
    setRows((prev) =>
      prev.map((task) =>
        task.TaskId === updatedTask.TaskId ? updatedTask : task
      )
    );
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

  const handleDelete = () => {
    if (taskToDelete) {
      setRows((prev) =>
        prev.filter((task) => task.TaskId !== taskToDelete.TaskId)
      );
      handleCloseDelete();
    }
  };

  return (
    <>
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

      <AddModal
        open={openAddModal}
        onClose={handleCloseAdd}
        onAdd={handleAdd}
      />
      <EditModal
        open={openEditModal}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        taskToEdit={taskToEdit || ({} as Task)}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
        taskName={taskToDelete?.Title || ""}
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
              <StyledTableRow key={row.TaskId}>
                <StyledTableCell
                  align="left"
                  style={{ paddingLeft: 16 }}
                  component="th"
                  scope="row"
                >
                  {row.TaskId}
                </StyledTableCell>
                <StyledTableCell align="left">{row.Title}</StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={{ maxWidth: 300, minWidth: 250 }}
                >
                  {row.Description}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={PriorityStyles[row.Priority as keyof typeof PriorityStyles]}
                >
                  {row.Priority}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={statusStyles[row.Status as keyof typeof statusStyles]}
                >
                  {row.Status}
                </StyledTableCell>
                <StyledTableCell align="left">{row.Deadline}</StyledTableCell>
                <StyledTableCell align="left">
                  <IconButton
                    color="primary"
                    onClick={() => handleClickOpenEdit(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleClickOpenDelete(row)}
                  >
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
