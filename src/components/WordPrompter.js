import { useEffect, useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { Button, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stats from "./Stats";
import SmallStats from "./SmallStats";

import { getWordLists } from "../utils/firebase";
import { useAuth } from "../contexts/AuthContext";

import "./WordPrompter.css";

const WordPrompter = () => {
  const msg = new SpeechSynthesisUtterance();

  const { user } = useAuth();
  const spellingAttemptRef = useRef();

  const [wordLists, setWordLists] = useState(null);
  const [currentWordList, setCurrentWordList] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [spellingAttempt, setSpellingAttempt] = useState("");
  const [wordStats, setWordStats] = useState(null);
  const [open, setOpen] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctSpelling, setCorrectSpelling] = useState("");
  const [operation, setOperation] = useState("");

  useEffect(() => {
    (async () => {
      const newWordLists = await getWordLists(user);
      setWordLists(newWordLists);
      setCurrentWordList(newWordLists[0]);
      setOperation("waiting-to-start");
    })();
  }, [user]);

  const getWordFromList = (index) => {
    console.log("currentWordList", currentWordList);
    if (currentWordList) {
      let currentWords = currentWordList.words
        .split(",")
        .map((word) => word.trim());
      if (index <= currentWords.length - 1) {
        return currentWords[index];
      }
    }
    return null;
  };

  useEffect(() => {
    console.log("in currentWordIndex useEffect");
    if (operation === "started") {
      if (currentWordIndex !== -1 && currentWordList) {
        console.log("got here");
        let word = getWordFromList(currentWordIndex);
        console.log("word: ", word);
        if (word) {
          msg.text = word;
          console.log("speaking word: ", word);
          window.speechSynthesis.speak(msg);
        }
      }
    }
  }, [currentWordIndex]);

  const handleChange = (event) => {
    const selectedWordList = wordLists.find(
      (wordList) => wordList.id === event.target.value
    );

    if (selectedWordList) {
      setCurrentWordList(selectedWordList);
      setCurrentWordIndex(-1);
      setOperation("waiting-to-start");
    }
  };

  const setupWordStats = () => {
    let currentWords = currentWordList.words
      .split(",")
      .map((word) => word.trim());
    let newWordStats = [];
    for (let i = 0; i < currentWords.length; i++) {
      newWordStats.push({
        word: currentWords[i],
        correct: false,
        incorrect: 0,
        numberOfAttempts: 0,
        incorrectAttempts: [],
      });
    }
    setWordStats(newWordStats);
  };

  const handleStartClick = () => {
    console.log("handleStartClick");
    console.log("currentWordList", currentWordList);
    console.log("currentWordIndex", currentWordIndex);
    setOperation("started");
    setCurrentWordIndex(0);
    setSpellingAttempt("");
    setupWordStats();
  };

  const updateWordStats = (spellingAttempt, word) => {
    console.log("spellingAttempt: !" + spellingAttempt + "!");
    console.log("word: !" + word + "!");
    console.log(spellingAttempt, word);
    let newWordStats = [...wordStats];
    let wordStat = newWordStats.find((wordStat) => {
      return wordStat.word.toLowerCase() === word.toLowerCase();
    });
    if (wordStat) {
      if (spellingAttempt.toLowerCase() !== word.toLowerCase()) {
        wordStat.incorrect++;
        wordStat.incorrectAttempts.push(spellingAttempt);
      } else {
        wordStat.correct = true;
      }
      wordStat.numberOfAttempts++;
      setWordStats(newWordStats);
    }
  };

  const allWordsCorrect = () => {
    let allCorrect = true;
    for (let i = 0; i < wordStats.length; i++) {
      if (!wordStats[i].correct) {
        allCorrect = false;
        break;
      }
    }
    return allCorrect;
  };

  const getNextIncorrectWordIndex = (wordStats, currentWordIndex) => {
    let nextIncorrectIndex = -1;
    for (let i = currentWordIndex + 1; i < wordStats.length; i++) {
      if (!wordStats[i].correct) {
        nextIncorrectIndex = i;
        break;
      }
    }
    if (nextIncorrectIndex === -1) {
      for (let i = 0; i < currentWordIndex; i++) {
        if (!wordStats[i].correct) {
          nextIncorrectIndex = i;
          break;
        }
      }
    }
    return nextIncorrectIndex;
  };

  const handleNextClick = () => {
    const attemptedWord = getWordFromList(currentWordIndex);
    setCorrectSpelling(attemptedWord);
    updateWordStats(spellingAttempt, attemptedWord);
    if (spellingAttempt.toLowerCase() === attemptedWord.toLowerCase()) {
      setCorrect(true);
      setOpen(true);
    } else {
      setCorrect(false);
      setOpen(true);
    }

    if (allWordsCorrect()) {
      setOperation("finished");
    }

    const nextIncorrectIndex = getNextIncorrectWordIndex(
      wordStats,
      currentWordIndex
    );
    setCurrentWordIndex(nextIncorrectIndex);
    setSpellingAttempt("");
    spellingAttemptRef.current.focus();
  };

  const handleRepeatClick = () => {
    let word = getWordFromList(currentWordIndex);
    if (word) {
      msg.text = word;
      window.speechSynthesis.speak(msg);
      spellingAttemptRef.current.focus();
    }
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSpellingAttemptChange = (event) => {
    setSpellingAttempt(event.target.value);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div>
          <Alert onClose={handleClose} severity={correct ? "success" : "error"}>
            {correct
              ? "Correct!"
              : 'Incorrect! The correct spelling is "' + correctSpelling + '"'}
          </Alert>
        </div>
      </Snackbar>
      {currentWordList && (
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="word-list-label">Word List</InputLabel>
            <Select
              labelId="word-list-label"
              id="word-list-select"
              value={currentWordList.id}
              label="Word List"
              onChange={handleChange}
            >
              <MenuItem value=""></MenuItem>
              {wordLists.map((wordList) => {
                return (
                  <MenuItem key={wordList.id} value={wordList.id}>
                    {wordList.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {operation === "waiting-to-start" && (
            <>
              <TextField
                label="Words"
                multiline
                rows={4}
                value={currentWordList.words}
                variant="outlined"
                style={{
                  marginTop: "20px",
                  width: "100%",
                }}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  style={{ marginTop: "20px" }}
                  onClick={handleStartClick}
                >
                  Start
                </Button>
              </div>
            </>
          )}
          {operation === "started" && (
            <>
              <TextField
                label="Spelling Attempt"
                value={spellingAttempt}
                inputRef={spellingAttemptRef}
                autoFocus
                onChange={handleSpellingAttemptChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleNextClick();
                  }
                }}
                variant="outlined"
                style={{
                  marginTop: "20px",
                  width: "100%",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                <SmallStats wordStats={wordStats} />
                <div display="flex">
                  <Button
                    variant="contained"
                    style={{ marginRight: "10px" }}
                    onClick={handleRepeatClick}
                  >
                    Repeat
                  </Button>
                  <Button variant="contained" onClick={handleNextClick}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
          {operation === "finished" && (
            <>
              <Stats wordStats={wordStats} />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  style={{ marginTop: "20px" }}
                  onClick={() => {
                    setOperation("waiting-to-start");
                  }}
                >
                  Restart
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default WordPrompter;
