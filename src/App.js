import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppStateProvider } from "./contexts/AppStateContext";
import SpeedySpeller from "./components/SpeedySpeller";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <AppStateProvider>
            <SpeedySpeller />
          </AppStateProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

export default App;
