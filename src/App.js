import React, { useState } from "react";
import WordPrompter from "./WordPrompter";

const App = () => {
  const wordList = ["apple", "banana", "orange", "pear", "grape"];

  return (
    <div>
      <WordPrompter words={wordList} />
    </div>
  );
};

export default App;
