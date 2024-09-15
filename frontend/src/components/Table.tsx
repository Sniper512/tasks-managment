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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import AddModal from "./AddModal";
import EditModal from "./EditModaal"; // Fixed import
import DeleteModal from "./DeleteModal";

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
    color: "white",
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
  _id: string;
  task_id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  deadline: string;
}

function CustomizedTables() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [rows, setRows] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/task");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [rows]);

  const handleClickOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleAdd = async (newTask: Task) => {
    try {
      const response = await fetch("http://localhost:8800/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setRows((prev) => [...prev, newTask]);
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Fetch error:", error);
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

  const handleSaveEdit =async (updatedTask: Task) => {
    try{
      const response = await fetch(`http://localhost:8800/api/task/${updatedTask._id}`,{
        method:"PUT",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify(updatedTask)
      })
      if(response.ok){
        setRows((prev) =>
        prev.map((task) =>
        task.task_id === updatedTask.task_id ? updatedTask : task
        ))
      }
      else{
        console.error("Unable to Update Data ");
      }
    }
    catch(error){
      console.error("Fetch error ",error);
    }

     handleCloseEdit();
  };
  const formatDate = (isoDate:string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const handleClickOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8800/api/task/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRows((prev) => prev.filter((task) => task.task_id !== id));
        handleCloseDelete();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
              <StyledTableRow key={row.task_id}>
                <StyledTableCell
                  align="left"
                  style={{ paddingLeft: 16 }}
                  component="th"
                  scope="row"
                >
                  {row.task_id}
                </StyledTableCell>
                <StyledTableCell align="left">{row.title}</StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={{ maxWidth: 300, minWidth: 250 }}
                >
                  {row.description}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={
                    PriorityStyles[row.priority as keyof typeof PriorityStyles]
                  }
                >
                  {row.priority}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={statusStyles[row.status as keyof typeof statusStyles]}
                >
                  {row.status}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {formatDate(row.deadline)}
                </StyledTableCell>
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
