
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/KreirajPlan.css";
import Navigation from "../Components/Navigation.jsx";

export default function KreirajPlan() {
  const navigate = useNavigate();

  const [naziv, setNaziv] = useState("");
  const [pocetniDatum, setPocetniDatum] = useState("");
  const [receptiSelect, setReceptiSelect] = useState([null]);
  const [sviRecepti, setSviRecepti] = useState([]);


  useEffect(() => {
    const fetchRecepti = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        const res = await axios.get("http://localhost:8000/api/recepti/svi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSviRecepti(res.data.data);
      } catch (error) {
        console.error("Greška pri učitavanju recepata:", error);
        alert("Došlo je do greške pri učitavanju recepata.");
      }
    };
    fetchRecepti();
  }, []);

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


const formatirajDatum = (dateString) => {
  const date = new Date(dateString);
  const dan = String(date.getDate()).padStart(2, "0");
  const mesec = String(date.getMonth() + 1).padStart(2, "0");
  const godina = date.getFullYear();
  return `${dan}.${mesec}.${godina}`;
};


const generisiKrajnjiDatum = (start) => {
  const date = new Date(start);
  date.setDate(date.getDate() + 6);
  return formatirajDatum(date);
};

  const handleSave = async () => {
    const izabraniRecepti = receptiSelect.filter((id) => id !== null);

    if (!naziv || !pocetniDatum || izabraniRecepti.length === 0) {
      alert("Molimo popunite sve podatke i izaberite bar jedan recept.");
      return;
    }

 const plan = {
  naziv_plana: naziv,
  period: `${formatirajDatum(pocetniDatum)} - ${generisiKrajnjiDatum(pocetniDatum)}`,
  recepti: izabraniRecepti,
};

    try {
      const token = sessionStorage.getItem("auth_token");
      await axios.post("http://localhost:8000/api/planovi-obroka", plan, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Plan je kreiran uspešno!");
      setNaziv("");
      setPocetniDatum("");
      setReceptiSelect([null]);
      navigate("/planovi");
    } catch (error) {
      console.error("Greška pri kreiranju plana:", error);
      alert("Došlo je do greške pri kreiranju plana.");
    }
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
                {sviRecepti.map((r) => (
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
