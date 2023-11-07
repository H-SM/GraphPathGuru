import Home from "./components/Home"
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Docpage from "./components/Docpage";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/docs" element={<Docpage />} />

            <Route exact path="/settings" element={<Settings />} />

            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup/>} />
          </Routes>
      </Router>

    </>
  );
}

export default App;
