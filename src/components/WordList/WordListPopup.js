import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { saveWordList } from "../../utils/firebase";

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

  const handleAddUpdateClick = () => {
    console.log("datata: ", data?.id, data?.uid, newName, newWords);
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
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button onClick={handleAddUpdateClick}>{add ? "Add" : "Update"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WordListPopup;
