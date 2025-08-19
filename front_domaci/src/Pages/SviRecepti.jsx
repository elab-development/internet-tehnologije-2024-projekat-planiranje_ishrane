import React, { useState } from "react";
import { Link } from "react-router-dom";
import recepti from "../Data/Recepti.jsx";
import sastojci from "../Data/Sastojci.jsx";
import Navigation from "../Components/Navigation.jsx";
import Footer from "../Components/Footer.jsx";
import useFilteredRecipes from "../Hooks/useFilteredRecipes.jsx";
import Pagination from "../Components/Pagination.jsx";
import "../Styles/SviRecepti.css";

const tipoviJela = ["doručak", "ručak", "užina", "večera", "desert"];
const vremenskiFilteri = [
  { label: "Do 10 min", max: 10 },
  { label: "11 - 30 min", min: 11, max: 30 },
  { label: "Preko 30 min", min: 31 },
];
const kalorijskiFilteri = [
  { label: "Do 200 kcal", max: 200 },
  { label: "201 - 400 kcal", min: 201, max: 400 },
  { label: "Preko 400 kcal", min: 401 },
];

const RECIPES_PER_PAGE = 6; 

export default function SviRecepti() {
  const [filterNaziv, setFilterNaziv] = useState("");
  const [filterTipovi, setFilterTipovi] = useState([]);
  const [filterVreme, setFilterVreme] = useState(null);
  const [filterKalorije, setFilterKalorije] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  

  const filteredRecipes = useFilteredRecipes(recepti, {
    filterNaziv,
    filterTipovi,
    filterVreme,
    filterKalorije,
  });

  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + RECIPES_PER_PAGE
  );

  const toggleTip = (tip) => {
    if (filterTipovi.includes(tip)) {
      setFilterTipovi(filterTipovi.filter((t) => t !== tip));
    } else {
      setFilterTipovi([...filterTipovi, tip]);
    }
    setCurrentPage(1); 
  };

  const handleVremeChange = (event) => {
    const value = event.target.value;
    const vrem = vremenskiFilteri.find((f) => f.label === value);
    setFilterVreme(vrem || null);
    setCurrentPage(1);
  };

  const handleKalorijeChange = (event) => {
    const value = event.target.value;
    const kal = kalorijskiFilteri.find((f) => f.label === value);
    setFilterKalorije(kal || null);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterTipovi([]);
    setFilterVreme(null);
    setFilterKalorije(null);
    setCurrentPage(1);
  };

  return (
    <>
      <Navigation />
      <div className="home-container">
        <h1>Svi recepti</h1>

        <div className="content-wrapper">
          <aside className="sidebar">
            <div className="filters-container">
              <div className="filter-group">
                <h3>Tip jela</h3>
                {tipoviJela.map((tip) => (
                  <label key={tip}>
                    <input
                      type="checkbox"
                      checked={filterTipovi.includes(tip)}
                      onChange={() => toggleTip(tip)}
                    />
                    {tip}
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h3>Vreme pripreme</h3>
                {vremenskiFilteri.map(({ label }) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name="vreme"
                      value={label}
                      checked={filterVreme?.label === label}
                      onChange={handleVremeChange}
                    />
                    {label}
                  </label>
                ))}
                <label>
                  <input
                    type="radio"
                    name="vreme"
                    value=""
                    checked={filterVreme === null}
                    onChange={() => setFilterVreme(null)}
                  />
                  Svi
                </label>
              </div>

              <div className="filter-group">
                <h3>Kalorije</h3>
                {kalorijskiFilteri.map(({ label }) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name="kalorije"
                      value={label}
                      checked={filterKalorije?.label === label}
                      onChange={handleKalorijeChange}
                    />
                    {label}
                  </label>
                ))}
                <label>
                  <input
                    type="radio"
                    name="kalorije"
                    value=""
                    checked={filterKalorije === null}
                    onChange={() => setFilterKalorije(null)}
                  />
                  Sve
                </label>
              </div>

              <button onClick={clearFilters} className="clear-filters-btn">
                Resetuj filtere
              </button>
            </div>
          </aside>

          <main className="main-content">
            <input
              type="text"
              placeholder="Pretraži recepte po nazivu..."
              value={filterNaziv}
              onChange={(e) => {
                setFilterNaziv(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />

            <div className="recipes-list">
              {currentRecipes.length === 0 ? (
                <p>Nema recepata koji odgovaraju pretrazi i filterima.</p>
              ) : (
                currentRecipes.map(
                  ({ id, naziv, tip_jela, vreme_pripreme, nutritivneVrednosti }) => (
                    <Link
                      key={id}
                      to={`/recepti/${id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="recipe-card">
                        <h3>{naziv}</h3>
                        <p>Tip jela: {tip_jela}</p>
                        <p>Vreme pripreme: {vreme_pripreme} min</p>
                        {nutritivneVrednosti ? (
                          <div>
                            <strong>Kalorije:</strong> {nutritivneVrednosti.kalorije} kcal
                            <br />
                            <strong>Masti:</strong> {nutritivneVrednosti.masti} g
                            <br />
                            <strong>Proteini:</strong> {nutritivneVrednosti.proteini} g
                            <br />
                            <strong>Ugljeni hidrati:</strong> {nutritivneVrednosti.ugljeni_hidrati} g
                          </div>
                        ) : (
                          <p>Nutritivne vrednosti nisu dostupne.</p>
                        )}
                      </div>
                    </Link>
                  )
                )
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
