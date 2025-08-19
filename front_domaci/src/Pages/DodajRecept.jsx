import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import sastojci from "../Data/Sastojci.jsx";
import "../Styles/DodajRecept.css"
import Navigation from "../Components/Navigation.jsx";

export default function DodajRecept() {
  const location = useLocation();
  const navigate = useNavigate();

  const receptZaIzmenu = location.state?.recept || null;

  const [naziv, setNaziv] = useState(receptZaIzmenu?.naziv || "");
  const [tipJela, setTipJela] = useState(receptZaIzmenu?.tip_jela || "doručak");
  const [opisPripreme, setOpisPripreme] = useState(receptZaIzmenu?.opis_pripreme || "");
  const [vremePripreme, setVremePripreme] = useState(receptZaIzmenu?.vreme_pripreme || "");
  

  const [receptSastojci, setReceptSastojci] = useState(
  receptZaIzmenu
    ? receptZaIzmenu.sastojci.map(s => ({
        sastojak_id: s.sastojakId, 
        kolicina: s.kolicina
      }))
    : [{ sastojak_id: sastojci[0]?.id || 1, kolicina: 0 }]
);



  const dodajSastojak = () => {
    setReceptSastojci((prev) => [
      ...prev,
      { sastojak_id: sastojci[0]?.id || 1, kolicina: 0 },
    ]);
  };

    const promeniSastojak = (index, polje, vrednost) => {
    setReceptSastojci((prev) => {
        const novaLista = [...prev];
        if (polje === "sastojak_id") {
        novaLista[index].sastojak_id = parseInt(vrednost);
        novaLista[index].kolicina = "";
        } else if (polje === "kolicina") {
        novaLista[index].kolicina = parseFloat(vrednost);
        }
        return novaLista;
    });
    };


  const handleSave = () => {
    if (!naziv.trim()) {
        alert("Molimo unesite naziv recepta.");
        return;
    }
    if (!tipJela) {
        alert("Molimo izaberite tip jela.");
        return;
    }
    if (!opisPripreme.trim()) {
        alert("Molimo unesite opis pripreme.");
        return;
    }
    if (!vremePripreme || vremePripreme <= 0) {
        alert("Molimo unesite validno vreme pripreme.");
        return;
    }
    if (receptSastojci.length === 0) {
        alert("Molimo dodajte bar jedan sastojak.");
        return;
    }

    for (let i = 0; i < receptSastojci.length; i++) {
    const s = receptSastojci[i];
    if (s.sastojak_id== null || s.sastojak_id === "") {
        alert(`Molimo izaberite sastojak za stavku #${s.id}.`);
        return;
    }
    if (!s.kolicina || s.kolicina <= 0) {
        alert(`Molimo unesite validnu količinu za sastojak #${s.kolicina}.`);
        return;
    }
    }

    console.log("Recept je validan i može se sačuvati:", {
        naziv,
        tipJela,
        opisPripreme,
        vremePripreme,
        receptSastojci,
    });
};


  return (
    <>
        <Navigation/>
        <div className="dodaj-recept-container">
        <h2>Dodaj recept</h2>

        <label>Naziv</label>
        <input
            type="text"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Naziv recepta"
        />

        <label>Tip jela</label>
        <select value={tipJela} onChange={(e) => setTipJela(e.target.value)}>
            <option value="doručak">Doručak</option>
            <option value="ručak">Ručak</option>
            <option value="večera">Večera</option>
            <option value="užina">Užina</option>
        </select>

        <label>Opis pripreme</label>
        <textarea
            value={opisPripreme}
            onChange={(e) => setOpisPripreme(e.target.value)}
            placeholder="Opis pripreme"
        />

        <label>Vreme pripreme (minuti)</label>
        <input
            type="number"
            value={vremePripreme}
            onChange={(e) => setVremePripreme(e.target.value)}
            placeholder="Vreme pripreme"
            min={1}
        />

        <h3>Sastojci</h3>

        {receptSastojci.map((s, i) => {
            const izabraniSastojak = sastojci.find((item) => item.id === s.sastojak_id);

            return (
            <div key={i} className="sastojak-red">
                <select
                value={s.sastojak_id}
                onChange={(e) => promeniSastojak(i, "sastojak_id", e.target.value)}
                >
                {sastojci.map(({ id, naziv }) => (
                    <option key={id} value={id}>
                    {naziv}
                    </option>
                ))}
                </select>

                <input
                type="number"
                min="0"
                step="any"
                placeholder="Količina"
                value={s.kolicina}
                onChange={(e) => promeniSastojak(i, "kolicina", e.target.value)}
                />

                <label className="jedinica-mera">
                {izabraniSastojak ? izabraniSastojak.jedinica : ""}
                </label>
            </div>
            );
        })}

        <button onClick={dodajSastojak} className="btn-dodaj-sastojak">
            Dodaj sastojak
        </button>

        <button onClick={handleSave} className="btn-sacuvaj">
            Sačuvaj recept
        </button>
        </div>
    </>
    
  );
}
