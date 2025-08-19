// DetaljiPlana.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import planovi from "../Data/Obroci.jsx";
import recepti from "../Data/Recepti.jsx";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/DetaljiPlana.css";

export default function DetaljiPlana() {
  const { id } = useParams();
  const navigate = useNavigate();

  const plan = planovi.find((p) => p.id.toString() === id);

  if (!plan) {
    return (
      <div className="not-found">
        <h2>Plan nije pronađen</h2>
        <button onClick={() => navigate(-1)}>Nazad</button>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="detalji-plana-container">
        <h1>{plan.naziv_plana}</h1>
        <p><strong>Period:</strong> {plan.period}</p>

        <div className="plan-akcije">
          <button onClick={() => navigate(`/lista-kupovine/${plan.id}`)}>
            Pogledaj listu kupovine
          </button>
        </div>

        <h2>Recepti u planu</h2>
        <div className="recepti-lista">
          {plan.recepti.map(({ receptId }) => {
            const r = recepti.find((rec) => rec.id === receptId);
            if (!r) return null;

            return (
              <div key={r.id} className="recept-kartica">
                <h3>{r.naziv}</h3>
                <p><strong>Vreme pripreme:</strong> {r.vreme_pripreme} min</p>
                <div className="recept-akcije">
                  <button onClick={() => navigate(`/recepti/${r.id}`)}>
                    Pogledaj recept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
