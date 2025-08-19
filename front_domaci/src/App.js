import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SviRecepti from "./Pages/SviRecepti";
import DetaljiRecepta from "./Pages/DetaljiRecepta";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/recepti" element={<SviRecepti/>}/>
          <Route path="/recepti/:id" element={<DetaljiRecepta/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
