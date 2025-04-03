import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { Home } from "./components/Home";
import { Profiles } from "./components/Profiles";
import { ViewProfile } from "./components/ViewProfile";
import { AddProfile } from "./components/AddProfile";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <>
  
      <Router>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/addProfile" element={<AddProfile />} />
          <Route path="/viewProfile/:email" element={<ViewProfile />} /> 
        </Routes>
      </Router>
    </>
  );
}

export default App;
