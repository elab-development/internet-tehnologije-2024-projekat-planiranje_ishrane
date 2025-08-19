import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/DodajRecept.css";
import Navigation from "../Components/Navigation.jsx";

export default function DodajRecept() {
  const location = useLocation();
  const navigate = useNavigate();

  const receptZaIzmenu = location.state?.recept || null;
  const isEditMode = Boolean(receptZaIzmenu);

  const [naziv, setNaziv] = useState(receptZaIzmenu?.naziv || "");
  const [tipJela, setTipJela] = useState(receptZaIzmenu?.tip_jela || "doručak");
  const [opisPripreme, setOpisPripreme] = useState(receptZaIzmenu?.opis_pripreme || "");
  const [vremePripreme, setVremePripreme] = useState(receptZaIzmenu?.vreme_pripreme || "");
  const [sastojciLista, setSastojciLista] = useState([]);
  const [receptSastojci, setReceptSastojci] = useState([]);


  useEffect(() => {
  const fetchSastojci = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      const res = await axios.get("http://localhost:8000/api/sastojci/svi", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSastojciLista(res.data.data);

      if (isEditMode && receptZaIzmenu?.sastojci) {

        setReceptSastojci(
          receptZaIzmenu.sastojci.map(s => ({
            sastojak_id: s.sastojak_id || s.sastojak?.id || s.sastojakId,
            kolicina: s.kolicina
          }))
        );
      } else if (!isEditMode && res.data.data.length > 0) {

        setReceptSastojci([{ sastojak_id: res.data.data[0].id, kolicina: "" }]);
      }
    } catch (error) {
      console.error("Greška pri učitavanju sastojaka:", error);
    }
  };

  fetchSastojci();
}, [isEditMode, receptZaIzmenu]);

  const dodajSastojak = () => {
    if (sastojciLista.length > 0) {
      setReceptSastojci(prev => [
        ...prev,
        { sastojak_id: sastojciLista[0].id, kolicina: 0 }
      ]);
    }
  };

  const promeniSastojak = (index, polje, vrednost) => {
    setReceptSastojci(prev => {
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

  const handleSave = async () => {
    if (!naziv.trim()) return alert("Molimo unesite naziv recepta.");
    if (!tipJela) return alert("Molimo izaberite tip jela.");
    if (!opisPripreme.trim()) return alert("Molimo unesite opis pripreme.");
    if (!vremePripreme || vremePripreme <= 0) return alert("Molimo unesite validno vreme pripreme.");
    if (receptSastojci.length === 0) return alert("Molimo dodajte bar jedan sastojak.");

    for (let i = 0; i < receptSastojci.length; i++) {
      const s = receptSastojci[i];
      if (!s.sastojak_id) return alert(`Molimo izaberite sastojak za stavku #${i + 1}.`);
      if (!s.kolicina || s.kolicina <= 0) return alert(`Molimo unesite validnu količinu za sastojak #${i + 1}.`);
    }

    const receptData = {
      naziv,
      tip_jela: tipJela,
      opis_pripreme: opisPripreme,
      vreme_pripreme: parseInt(vremePripreme),
      sastojci: receptSastojci
    };

    try {
      const token = sessionStorage.getItem("auth_token");
      if (isEditMode) {
        await axios.put(
          `http://localhost:8000/api/recepti/${receptZaIzmenu.id}`,
          receptData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Recept uspešno izmenjen!");
      } else {
        await axios.post("http://localhost:8000/api/recepti", receptData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Recept uspešno dodat!");
      }
      navigate("/recepti");
    } catch (error) {
      console.error("Greška pri čuvanju recepta:", error);
      alert("Došlo je do greške pri čuvanju recepta.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="dodaj-recept-container">
        <h2>{isEditMode ? "Izmeni recept" : "Dodaj recept"}</h2>

        <label>Naziv</label>
        <input
          type="text"
          value={naziv}
          onChange={e => setNaziv(e.target.value)}
          placeholder="Naziv recepta"
        />

        <label>Tip jela</label>
        <select value={tipJela} onChange={e => setTipJela(e.target.value)}>
          <option value="doručak">Doručak</option>
          <option value="ručak">Ručak</option>
          <option value="večera">Večera</option>
          <option value="užina">Užina</option>
        </select>

        <label>Opis pripreme</label>
        <textarea
          value={opisPripreme}
          onChange={e => setOpisPripreme(e.target.value)}
          placeholder="Opis pripreme"
        />

        <label>Vreme pripreme (minuti)</label>
        <input
          type="number"
          value={vremePripreme}
          onChange={e => setVremePripreme(e.target.value)}
          placeholder="Vreme pripreme"
          min={1}
        />

        <h3>Sastojci</h3>
        {receptSastojci.map((s, i) => {
          const izabraniSastojak = sastojciLista.find(item => item.id === s.sastojak_id);
          return (
            <div key={i} className="sastojak-red">
              <select
                value={s.sastojak_id || ""}
                onChange={e => promeniSastojak(i, "sastojak_id", e.target.value)}
              >
                {sastojciLista.map(({ id, naziv }) => (
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
                onChange={e => promeniSastojak(i, "kolicina", e.target.value)}
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
          {isEditMode ? "Sačuvaj izmene" : "Sačuvaj recept"}
        </button>
      </div>
    </>
  );
}
