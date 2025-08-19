
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/MojeListe.css";
import Navigation from "../Components/Navigation.jsx";
import Pagination from "../Components/Pagination.jsx";

export default function MojeListe() {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLists(currentPage);
  }, [currentPage]);

  const fetchLists = async (page) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("auth_token");

      const response = await axios.get(`http://localhost:8000/api/liste-za-kupovinu?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

   
      setLists(response.data.data); 
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setLoading(false);
    } catch (err) {
      console.error("Greška pri učitavanju lista:", err);
      setError("Ne mogu da učitam liste. Pokušajte ponovo.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="sve-liste-container">
        <h1>Sve Liste Kupovine</h1>

        {loading && <p>Učitavanje...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul className="liste">
          {lists.map((lista) => (
            <li
              key={lista.id}
              className="lista-item"
              onClick={() => navigate(`/lista-kupovine/${lista.plan_obroka_id}`)}
            >
              <span>Lista kupovine za {lista.plan_obroka_naziv}</span>
              <span className="arrow">➡️</span>
            </li>
          ))}
        </ul>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </>
  );
}
