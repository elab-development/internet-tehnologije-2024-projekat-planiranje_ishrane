// Planovi.jsx
const planovi = [
  {
    id: 1,
    naziv_plana: "Zdrava Ishrana - Nedelja 1",
    period: "05.08.2025 - 11.08.2025",
    recepti: [
      { receptId: 1 }, // Piletina sa povrćem
      { receptId: 4 }, // Ovsena kaša sa voćem
      { receptId: 8 }, // Voćna salata
    ],
  },
  {
    id: 2,
    naziv_plana: "Fit Plan - Nedelja 2",
    period: "12.08.2025 - 18.08.2025",
    recepti: [
      { receptId: 3 }, // Losos sa pirinčem
      { receptId: 2 }, // Omlet sa povrćem
      { receptId: 9 }, // Sendvič sa piletinom
    ],
  },
  {
    id: 3,
    naziv_plana: "Brza i laka ishrana - Nedelja 3",
    period: "19.08.2025 - 25.08.2025",
    recepti: [
      { receptId: 6 }, // Salata od tunjevine
      { receptId: 5 }, // Ćuretina sa krompirom
      { receptId: 10 }, // Čokoladni mus
    ],
  },
  {
    id: 4,
    naziv_plana: "Vegetarijanski izazov - Nedelja 4",
    period: "26.08.2025 - 01.09.2025",
    recepti: [
      { receptId: 7 }, // Pasta sa paradajz sosom
      { receptId: 4 }, // Ovsena kaša sa voćem
      { receptId: 8 }, // Voćna salata
    ],
  },
];

export default planovi;
