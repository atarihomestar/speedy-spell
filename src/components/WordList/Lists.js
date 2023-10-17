import React from "react";
import WordLists from "./WordLists";

function Lists() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "500px", // added width property
        margin: "0 auto", // added margin property
      }}
    >
      <WordLists></WordLists>
    </div>
  );
}

export default Lists;
