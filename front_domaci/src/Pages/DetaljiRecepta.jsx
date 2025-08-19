import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recepti from "../Data/Recepti.jsx";
import sastojci from "../Data/Sastojci.jsx";
import "../Styles/DetaljiRecepta.css";
import Navigation from "../Components/Navigation.jsx";

const izracunajNutritivneVrednosti = (recept) => {
  let ukupno = {
    masti: 0,
    proteini: 0,
    ugljeni_hidrati: 0,
    kalorije: 0,
  };

  recept.sastojci.forEach(({ sastojakId, kolicina }) => {
    const s = sastojci.find((item) => item.id === sastojakId);
    if (!s) return;

    let faktor = (s.jedinica === "g" || s.jedinica === "ml")
      ? kolicina / 100
      : kolicina;

    ukupno.masti += s.masti * faktor;
    ukupno.proteini += s.proteini * faktor;
    ukupno.ugljeni_hidrati += s.ugljeni_hidrati * faktor;
    ukupno.kalorije += s.kalorije * faktor;
  });

  for (let key in ukupno) {
    ukupno[key] = Math.round(ukupno[key] * 100) / 100;
  }

  return ukupno;
};

const DetaljiRecepta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recept, setRecept] = useState(recepti.find((r) => r.id.toString() === id));

  if (!recept) {
    return (
      <div className="not-found">
        <h2>Recept nije pronađen</h2>
        <button onClick={() => navigate(-1)} className="back-btn">Nazad</button>
      </div>
    );
  }

  const nutritivneVrednosti = izracunajNutritivneVrednosti(recept);

  const uloga = sessionStorage.getItem("userRole") || "gost";


  const obrisiRecept = () => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj recept?")) {
      alert(`Recept "${recept.naziv}" obrisan!`);
      navigate(-1);
    }
  };

  const izmeniRecept = () => {
  navigate(`/dodaj-recept`, { state: { recept } });
};


  const toggleOmiljeni = () => {
    setRecept((prev) => ({ ...prev, omiljeni: !prev.omiljeni }));
  };

  return (
    <>
      <Navigation />
      <div className="detalji-container">
        <button onClick={() => navigate(-1)} className="back-btn">← Nazad</button>

        <h1 className="recept-naziv">{recept.naziv}</h1>
        <p className="recept-vreme">Vreme pripreme: približno {recept.vreme_pripreme} min</p>

        <h3>Sastojci</h3>
        <table className="tabela-sastojaka">
          <thead>
            <tr>
              <th>Sastojak</th>
              <th>Količina</th>
              <th>Jedinica</th>
            </tr>
          </thead>
          <tbody>
            {recept.sastojci.map(({ sastojakId, kolicina }, index) => {
              const s = sastojci.find((item) => item.id === sastojakId);
              return (
                <tr key={index}>
                  <td>{s?.naziv || "Nepoznato"}</td>
                  <td>{kolicina}</td>
                  <td>{s?.jedinica || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h3>Nutritivne vrednosti</h3>
        <div className="nutritivne-vrednosti">
          <p><strong>Kalorije:</strong> {nutritivneVrednosti.kalorije} kcal</p>
          <p><strong>Masti:</strong> {nutritivneVrednosti.masti} g</p>
          <p><strong>Proteini:</strong> {nutritivneVrednosti.proteini} g</p>
          <p><strong>Ugljeni hidrati:</strong> {nutritivneVrednosti.ugljeni_hidrati} g</p>
        </div>

        <h3>Priprema</h3>
        <p className="recept-priprema">{recept.opis_pripreme}</p>

        <div className="akcije">
          {uloga === "admin" && (
            <>
              <button onClick={izmeniRecept} className="btn btn-izmeni">Izmeni recept</button>
              <button onClick={obrisiRecept} className="btn btn-obrisi">Obriši recept</button>
            </>
          )}

          {uloga === "user" && (
            <button onClick={toggleOmiljeni} className="btn btn-omiljeni">
              {recept.omiljeni ? "Izbaci iz omiljenih" : "Dodaj u omiljene"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DetaljiRecepta;
