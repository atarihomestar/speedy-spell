import { useState } from "react";
import { Button, TextField } from "@mui/material";
import Stats from "./Stats";
import SmallStats from "./SmallStats";

import "./WordPrompter.css";

const WordPrompter = ({ words }) => {
  const [wordStats, setWordStats] = useState(
    words.map((word) => {
      return { word: word, attempts: 0, correct: false };
    })
  );
  const [status, setStatus] = useState("waiting_to_start");
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [attemptedSpelling, setAttemptedSpelling] = useState("");
  const [message, setMessage] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const updateWordStats = (word, spelledCorrectly) => {
    const wordIndex = wordStats.findIndex(
      (item) => item.word === words[currentWordIndex]
    );
    const updatedWordStats = [...wordStats];
    updatedWordStats[wordIndex].attempts += 1;
    updatedWordStats[wordIndex].correct = spelledCorrectly;
    setWordStats(updatedWordStats);
  };

  function resetWordStats() {
    const newWordStats = wordStats.map((wordStat) => {
      return {
        ...wordStat,
        attempts: 0,
        correct: false,
      };
    });

    setWordStats(newWordStats);
  }

  const showCountdown = () => {
    setStatus("showing_countdown");
    setCountdown(5);

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          return prevCountdown - 1;
        } else {
          clearInterval(intervalId);
          setStatus("waiting_for_spelling");
          setAttemptedSpelling("");
          return 0;
        }
      });
    }, 1000);
  };

  const showWord = () => {
    setStatus("showing_word");
    const timeoutId = setTimeout(() => {
      showCountdown();
      clearTimeout(timeoutId);
    }, 3000);
  };

  const showResults = () => {
    setStatus("showing_results");
    if (attemptedSpelling === words[currentWordIndex]) {
      setMessage("Correct!");
    } else {
      setMessage(
        `Incorrect! ${words[currentWordIndex]} NOT ${attemptedSpelling}`
      );
    }
    updateWordStats(
      words[currentWordIndex],
      attemptedSpelling === words[currentWordIndex]
    );
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "Enter" || key === "Return") {
      showResults();
    }

    if (key === "Backspace") {
      setAttemptedSpelling(attemptedSpelling.slice(0, -1));
    }

    if (/^[A-Za-z]$/.test(key)) {
      setAttemptedSpelling(attemptedSpelling + key);
    }
  };

  const getNextIncorrectWordIndex = (startingIndex) => {
    const wordsLength = wordStats.length;
    for (let i = 1; i <= wordsLength; i++) {
      const nextIndex = (startingIndex + i) % wordsLength;
      const nextObject = wordStats[nextIndex];
      if (!nextObject.correct) {
        return nextIndex;
      }
    }
    return -1;
  };

  const mainButtonClick = () => {
    if (started) {
      setCurrentWordIndex((prevIndex) => {
        return getNextIncorrectWordIndex(prevIndex);
      });
    } else {
      setStarted(true);
    }
    showWord();
  };

  const resetClick = () => {
    resetWordStats();
    setCurrentWordIndex(0);
    showWord();
  };

  const repeatClick = () => {
    showWord();
  };

  const passes = () => {
    return Math.max(...wordStats.map((word) => word.attempts));
  };

  if (currentWordIndex === -1) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: "0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center", // Center the text horizontally
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <p>
              It took just <span style={{ fontSize: "36px" }}>{passes()}</span>{" "}
              {passes() === 1 ? "pass " : "passes "}
              to get all the words correct!
            </p>
            <Stats wordStats={wordStats} />
          </div>
          <Button variant="contained" onClick={resetClick}>
            Reset
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {status === "showing_word" && (
        <p className="text">{words[currentWordIndex]}</p>
      )}
      {status === "showing_countdown" && <p className="text">{countdown}</p>}
      {status === "waiting_for_spelling" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            fontSize: "24px",
            height: "140px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <SmallStats wordStats={wordStats} />
          </div>
          <TextField
            id="spelling"
            label="Spelling"
            variant="outlined"
            value={attemptedSpelling}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={repeatClick}>
              Repeat
            </Button>
            <Button
              variant="contained"
              onClick={showResults}
              style={{ width: "97px" }}
            >
              Check
            </Button>
          </div>
        </div>
      )}
      {status === "showing_results" && (
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          <p>{message}</p>
          <Button variant="contained" onClick={mainButtonClick}>
            Next Word
          </Button>
        </div>
      )}
      {["waiting_to_start"].includes(status) && (
        <Button variant="contained" onClick={mainButtonClick}>
          {started ? "Next Word" : "Start"}
        </Button>
      )}
    </div>
  );
};

export default WordPrompter;
