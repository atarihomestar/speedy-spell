import MyAppBar from "./MyAppBar";
import WordPrompter from "../WordPrompter";
import Login from "./Login";
import Signup from "./Signup";
import NotFound from "./NotFound";
import PrivateRoute from "./PrivateRoute";

import { Routes, Route } from "react-router-dom";

const SpeedySpeller = () => {
  const wordList = ["apple", "banana"];

  return (
    <>
      <MyAppBar />
      <Routes>
        <Route exact path="/" element={<WordPrompter words={wordList} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default SpeedySpeller;
