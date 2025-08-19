// IzmeniListu.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import shoppingLists from "../Data/ListeZaKupovinu.jsx";
import sastojci from "../Data/Sastojci.jsx";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/IzmeniListu.css";

export default function IzmeniListu() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const id = parseInt(planId, 10);
  const listaOriginal = shoppingLists.find((l) => l.planId === id);
  const [lista, setLista] = useState([...listaOriginal.sastojci]);
 
  if (!listaOriginal) {
    return (
      <div className="not-found">
        <h2>Lista kupovine nije pronađena</h2>
        <button onClick={() => navigate(-1)}>Nazad</button>
      </div>
    );
  }
  

  const promeniKolicinu = (id, novaKolicina) => {
    setLista((prev) =>
      prev.map((s) => (s.id === id ? { ...s, kolicina: novaKolicina } : s))
    );
  };

  const obrisiSastojak = (id) => {
    setLista((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    console.log("Sačuvana izmenjena lista:", { planId: id, sastojci: lista });
    alert("Lista je sačuvana (samo log trenutno).");
    navigate(-1); 
  };

  return (
    <>
      <Navigation />
      <div className="lista-kupovine-container">
        <h1>Izmeni listu kupovine za plan {planId}</h1>
        <ul className="lista-sastojaka">
          {lista.map(({ id, kolicina }) => {
            const s = sastojci.find((s) => s.id === id);
            if (!s) return null;
            return (
              <li key={id} className="sastojak-red">
                <span>{s.naziv} – </span>
                <input
                  type="number"
                  min="0"
                  value={kolicina}
                  onChange={(e) =>
                    promeniKolicinu(id, parseInt(e.target.value, 10))
                  }
                />{" "}
                <span>{s.jedinica}</span>
                <button
                  className="btn-obrisi"
                  onClick={() => obrisiSastojak(id)}
                >
                  Izbriši
                </button>
              </li>
            );
          })}
        </ul>
        <button className="btn-sacuvaj" onClick={handleSave}>
          Sačuvaj izmene
        </button>
        <button className="btn-nazad" onClick={() => navigate(-1)}>
          Nazad
        </button>
      </div>
    </>
  );
}
