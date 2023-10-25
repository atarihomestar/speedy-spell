import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const msg = useMemo(() => new SpeechSynthesisUtterance(), []);

  const { user } = useAuth();
  const spellingAttemptRef = useRef();

  const [wordLists, setWordLists] = useState(null);
  const [currentWordListIndex, setCurrentWordListIndex] = useState(0);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spellingAttempt, setSpellingAttempt] = useState("");
  const [wordStats, setWordStats] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctSpelling, setCorrectSpelling] = useState("");
  const [operation, setOperation] = useState("");

  useEffect(() => {
    if (!snackbarOpen && !correct) {
      spellingAttemptRef.current?.focus();
    }
  }, [snackbarOpen, correct]);

  const sayNextWord = useCallback(() => {
    const nextIncorrectIndex = getNextIncorrectWordIndex(
      wordStats,
      currentWordIndex
    );
    setSpellingAttempt("");
    console.log("spellingAttemptRef", spellingAttemptRef);
    spellingAttemptRef.current?.focus();
    setCurrentWordIndex(nextIncorrectIndex);
    msg.text = wordStats[nextIncorrectIndex].word;
    window.speechSynthesis.speak(msg);
  }, [
    wordStats,
    currentWordIndex,
    setSpellingAttempt,
    setCurrentWordIndex,
    msg,
    spellingAttemptRef,
  ]);

  useEffect(() => {
    if (wordStats && operation === "starting") {
      sayNextWord();
      setOperation("started");
    }
  }, [wordStats, operation, sayNextWord]);

  useEffect(() => {
    (async () => {
      const newWordLists = await getWordLists(user);
      setWordLists(newWordLists);
      setCurrentWordListIndex(0);
      setOperation("waiting-to-start");
    })();
  }, [user]);

  const handleWordListChange = (event) => {
    const selectedWordListIndex = wordLists.findIndex(
      (wordList) => wordList.id === event.target.value
    );
    if (selectedWordListIndex >= 0) {
      setCurrentWordListIndex(selectedWordListIndex);
      setCurrentWordIndex(0);

      setOperation("waiting-to-start");
    }
  };

  const setupWordStats = () => {
    let currentWords = wordLists[currentWordListIndex].words
      .split(",")
      .map((word) => word.trim())
      .sort(() => Math.random() - 0.5);

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
    setOperation("starting");
    setupWordStats();
  };

  const updateWordStats = (spellingAttempt, word) => {
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
    if (allCorrect) {
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
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

  const handleCheckClick = (event) => {
    event.preventDefault();
    console.log("spellingAttempt", spellingAttempt);
    if (spellingAttempt !== "") {
      const attemptedWord = wordStats[currentWordIndex].word;
      setCorrectSpelling(attemptedWord);
      updateWordStats(spellingAttempt, attemptedWord);
      if (spellingAttempt.toLowerCase() === attemptedWord.toLowerCase()) {
        setCorrect(true);
        if (allWordsCorrect()) {
          setOperation("finished");
        } else {
          sayNextWord();
        }
      } else {
        setCorrect(false);
      }
      setSnackbarOpen(true);
    }
  };

  const handleRepeatClick = () => {
    let word = wordStats[currentWordIndex].word;
    if (word) {
      msg.text = word;
      window.speechSynthesis.speak(msg);
      spellingAttemptRef.current?.focus();
    }
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    if (!correct) {
      sayNextWord();
    }
  };

  const handleSpellingAttemptChange = (event) => {
    console.log("handleSpellingAttemptChange", event.target.value);
    setSpellingAttempt(event.target.value);
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        sx={{ height: "70%" }}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div>
          <Alert
            onClose={handleSnackbarClose}
            severity={correct ? "success" : "error"}
          >
            {correct
              ? "Correct!"
              : 'Incorrect! The correct spelling is "' + correctSpelling + '"'}
          </Alert>
        </div>
      </Snackbar>
      {wordLists && (
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
              value={wordLists[currentWordListIndex].id}
              label="Word List"
              onChange={handleWordListChange}
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
                value={wordLists[currentWordListIndex].words}
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
              <form onSubmit={handleCheckClick} style={{ width: "100%" }}>
                <TextField
                  label="Spelling Attempt"
                  value={spellingAttempt}
                  inputRef={spellingAttemptRef}
                  autoFocus
                  onInput={(e) => {
                    handleSpellingAttemptChange(e);
                    setSnackbarOpen(false);
                  }}
                  variant="outlined"
                  style={{
                    marginTop: "20px",
                    width: "100%",
                  }}
                  disabled={snackbarOpen && !correct}
                />
              </form>
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
                  <Button variant="contained" onClick={handleCheckClick}>
                    Check
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
