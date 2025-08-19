
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import "../Styles/IzmeniListu.css";

export default function IzmeniListu() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [lista, setLista] = useState([]);
  const [listaId, setListaId] = useState(null);
  const [planNaziv, setPlanNaziv] = useState("");
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
          const data = response.data.data;
          setListaId(data.id);
          setPlanNaziv(data.plan_obroka_naziv);
          const sastojciMapped = data.sastojci.map(({ sastojak, kolicina }) => ({
            id: sastojak.id,
            naziv: sastojak.naziv,
            jedinica: sastojak.jedinica,
            kolicina,
          }));
          setLista(sastojciMapped);
        } else {
          setError("Lista kupovine nije pronađena.");
        }
      } catch (err) {
        console.error("Greška pri učitavanju liste:", err);
        setError("Došlo je do greške prilikom učitavanja liste.");
      } finally {
        setLoading(false);
      }
    };

    fetchLista();
  }, [planId]);

  const promeniKolicinu = (id, novaKolicina) => {
    setLista((prev) =>
      prev.map((s) => (s.id === id ? { ...s, kolicina: novaKolicina } : s))
    );
  };

  const obrisiSastojak = async (idSastojka) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/liste-za-kupovinu/${listaId}/ukloni-sastojak/${idSastojka}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );
      setLista((prev) => prev.filter((s) => s.id !== idSastojka));
    } catch (err) {
      console.error("Greška pri brisanju sastojka:", err);
      alert("Došlo je do greške pri brisanju sastojka.");
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        sastojci: lista.map((s) => ({
          id: s.id,
          kolicina: s.kolicina,
        })),
      };

      await axios.put(
        `http://localhost:8000/api/liste-za-kupovinu/${listaId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );

      alert("Lista je sačuvana.");
      navigate(-1);
    } catch (err) {
      console.error("Greška pri čuvanju liste:", err);
      alert("Došlo je do greške prilikom čuvanja liste.");
    }
  };

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

  if (error) {
    return (
      <>
        <Navigation />
        <div className="not-found">
          <h2>{error}</h2>
          <button onClick={() => navigate(-1)}>Nazad</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="lista-kupovine-container">
        <h1>Izmeni listu kupovine za plan {planNaziv}</h1>
        <ul className="lista-sastojaka">
          {lista.map(({ id, naziv, jedinica, kolicina }) => (
            <li key={id} className="sastojak-red">
              <span>{naziv} – </span>
              <input
                type="number"
                min="0"
                value={kolicina}
                onChange={(e) => promeniKolicinu(id, parseInt(e.target.value, 10))}
              />{" "}
              <span>{jedinica}</span>
              <button className="btn-obrisi" onClick={() => obrisiSastojak(id)}>
                Izbriši
              </button>
            </li>
          ))}
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
