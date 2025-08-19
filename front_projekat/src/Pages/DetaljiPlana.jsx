
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/DetaljiPlana.css";

export default function DetaljiPlana() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await axios.get(
          `http://localhost:8000/api/planovi-obroka/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlan(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Greška pri učitavanju plana:", err);
        setError("Došlo je do greške pri učitavanju plana.");
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="detalji-plana-container">
        <p>Učitavanje...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="not-found">
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)}>Nazad</button>
      </div>
    );
  }

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
          {plan.recepti.map((r) => (
            <div key={r.id} className="recept-kartica">
              <h3>{r.naziv}</h3>
              <p><strong>Vreme pripreme:</strong> {r.vreme_pripreme} min</p>
              <div className="recept-akcije">
                <button onClick={() => navigate(`/recepti/${r.id}`)}>
                  Pogledaj recept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
