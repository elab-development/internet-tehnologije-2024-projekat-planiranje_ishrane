// ListaKupovine.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import shoppingLists from "../Data/ListeZaKupovinu.jsx";
import sastojci from "../Data/Sastojci.jsx";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/ListaKupovine.css";

export default function ListaKupovine() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const id = parseInt(planId, 10);
  const lista = shoppingLists.find(
    (l) => l.planId === id
  );

  if (!lista) {
    console.log(planId);

    return (
      <div className="not-found">
        <h2>Lista kupovine nije pronađena</h2>
        <button onClick={() => navigate(-1)}>Nazad</button>
      </div>
    );
  }

return (
  <>
    <Navigation />
    <div className="lista-kupovine-container">
      <h1>Lista Kupovine za Plan {planId}</h1>

      <ul className="lista-sastojaka">
        {lista.sastojci.map(({ id, kolicina }) => {
          const s = sastojci.find((s) => s.id === id);
          if (!s) return null;
          return (
            <li key={id}>
              {s.naziv} – {kolicina} {s.jedinica}
            </li>
          );
        })}
      </ul>

      <div className="lista-buttons">
        <button
          className="btn-izmeni-listu"
          onClick={() => navigate(`/izmeni-listu/${planId}`)}
        >
          ✏️ Izmeni listu
        </button>
        <button className="btn-nazad" onClick={() => navigate(-1)}>
          Nazad
        </button>
      </div>
    </div>
  </>
);

}
