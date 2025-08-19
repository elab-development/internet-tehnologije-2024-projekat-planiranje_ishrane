import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/DodajSastojak.css";
import Navigation from "../Components/Navigation";

export default function DodajSastojak() {
  const location = useLocation();
  const sastojakZaIzmenu = location.state?.sastojak || null;
  const isEditMode = Boolean(sastojakZaIzmenu);

  const [naziv, setNaziv] = useState(sastojakZaIzmenu?.naziv || "");
  const [kategorija, setKategorija] = useState(sastojakZaIzmenu?.kategorija || "");
  const [masti, setMasti] = useState(sastojakZaIzmenu?.masti || "");
  const [proteini, setProteini] = useState(sastojakZaIzmenu?.proteini || "");
  const [ugljeniHidrati, setUgljeniHidrati] = useState(sastojakZaIzmenu?.ugljeni_hidrati || "");
  const [kalorije, setKalorije] = useState(sastojakZaIzmenu?.kalorije || "");
  const [tip, setTip] = useState(sastojakZaIzmenu?.tip || "");
  const [jedinica, setJedinica] = useState(sastojakZaIzmenu?.jedinica || "g");

  const handleSave = () => {
    // Validacija
    if (!naziv.trim()) {
      alert("Molimo unesite naziv sastojka.");
      return;
    }
    if (!kategorija) {
      alert("Molimo izaberite kategoriju.");
      return;
    }
    if (!masti || masti < 0) {
      alert("Molimo unesite validnu vrednost za masti.");
      return;
    }
    if (!proteini || proteini < 0) {
      alert("Molimo unesite validnu vrednost za proteine.");
      return;
    }
    if (!ugljeniHidrati || ugljeniHidrati < 0) {
      alert("Molimo unesite validnu vrednost za ugljene hidrate.");
      return;
    }
    if (!kalorije || kalorije < 0) {
      alert("Molimo unesite validnu vrednost za kalorije.");
      return;
    }
    if (!tip) {
      alert("Molimo izaberite tip.");
      return;
    }
    if (!jedinica) {
      alert("Molimo izaberite jedinicu mere.");
      return;
    }

    const noviSastojak = {
      naziv,
      kategorija,
      masti: parseFloat(masti),
      proteini: parseFloat(proteini),
      ugljeni_hidrati: parseFloat(ugljeniHidrati),
      kalorije: parseFloat(kalorije),
      tip,
      jedinica,
    };

    console.log(isEditMode ? "Izmenjen sastojak:" : "Sačuvan sastojak:", noviSastojak);

    if (!isEditMode) {
      setNaziv("");
      setKategorija("");
      setMasti("");
      setProteini("");
      setUgljeniHidrati("");
      setKalorije("");
      setTip("");
      setJedinica("g");
    }
  };

  return (
    <>
      <Navigation />
      <div className="dodaj-sastojak-container">
        <h2>{isEditMode ? "Izmeni sastojak" : "Dodaj sastojak"}</h2>

        <label>Naziv</label>
        <input
          type="text"
          placeholder="Naziv"
          value={naziv}
          onChange={(e) => setNaziv(e.target.value)}
        />

        <label>Kategorija</label>
        <select value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
          <option value="">Izaberi kategoriju</option>
          <option value="voće">Voće</option>
          <option value="povrće">Povrće</option>
          <option value="meso">Meso</option>
          <option value="mlečni proizvodi">Mlečni proizvodi</option>
          <option value="žitarice">Žitarice</option>
          <option value="orašasti plod">Orašasti plod</option>
          <option value="riba">Riba</option>
          <option value="ostalo">Ostalo</option>
        </select>

        <label>Masti (g)</label>
        <input
          type="number"
          placeholder="Masti"
          value={masti}
          onChange={(e) => setMasti(e.target.value)}
        />

        <label>Proteini (g)</label>
        <input
          type="number"
          placeholder="Proteini"
          value={proteini}
          onChange={(e) => setProteini(e.target.value)}
        />

        <label>Ugljeni hidrati (g)</label>
        <input
          type="number"
          placeholder="Ugljeni hidrati"
          value={ugljeniHidrati}
          onChange={(e) => setUgljeniHidrati(e.target.value)}
        />

        <label>Kalorije</label>
        <input
          type="number"
          placeholder="Kalorije"
          value={kalorije}
          onChange={(e) => setKalorije(e.target.value)}
        />

        <label>Tip</label>
        <select value={tip} onChange={(e) => setTip(e.target.value)}>
          <option value="">Izaberi tip</option>
          <option value="organski">Organska</option>
          <option value="neorganski">Neorganska</option>
        </select>

        <label>Jedinica mere</label>
        <select value={jedinica} onChange={(e) => setJedinica(e.target.value)}>
          <option value="g">Gram</option>
          <option value="ml">Mililitar</option>
          <option value="kom">Komad</option>
          <option value="kašika">Kašika</option>
        </select>

        <button onClick={handleSave}>
          {isEditMode ? "Sačuvaj izmene" : "Sačuvaj"}
        </button>
      </div>
    </>
  );
}
