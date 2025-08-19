import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../Components/Navigation.jsx";
import Footer from "../Components/Footer.jsx";
import Pagination from "../Components/Pagination.jsx";
import "../Styles/SviRecepti.css";

const izracunajNutritivneVrednosti = (recept) => {
  let ukupno = {
    masti: 0,
    proteini: 0,
    ugljeni_hidrati: 0,
    kalorije: 0,
  };

  recept.sastojci.forEach(({ sastojak, kolicina }) => {
    if (!sastojak) return;

    let faktor = (sastojak.jedinica === "g" || sastojak.jedinica === "ml")
      ? kolicina / 100
      : kolicina;

    ukupno.masti += sastojak.masti * faktor;
    ukupno.proteini += sastojak.proteini * faktor;
    ukupno.ugljeni_hidrati += sastojak.ugljeni_hidrati * faktor;
    ukupno.kalorije += sastojak.kalorije * faktor;
  });

  for (let key in ukupno) {
    ukupno[key] = Math.round(ukupno[key] * 100) / 100;
  }

  return ukupno;
};

export default function Omiljeni() {
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOmiljeni(currentPage);
  }, [currentPage]);

  const fetchOmiljeni = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/moji-omiljeni-recepti?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );

   
      const receptiSaNutritivnim = res.data.data.map((recept) => ({
        ...recept,
        nutritivneVrednosti: izracunajNutritivneVrednosti(recept),
      }));

      setCurrentRecipes(receptiSaNutritivnim);
      setCurrentPage(res.data.meta.current_page);
      setTotalPages(res.data.meta.last_page);
    } catch (error) {
      console.error("Greška pri učitavanju omiljenih recepata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="home-container">
        <h1>Omiljeni recepti</h1>

        <div className="content-wrapper">
          <main className="main-content">
            <div className="recipes-list">
              {loading ? (
                <p>Učitavanje recepata...</p>
              ) : currentRecipes.length === 0 ? (
                <p>Nema recepata.</p>
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
                        <div>
                          <strong>Kalorije:</strong> {nutritivneVrednosti.kalorije} kcal
                          <br />
                          <strong>Masti:</strong> {nutritivneVrednosti.masti} g
                          <br />
                          <strong>Proteini:</strong> {nutritivneVrednosti.proteini} g
                          <br />
                          <strong>Ugljeni hidrati:</strong> {nutritivneVrednosti.ugljeni_hidrati} g
                        </div>
                      </div>
                    </Link>
                  )
                )
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
