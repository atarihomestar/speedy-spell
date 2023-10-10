import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
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
  const [spelling, setSpelling] = useState("");
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
          setSpelling("");
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

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "Enter" || key === "Return") {
      setStatus("showing_results");
      if (spelling === words[currentWordIndex]) {
        setMessage("Correct!");
      } else {
        setMessage(`Incorrect! ${words[currentWordIndex]} NOT ${spelling}`);
      }
      updateWordStats(
        words[currentWordIndex],
        spelling === words[currentWordIndex]
      );
    }

    if (key === "Backspace") {
      setSpelling(spelling.slice(0, -1));
    }

    if (/^[A-Za-z]$/.test(key)) {
      setSpelling(spelling + key);
    }
  };

  const mainButtonClick = () => {
    if (started) {
      setCurrentWordIndex((prevIndex) => {
        if (prevIndex < words.length - 1) {
          //setWord(words[prevIndex + 1]);
          return prevIndex + 1;
        } else {
          return 0;
        }
      });
    } else {
      setStarted(true);
    }
    showWord();
  };

  const repeatClick = () => {
    showWord();
  };

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
            height: "100px",
            justifyContent: "space-between",
          }}
        >
          <TextField
            id="spelling"
            label="Spelling"
            variant="outlined"
            value={spelling}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
          />
          <Button
            style={{ maxWidth: "200px", margin: "0 auto" }}
            variant="contained"
            onClick={repeatClick}
          >
            Repeat
          </Button>
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
