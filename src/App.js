import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SpeedySpeller from "./components/SpeedySpeller";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <SpeedySpeller />
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
