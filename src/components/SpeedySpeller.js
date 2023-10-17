import MyAppBar from "./MyAppBar";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Lists from "./WordList/Lists";
import Signup from "./Signup";
import NotFound from "./NotFound";

import { Routes, Route } from "react-router-dom";

const SpeedySpeller = () => {
  return (
    <>
      <MyAppBar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default SpeedySpeller;
