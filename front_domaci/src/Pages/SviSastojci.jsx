import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sastojci from "../Data/Sastojci.jsx";
import Navigation from "../Components/Navigation.jsx";
import Pagination from "../Components/Pagination.jsx"; 
import "../Styles/SviSastojci.css";

const INGREDIENTS_PER_PAGE = 10; 

export default function SviSastojci() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("userRole") || "guest";

  const [listaSastojaka, setListaSastojaka] = useState(sastojci);
  const [currentPage, setCurrentPage] = useState(1);

  const obrisiSastojak = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete sastojak?")) {
      setListaSastojaka((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const izmeniSastojak = (id) => {
    const sastojak = listaSastojaka.find((s) => s.id === id);
    if (sastojak) {
      navigate("/dodaj-sastojak", { state: { sastojak } });
    }
  };

  const totalPages = Math.ceil(listaSastojaka.length / INGREDIENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * INGREDIENTS_PER_PAGE;
  const currentIngredients = listaSastojaka.slice(startIndex, startIndex + INGREDIENTS_PER_PAGE);

  return (
    <>
      <Navigation />
      <div className="sastojci-container">
        <div className="sastojci-header">
          <h1>Svi sastojci</h1>
          {role === "admin" && (
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
              {role === "admin" && <th>Akcije</th>}
            </tr>
          </thead>
          <tbody>
            {currentIngredients.map(
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
                  {role === "admin" && (
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
