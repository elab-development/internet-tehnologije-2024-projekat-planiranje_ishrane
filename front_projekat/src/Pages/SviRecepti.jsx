import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import Footer from "../Components/Footer.jsx";
import Pagination from "../Components/Pagination.jsx";
import "../Styles/SviRecepti.css";

const tipoviJela = ["doručak", "ručak", "užina", "večera", "desert"];
const vremenskiFilteri = [
  { label: "Do 10 min", min: 0, max: 10 },
  { label: "11 - 30 min", min: 11, max: 30 },
  { label: "Preko 30 min", min: 31 },
];
const kalorijskiFilteri = [
  { label: "Do 200 kcal", min: 0, max: 200 },
  { label: "201 - 400 kcal", min: 201, max: 400 },
  { label: "Preko 400 kcal", min: 401 },
];


const izracunajNutritivneVrednosti = (recept) => {
  let ukupno = { masti: 0, proteini: 0, ugljeni_hidrati: 0, kalorije: 0 };
  recept.sastojci.forEach(({ sastojak, kolicina }) => {
    if (!sastojak) return;
    let faktor = sastojak.jedinica === "g" || sastojak.jedinica === "ml" ? kolicina / 100 : kolicina;
    ukupno.masti += sastojak.masti * faktor;
    ukupno.proteini += sastojak.proteini * faktor;
    ukupno.ugljeni_hidrati += sastojak.ugljeni_hidrati * faktor;
    ukupno.kalorije += sastojak.kalorije * faktor;
  });
  for (let key in ukupno) ukupno[key] = Math.round(ukupno[key] * 100) / 100;
  return ukupno;
};

export default function SviRecepti() {
  const [recepti, setRecepti] = useState([]);
  const [filterNaziv, setFilterNaziv] = useState("");
  const [filterTipovi, setFilterTipovi] = useState([]);
  const [filterVreme, setFilterVreme] = useState(null);
  const [filterKalorije, setFilterKalorije] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecepti = async (page = 1) => {
    try {
      const token = sessionStorage.getItem("auth_token");
      const params = { page };
      if (filterTipovi.length === 1) params.tip_jela = filterTipovi[0];
      if (filterVreme) {
        if (filterVreme.min !== undefined) params.vreme_pripreme_min = filterVreme.min;
        if (filterVreme.max !== undefined) params.vreme_pripreme_max = filterVreme.max;
      }
      if (filterKalorije) {
        if (filterKalorije.min !== undefined) params.min_kalorije = filterKalorije.min;
        if (filterKalorije.max !== undefined) params.max_kalorije = filterKalorije.max;
      }
      if (filterNaziv) params.naziv = filterNaziv;
      console.log(params);

      const res = await axios.get("http://localhost:8000/api/recepti", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setRecepti(res.data.data);
      setTotalPages(res.data.meta.last_page || 1);
      setCurrentPage(res.data.meta.current_page || 1);
    } catch (error) {
      console.error("Greška pri učitavanju recepata:", error);
      alert("Došlo je do greške pri učitavanju recepata.");
    }
  };

  useEffect(() => { fetchRecepti(); }, [filterTipovi, filterVreme, filterKalorije]);

  const handleNazivEnter = (e) => { if (e.key === "Enter") fetchRecepti(1); };
  const toggleTip = (tip) => filterTipovi.includes(tip) ? setFilterTipovi(filterTipovi.filter((t) => t !== tip)) : setFilterTipovi([...filterTipovi, tip]);
  const handleVremeChange = (e) => { const vrem = vremenskiFilteri.find(f => f.label === e.target.value); setFilterVreme(vrem || null); };
  const handleKalorijeChange = (e) => { const kal = kalorijskiFilteri.find(f => f.label === e.target.value); setFilterKalorije(kal || null); };
  const clearFilters = () => { setFilterTipovi([]); setFilterVreme(null); setFilterKalorije(null); setFilterNaziv(""); fetchRecepti(1); };
  const handlePageChange = (page) => fetchRecepti(page);

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
                    <input type="checkbox" checked={filterTipovi.includes(tip)} onChange={() => toggleTip(tip)} /> {tip}
                  </label>
                ))}
              </div>
              <div className="filter-group">
                <h3>Vreme pripreme</h3>
                {vremenskiFilteri.map(({ label }) => (
                  <label key={label}>
                    <input type="radio" name="vreme" value={label} checked={filterVreme?.label === label} onChange={handleVremeChange} /> {label}
                  </label>
                ))}
                <label>
                  <input type="radio" name="vreme" value="" checked={filterVreme === null} onChange={() => setFilterVreme(null)} /> Svi
                </label>
              </div>
              <div className="filter-group">
                <h3>Kalorije</h3>
                {kalorijskiFilteri.map(({ label }) => (
                  <label key={label}>
                    <input type="radio" name="kalorije" value={label} checked={filterKalorije?.label === label} onChange={handleKalorijeChange} /> {label}
                  </label>
                ))}
                <label>
                  <input type="radio" name="kalorije" value="" checked={filterKalorije === null} onChange={() => setFilterKalorije(null)} /> Sve
                </label>
              </div>
              <button onClick={clearFilters} className="clear-filters-btn">Resetuj filtere</button>
            </div>
          </aside>

          <main className="main-content">
            <input type="text" placeholder="Pretraži recepte po nazivu..." value={filterNaziv} onChange={(e) => setFilterNaziv(e.target.value)} onKeyDown={handleNazivEnter} className="search-input" />

            <div className="recipes-list">
              {recepti.length === 0 ? (
                <p>Nema recepata koji odgovaraju pretrazi i filterima.</p>
              ) : (
                recepti.map((recept) => {
                  const nutritivneVrednosti = izracunajNutritivneVrednosti(recept);
                  return (
                    <Link key={recept.id} to={`/recepti/${recept.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div className="recipe-card">
                        <h3>{recept.naziv}</h3>
                        <p>Tip jela: {recept.tip_jela}</p>
                        <p>Vreme pripreme: {recept.vreme_pripreme} min</p>
                        <div>
                          <strong>Kalorije:</strong> {nutritivneVrednosti.kalorije} kcal<br />
                          <strong>Masti:</strong> {nutritivneVrednosti.masti} g<br />
                          <strong>Proteini:</strong> {nutritivneVrednosti.proteini} g<br />
                          <strong>Ugljeni hidrati:</strong> {nutritivneVrednosti.ugljeni_hidrati} g
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
