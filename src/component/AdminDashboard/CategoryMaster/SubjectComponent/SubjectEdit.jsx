import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { useGetCategoryListQuery } from "../../../Services/CategoryMasterApi/CategoryApi";

const SubjectEdit= ({ open, onClose, categories, selectedSubject, selectedBoard,setSelectedBoard,onSave }) => {
  const [subjectName, setSubjectName] = useState('');
  const [boardID, setBoardID] = useState('');
  const { data, error, isLoading } = useGetCategoryListQuery();

  
  useEffect(() => {
    if (selectedSubject) {
      setSubjectName(selectedSubject.subject_name);
      setBoardID(selectedSubject.board_info.board_id);
    }
  }, [selectedSubject]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const boards = data?.data?.boards ?? [];
  const handleSave = () => {
    onSave(selectedSubject.subject_id, boardID, subjectName);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          gap: "10px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="board-label">Select Board</InputLabel>
              {/* <Select
                labelId="board-label"
                id="boardID"
                value={boardID}
                onChange={(e) => setBoardID(e.target.value)}
                sx={{ height: '35px', marginTop: '8px' }}
              >
                {categories.map(option => (
                  <MenuItem key={option.board_id} value={option.board_id}>
                    {option.board_name}
                  </MenuItem>
                ))}
              </Select> */}
              <Select
        label="Board"
        id="board_id"
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
      >
        {boards.map((board) => (
          <MenuItem key={board._id} value={board._id}>
            {board.board_prog_name}
          </MenuItem>
        ))}
      </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subject"
              id="subjectName"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              InputProps={{ style: { height: 'auto' } }}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
        <Box mt={2} className="flex flex-row justify-between">
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: "white",
              background: "linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              color: "white",
              marginLeft: 2,
              background: "linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important",
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};


export default SubjectEdit