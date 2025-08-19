import { useMemo } from "react";
import sastojci from "../Data/Sastojci.jsx";


function izracunajNutritivneVrednosti(recept) {
  let ukupno = { masti: 0, proteini: 0, ugljeni_hidrati: 0, kalorije: 0 };
  recept.sastojci.forEach(({ sastojakId, kolicina }) => {
    const s = sastojci.find((item) => item.id === sastojakId);
    if (!s) return;

    const faktor = s.jedinica === "g" || s.jedinica === "ml" ? kolicina / 100 : kolicina;

    ukupno.masti += s.masti * faktor;
    ukupno.proteini += s.proteini * faktor;
    ukupno.ugljeni_hidrati += s.ugljeni_hidrati * faktor;
    ukupno.kalorije += s.kalorije * faktor;
  });

  return Object.fromEntries(
    Object.entries(ukupno).map(([k, v]) => [k, Math.round(v * 100) / 100])
  );
}

export default function useFilteredRecipes(
  recepti,
  { filterNaziv, filterTipovi, filterVreme, filterKalorije }
) {
  return useMemo(() => {
    let results = recepti.map((r) => ({ ...r, nutritivneVrednosti: izracunajNutritivneVrednosti(r) }));

    if (filterNaziv) {
      const lower = filterNaziv.toLowerCase();
      results = results.filter((r) => r.naziv.toLowerCase().includes(lower));
    }

    if (filterTipovi?.length) results = results.filter((r) => filterTipovi.includes(r.tip_jela));
    if (filterVreme)
      results = results.filter((r) => {
        const v = r.vreme_pripreme;
        if (filterVreme.min && filterVreme.max) return v >= filterVreme.min && v <= filterVreme.max;
        if (filterVreme.min) return v >= filterVreme.min;
        if (filterVreme.max) return v <= filterVreme.max;
        return true;
      });
    if (filterKalorije)
      results = results.filter((r) => {
        const kcal = r.nutritivneVrednosti.kalorije;
        if (filterKalorije.min && filterKalorije.max) return kcal >= filterKalorije.min && kcal <= filterKalorije.max;
        if (filterKalorije.min) return kcal >= filterKalorije.min;
        if (filterKalorije.max) return kcal <= filterKalorije.max;
        return true;
      });

    return results;
  }, [recepti, filterNaziv, filterTipovi, filterVreme, filterKalorije]);
}
