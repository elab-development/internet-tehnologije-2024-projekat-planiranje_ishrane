// MojeListe.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import shoppingLists from "../Data/ListeZaKupovinu.jsx";
import "../Styles/MojeListe.css";
import Navigation from "../Components/Navigation.jsx";

export default function MojeListe() {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className="sve-liste-container">
        <h1>Sve Liste Kupovine</h1>
        <ul className="liste">
          {shoppingLists.map((lista) => (
            <li
              key={lista.planId}
              className="lista-item"
              onClick={() => navigate(`/lista-kupovine/${lista.planId}`)}
            >
              <span>Lista za plan: {lista.planId}</span>
              <span className="arrow">➡️</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
