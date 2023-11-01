import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { Button, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stats from "./Stats";
import SmallStats from "./SmallStats";

import { getWordLists } from "../utils/firebase";
import DisplayWordTemporarily from "./DisplayWordTemporarily";
import { useAuth } from "../contexts/AuthContext";
import "./WordPrompter.css";

import { green, orange, red } from "./styles/colors";

const WordPrompter = () => {
  const msg = useMemo(() => new SpeechSynthesisUtterance(), []);

  const { user } = useAuth();
  const spellingAttemptRef = useRef();

  const [wordLists, setWordLists] = useState(null);
  const [currentWordListIndex, setCurrentWordListIndex] = useState(0);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spellingAttempt, setSpellingAttempt] = useState("");
  const [wordStats, setWordStats] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [operation, setOperation] = useState("");
  const [message, setMessage] = useState("");
  const [showWord, setShowWord] = useState(false);

  const sayNextWord = useCallback(() => {
    const nextIncorrectIndex = getNextIncorrectWordIndex(
      wordStats,
      currentWordIndex
    );
    setSpellingAttempt("");
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

  const doneShowingWord = () => {
    setShowWord(false);
    setTimeout(() => {
      spellingAttemptRef.current?.focus();
    }, 0);
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
    setMessage("");
    setOperation("starting");
    setupWordStats();
  };

  const handleShowClick = () => {
    setSpellingAttempt("");
    setShowWord(true);
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
      setTimeout(() => {}, 3000);
    }
    return allCorrect;
  };

  const getNextIncorrectWordIndex = (wordStats, currentWordIndex) => {
    let nextIncorrectIndex = -1;
    // checking for incorrect words after current word
    for (let i = currentWordIndex + 1; i < wordStats.length; i++) {
      if (!wordStats[i].correct) {
        nextIncorrectIndex = i;
        break;
      }
    }
    // checking for incorrect words before current word
    if (nextIncorrectIndex === -1) {
      for (let i = 0; i < wordStats.length; i++) {
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
    if (spellingAttempt !== "") {
      const attemptedWord = wordStats[currentWordIndex].word;
      updateWordStats(spellingAttempt, attemptedWord);
      if (spellingAttempt.toLowerCase() === attemptedWord.toLowerCase()) {
        setCorrect(true);
        setMessage("Correct!");
        if (allWordsCorrect()) {
          setOperation("finished");
        } else {
          sayNextWord();
        }
      } else {
        spellingAttemptRef.current?.select();
        setCorrect(false);
        setMessage(`Incorrect! The correct spelling is "${attemptedWord}"`);
        sayNextWord();
      }
    }
  };

  const handleRepeatClick = () => {
    setSpellingAttempt("");
    setMessage("");
    let word = wordStats[currentWordIndex].word;
    if (word) {
      msg.text = word;
      window.speechSynthesis.speak(msg);
      spellingAttemptRef.current?.focus();
    }
  };

  const handleSpellingAttemptChange = (event) => {
    setMessage("");
    setSpellingAttempt(event.target.value);
  };

  const numberOfPasses = () => {
    return wordStats.reduce((acc, wordStat) => {
      return wordStat.numberOfAttempts > acc ? wordStat.numberOfAttempts : acc;
    }, 0);
  };

  const finalMessage = () => {
    const passes = numberOfPasses();
    return (
      <p style={{ marginBottom: "0px" }}>
        {passes === 1 ? (
          <span>
            You got<span style={{ color: green }}> all </span>the words correct
            on your first pass! Wow!
          </span>
        ) : passes <= 3 ? (
          <span>
            It took you only <span style={{ color: orange }}>{passes}</span>{" "}
            passes to get all the words correct. Keep trying! You can do it!
          </span>
        ) : (
          <span>
            It took you <span style={{ color: red }}>{passes}</span> passes to
            get all the words correct. Study more and try again!
          </span>
        )}
      </p>
    );
  };

  return (
    <>
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
                  disabled={showWord}
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
                  autoComplete="off"
                  onInput={(e) => {
                    handleSpellingAttemptChange(e);
                  }}
                  variant="outlined"
                  style={{
                    marginTop: "20px",
                    width: "100%",
                  }}
                  disabled={showWord}
                />
                <div
                  style={{
                    marginTop: "18px",
                    backgroundColor: showWord
                      ? orange
                      : message === ""
                      ? "white"
                      : correct
                      ? green
                      : red,
                    fontSize: "15px",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    minHeight: "24px",
                  }}
                >
                  {showWord === true ? (
                    <DisplayWordTemporarily
                      word={wordStats[currentWordIndex].word}
                      doneShowingWord={doneShowingWord}
                    />
                  ) : (
                    !showWord &&
                    message !== "" && (
                      <>
                        {correct ? (
                          <CheckCircleOutlineIcon
                            style={{ marginRight: "10px" }}
                          />
                        ) : (
                          <ErrorOutlineIcon style={{ marginRight: "10px" }} />
                        )}
                        {message}
                      </>
                    )
                  )}
                </div>
              </form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "19px",
                  width: "100%",
                }}
              >
                <SmallStats wordStats={wordStats} />
                <div display="flex">
                  <Button
                    variant="contained"
                    onClick={handleShowClick}
                    disabled={showWord}
                  >
                    Show
                  </Button>
                  <Button
                    variant="contained"
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                    onClick={handleRepeatClick}
                    disabled={showWord}
                  >
                    Repeat
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCheckClick}
                    disabled={showWord}
                  >
                    Check
                  </Button>
                </div>
              </div>
            </>
          )}
          {operation === "finished" && (
            <>
              {finalMessage()}
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
