import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/DetaljiRecepta.css";
import Navigation from "../Components/Navigation.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const DetaljiRecepta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recept, setRecept] = useState(null);
  const [loading, setLoading] = useState(true);
  const uloga = sessionStorage.getItem("role") || "gost";

  useEffect(() => {
    const fetchRecept = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await axios.get(`http://localhost:8000/api/recepti/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecept(response.data.data);
      } catch (error) {
        console.error("Greška pri učitavanju recepta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecept();
  }, [id]);

  const exportujPDF = async () => {
    const element = document.querySelector(".detalji-container");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${recept.naziv}.pdf`);
    } catch (error) {
      console.error("Greška pri eksportu PDF:", error);
      alert("Došlo je do greške pri eksportovanju PDF-a.");
    }
  };

  if (loading) return <p>Učitavanje...</p>;

  if (!recept) {
    return (
      <div className="not-found">
        <h2>Recept nije pronađen</h2>
        <button onClick={() => navigate(-1)} className="back-btn">Nazad</button>
      </div>
    );
  }

  const nutritivneVrednosti = izracunajNutritivneVrednosti(recept);

  const obrisiRecept = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj recept?")) return;
    try {
      const token = sessionStorage.getItem("auth_token");
      await axios.delete(`http://localhost:8000/api/recepti/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Recept "${recept.naziv}" je obrisan.`);
      navigate(-1);
    } catch (error) {
      console.error("Greška pri brisanju recepta:", error);
      alert("Došlo je do greške prilikom brisanja recepta.");
    }
  };

  const izmeniRecept = () => {
    navigate(`/dodaj-recept`, { state: { recept } });
  };

  const toggleOmiljeni = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      await axios.post(`http://localhost:8000/api/recepti/${id}/omiljeni`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecept((prev) => ({ ...prev, omiljen: !prev.omiljen }));
    } catch (error) {
      console.error("Greška pri menjaju omiljenog statusa:", error);
      alert("Došlo je do greške pri ažuriranju omiljenih.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="detalji-container">
        <button onClick={() => navigate(-1)} className="back-btn">← Nazad</button>

        <h1 className="recept-naziv">{recept.naziv}</h1>
        <p className="recept-vreme">Vreme pripreme: približno {recept.vreme_pripreme} min</p>

        <h3>Sastojci</h3>
        <table className="tabela-sastojaka">
          <thead>
            <tr>
              <th>Sastojak</th>
              <th>Količina</th>
              <th>Jedinica</th>
            </tr>
          </thead>
          <tbody>
            {recept.sastojci.map(({ sastojak, kolicina }) => (
              <tr key={sastojak.id}>
                <td>{sastojak.naziv}</td>
                <td>{kolicina}</td>
                <td>{sastojak.jedinica}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Nutritivne vrednosti</h3>
        <div className="nutritivne-vrednosti">
          <p><strong>Kalorije:</strong> {nutritivneVrednosti.kalorije} kcal</p>
          <p><strong>Masti:</strong> {nutritivneVrednosti.masti} g</p>
          <p><strong>Proteini:</strong> {nutritivneVrednosti.proteini} g</p>
          <p><strong>Ugljeni hidrati:</strong> {nutritivneVrednosti.ugljeni_hidrati} g</p>
        </div>

        <h3>Priprema</h3>
        <p className="recept-priprema">{recept.opis_pripreme}</p>

        <div className="akcije">
          {uloga === "administrator" && (
            <>
              <button onClick={izmeniRecept} className="btn btn-izmeni">Izmeni recept</button>
              <button onClick={obrisiRecept} className="btn btn-obrisi">Obriši recept</button>
            </>
          )}

          {uloga === "korisnik" && (
            <>
              <button onClick={toggleOmiljeni} className="btn btn-omiljeni">
                {recept.omiljen ? "Izbaci iz omiljenih" : "Dodaj u omiljene"}
              </button>
              <button onClick={exportujPDF} className="btn btn-export">
                Exportuj u PDF
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DetaljiRecepta;
