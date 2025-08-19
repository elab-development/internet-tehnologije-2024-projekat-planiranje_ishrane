import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SviRecepti from "./Pages/SviRecepti";
import DetaljiRecepta from "./Pages/DetaljiRecepta";
import SviSastojci from "./Pages/SviSastojci";
import DodajSastojak from "./Pages/DodajSastojak";
import DodajRecept from "./Pages/DodajRecept";
import MojiPlanovi from "./Pages/MojiPlanovi";
import DetaljiPlana from "./Pages/DetaljiPlana";
import ListaKupovine from "./Pages/ListaKupovine";
import IzmeniListu from "./Pages/IzmeniListu";
import MojeListe from "./Pages/MojeListe";
import KreirajPlan from "./Pages/KreirajPlan";
import Omiljeni from "./Pages/Omiljeni";
import FoodSearch from "./Pages/FoodSearch";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/recepti" element={<SviRecepti/>}/>
          <Route path="/recepti/:id" element={<DetaljiRecepta/>}/>
          <Route path="/sastojci" element={<SviSastojci/>}/>
          <Route path="/dodaj-sastojak" element={<DodajSastojak/>}/>
            <Route path="/dodaj-recept" element={<DodajRecept/>}/>
          <Route path="/planovi" element={<MojiPlanovi/>}/>
          <Route path="/plan/:id" element={<DetaljiPlana/>}/>
          <Route path="/lista-kupovine/:planId" element={<ListaKupovine/>}/>
          <Route path="/izmeni-listu/:planId" element={<IzmeniListu/>}/>
          <Route path="/moje-liste" element={<MojeListe/>}/>
          <Route path="/kreiraj-plan" element={<KreirajPlan/>}/>
          <Route path="/omiljeni" element={<Omiljeni/>}/>
          <Route path="/javni-api" element={<FoodSearch/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
