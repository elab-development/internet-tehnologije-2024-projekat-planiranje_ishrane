// KreirajPlan.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import recepti from "../Data/Recepti.jsx"; 
import sastojci from "../Data/Sastojci.jsx"; 
import "../Styles/KreirajPlan.css";
import Navigation from "../Components/Navigation.jsx";

export default function KreirajPlan() {
  const navigate = useNavigate();

  const [naziv, setNaziv] = useState("");
  const [pocetniDatum, setPocetniDatum] = useState("");
  const [receptiSelect, setReceptiSelect] = useState([null]); 

  const dodajNoviSelect = () => {
    setReceptiSelect([...receptiSelect, null]);
  };

  const promeniSelect = (index, id) => {
    const novaLista = [...receptiSelect];
    novaLista[index] = id;
    setReceptiSelect(novaLista);
  };

  const ukloniSelect = (index) => {
    const novaLista = receptiSelect.filter((_, i) => i !== index);
    setReceptiSelect(novaLista);
  };

  const generisiKrajnjiDatum = (start) => {
    const date = new Date(start);
    date.setDate(date.getDate() + 6); 
    return date.toLocaleDateString("sr-RS");
  };

  const generisiListuKupovine = (izabraniRecepti) => {
    const listaMap = new Map();

    izabraniRecepti.forEach((receptId) => {
      const recept = recepti.find((r) => r.id === receptId);
      if (recept && recept.sastojci) {
        recept.sastojci.forEach(({ sastojakId, kolicina }) => {
          if (listaMap.has(sastojakId)) {
            listaMap.set(sastojakId, listaMap.get(sastojakId) + kolicina);
          } else {
            listaMap.set(sastojakId, kolicina);
          }
        });
      }
    });

    const listaKupovine = {
      sastojci: Array.from(listaMap.entries()).map(([id, kolicina]) => ({
        id,
        kolicina,
      })),
    };

    console.log("Lista kupovine:", listaKupovine);
    return listaKupovine;
  };

  const handleSave = () => {
    const izabraniRecepti = receptiSelect.filter((id) => id !== null);

    if (!naziv || !pocetniDatum || izabraniRecepti.length === 0) {
      alert("Molimo popunite sve podatke i izaberite bar jedan recept.");
      return;
    }

    const plan = {
      naziv_plana: naziv,
      period: `${pocetniDatum} - ${generisiKrajnjiDatum(pocetniDatum)}`,
      recepti: izabraniRecepti,
    };

    console.log("Kreiran plan:", plan);

    generisiListuKupovine(izabraniRecepti);

    setNaziv("");
    setPocetniDatum("");
    setReceptiSelect([null]);
    alert("Plan je kreiran (proverite konzolu).");
    navigate(-1);
  };

  return (
    <>
      <Navigation />
      <div className="kreiraj-plan-container">
        <h1>Kreiraj Plan</h1>

        <label>Naziv plana</label>
        <input
          type="text"
          placeholder="Naziv plana"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
        />

        <label>Početni datum</label>
        <input
          type="date"
          value={pocetniDatum}
          onChange={(e) => setPocetniDatum(e.target.value)}
        />

        <label>Izaberi recepte</label>
        <div className="dinamicki-recepti">
          {receptiSelect.map((izabrani, index) => (
            <div key={index} className="select-recept-item">
              <select
                value={izabrani || ""}
                onChange={(e) => promeniSelect(index, parseInt(e.target.value))}
              >
                <option value="">-- Izaberi recept --</option>
                {recepti.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.naziv}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => ukloniSelect(index)}>
                Ukloni
              </button>
            </div>
          ))}

          <button type="button" onClick={dodajNoviSelect}>
            Dodaj recept
          </button>
        </div>

        <button className="btn-sacuvaj" onClick={handleSave}>
          Kreiraj Plan
        </button>
      </div>
    </>
  );
}
