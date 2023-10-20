import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { saveWordList, deleteWordList } from "../../utils/firebase";

const WordListPopup = ({ add, setShowPopup, data, updateWordLists }) => {
  const [newName, setNewName] = useState(data?.name);
  const [newWords, setNewWords] = useState(data?.words);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleWordsChange = (event) => {
    setNewWords(event.target.value);
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const handleDeleteClick = () => {
    deleteWordList(data.id);
    updateWordLists();
    setShowPopup(false);
  };

  const handleAddUpdateClick = () => {
    saveWordList(add ? null : data?.id, data?.uid, newName, newWords);
    updateWordLists();
    setShowPopup(false);
  };

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle>{add ? "Add " : "Update "} Word List</DialogTitle>
      <DialogContent dividers>
        <TextField
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { color: "rgba(0, 0, 0, 0.54)" } }}
          fullWidth
          label="Name"
          value={newName}
          onChange={handleNameChange}
          variant="outlined"
        />
        <TextField
          sx={{ marginTop: "20px" }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { color: "rgba(0, 0, 0, 0.54)" } }}
          fullWidth
          label="Words"
          value={newWords}
          onChange={handleWordsChange}
          variant="outlined"
          multiline
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: add ? "flex-end" : "space-between",
        }}
      >
        {add ? null : (
          <IconButton onClick={handleDeleteClick} sx={{ marginLeft: 0 }}>
            <DeleteIcon />
          </IconButton>
        )}
        <div>
          <Button onClick={handleCancelClick}>Cancel</Button>
          <Button
            onClick={handleAddUpdateClick}
            disabled={!newName || !newWords}
          >
            {add ? "Add" : "Update"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default WordListPopup;
