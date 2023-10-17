import React from "react";

import WordPrompter from "./WordPrompter";
import Lists from "./WordList/Lists";
import { useAppState } from "../contexts/AppStateContext";

function Dashboard() {
  const { selectedItem } = useAppState();

  return (
    <div>
      {selectedItem === "WordPrompter" && <WordPrompter />}
      {selectedItem === "Lists" && <Lists />}
    </div>
  );
}

export default Dashboard;
