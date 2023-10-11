import React from "react";
import WordPrompter from "./WordPrompter";
import { AppBar, Toolbar, Typography } from "@mui/material";

const App = () => {
  const wordList = ["apple", "banana"];

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ backgroundColor: "green" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Speedy Speller
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <WordPrompter words={wordList} />
      </div>
    </>
  );
};

export default App;
