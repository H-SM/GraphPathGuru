import './App.css';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import GraphState from "./context/Graph/graphState";
import UserState from "./context/User/userState";
import Docpage from "./components/Docpage";
import Settings from "./components/Settings";
import Login from "./components/Login";

function App() {

  return (
    <UserState>
    <GraphState>
    <div className="App">
      <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/docs" element={<Docpage />} />

            <Route exact path="/settings" element={<Settings />} />

            <Route exact path="/login" element={<Login />} />
          </Routes>
      </Router>
    </div>
    </GraphState>
    </UserState>
  );
}

export default App;
