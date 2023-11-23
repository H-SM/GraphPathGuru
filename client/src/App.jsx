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
import Alert from "./components/alert";
import Grapher from './components/Grapher';
import NotFound from './components/NotFound';
import UserProfile from './components/UserProfile';
import ReactFlowProvider from "reactflow";
import { useState } from 'react';

function App() {
const [alert , setAlert ] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  
  return (
    <UserState>
    <GraphState>
    {/* <Alert alert={alert}/> */}
    <div className="App">
    <Alert alert={alert}/>
      <Router>
          <Routes>
            <Route exact path="/" element={<Home showAlert={showAlert}/>} />
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
