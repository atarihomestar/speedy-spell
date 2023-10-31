import React, { useEffect, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DisplayWordTemporarily = ({ word, doneShowingWord }) => {
  const [display, setDisplay] = useState(`The word is "${word}"`);
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 0) {
        doneShowingWord();
      }
      if (count <= 3) {
        setDisplay(count);
      }
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [count, doneShowingWord]);

  return (
    <>
      <WarningAmberIcon style={{ marginRight: "10px" }} />
      {display}
    </>
  );
};

export default DisplayWordTemporarily;
