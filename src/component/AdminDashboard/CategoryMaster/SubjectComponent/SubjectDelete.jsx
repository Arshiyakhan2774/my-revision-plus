import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const SubjectDelete = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-500">Delete Teacher</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this teacher?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={onDelete} color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubjectDelete