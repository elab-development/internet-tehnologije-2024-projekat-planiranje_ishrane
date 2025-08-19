
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/ListaKupovine.css";

export default function ListaKupovine() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [lista, setLista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLista = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/liste-za-kupovinu/${planId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
            },
          }
        );

        if (response.data && response.data.data) {
          setLista(response.data.data);
        } else {
          setError("Lista kupovine nije pronađena.");
        }
      } catch (err) {
        console.error("Greška pri dohvatanju liste kupovine:", err);
        setError("Došlo je do greške prilikom učitavanja liste.");
      } finally {
        setLoading(false);
      }
    };

    fetchLista();
  }, [planId]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="lista-kupovine-container">
          <h2>Učitavanje...</h2>
        </div>
      </>
    );
  }

  if (error || !lista) {
    return (
      <>
        <Navigation />
        <div className="not-found">
          <h2>{error || "Lista kupovine nije pronađena"}</h2>
          <button onClick={() => navigate(-1)}>Nazad</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="lista-kupovine-container">
        <h1>Lista Kupovine za {lista.plan_obroka_naziv}</h1>

        <ul className="lista-sastojaka">
          {lista.sastojci.map(({ sastojak, kolicina }) => (
            <li key={sastojak.id}>
              {sastojak.naziv} – {kolicina} {sastojak.jedinica}
            </li>
          ))}
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
