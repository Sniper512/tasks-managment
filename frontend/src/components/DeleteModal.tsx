import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  taskName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onDelete,
  taskName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          fontFamily: "Roboto, sans-serif", // Consistent font family
          fontWeight: "bold", // Optional: bold title for emphasis
        }}
      >
        Confirm Deletion
      </DialogTitle>
      <DialogContent
        sx={{
          fontFamily: "Roboto, sans-serif", 
          fontSize: "16px",
        }}
      >
        <Typography variant="body1">
          Are you sure you want to delete the task "{taskName}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            fontFamily: "Roboto, sans-serif", 
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          color="error"
          sx={{
            fontFamily: "Roboto, sans-serif", 
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
