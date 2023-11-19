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
import Grapher from './components/Grapher';
import NotFound from './components/NotFound';
import UserProfile from './components/UserProfile';

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
            <Route exact path="/graph/:id" element={<Grapher />} />
            <Route exact path="/user" element={<UserProfile />} />

            <Route path='*' element={<NotFound/>}/>
          </Routes>
      </Router>
    </div>
    </GraphState>
    </UserState>
  );
}

export default App;
