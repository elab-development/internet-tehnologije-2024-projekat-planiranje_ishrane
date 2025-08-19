// SviSastojci.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import Pagination from "../Components/Pagination.jsx"; 
import "../Styles/SviSastojci.css";

const INGREDIENTS_PER_PAGE = 10; 

export default function SviSastojci() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role") || "administrator";

  const [listaSastojaka, setListaSastojaka] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSastojci = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/sastojci?page=${page}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });
      setListaSastojaka(response.data.data);
      setCurrentPage(response.data.meta.current_page);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error("Greška prilikom učitavanja sastojaka:", error);
      alert("Došlo je do greške prilikom učitavanja sastojaka.");
    }
  };

  useEffect(() => {
    fetchSastojci(currentPage);
  }, [currentPage]);

  const obrisiSastojak = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete sastojak?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/sastojci/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });
      alert("Sastojak uspešno obrisan.");
     
      fetchSastojci(currentPage);
    } catch (error) {
      console.error("Greška prilikom brisanja sastojka:", error);
      alert("Došlo je do greške prilikom brisanja sastojka.");
    }
  };

  const izmeniSastojak = (id) => {
    const sastojak = listaSastojaka.find((s) => s.id === id);
    if (sastojak) {
      navigate("/dodaj-sastojak", { state: { sastojak } });
    }
  };

  return (
    <>
      <Navigation />
      <div className="sastojci-container">
        <div className="sastojci-header">
          <h1>Svi sastojci</h1>
          {role === "administrator" && (
            <button
              className="btn-dodaj"
              onClick={() => navigate("/dodaj-sastojak")}
            >
              ➕ Dodaj sastojak
            </button>
          )}
        </div>

        <table className="sastojci-tabela">
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Kategorija</th>
              <th>Tip</th>
              <th>Masti (g)</th>
              <th>Proteini (g)</th>
              <th>Ugljeni hidrati (g)</th>
              <th>Kalorije</th>
              <th>Jedinica</th>
              {role === "administrator" && <th>Akcije</th>}
            </tr>
          </thead>
          <tbody>
            {listaSastojaka.map(
              ({
                id,
                naziv,
                kategorija,
                tip,
                masti,
                proteini,
                ugljeni_hidrati,
                kalorije,
                jedinica,
              }) => (
                <tr key={id}>
                  <td>{naziv}</td>
                  <td>{kategorija}</td>
                  <td>{tip}</td>
                  <td>{masti}</td>
                  <td>{proteini}</td>
                  <td>{ugljeni_hidrati}</td>
                  <td>{kalorije}</td>
                  <td>{jedinica}</td>
                  {role === "administrator" && (
                    <td>
                      <button
                        className="btn-izmeni"
                        onClick={() => izmeniSastojak(id)}
                      >
                        Izmeni
                      </button>
                      <button
                        className="btn-obrisi"
                        onClick={() => obrisiSastojak(id)}
                      >
                        Obriši
                      </button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
