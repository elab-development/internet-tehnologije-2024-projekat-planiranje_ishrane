// ListeZaKupovinu.jsx

const shoppingLists = [
  {
    planId: 1,
    sastojci: [
      { id: 11, kolicina: 200 }, // Piletina (g)
      { id: 9, kolicina: 100 },  // Brokoli (g)
      { id: 7, kolicina: 50 },   // Šargarepa (g)
      { id: 21, kolicina: 50 },  // Ovsene pahuljice (g)
      { id: 16, kolicina: 200 }, // Mleko (ml)
      { id: 1, kolicina: 2 },    // Banana (kom)
      { id: 2, kolicina: 2 },    // Jabuka (kom)
      { id: 4, kolicina: 1 },    // Pomorandža (kom)
      { id: 3, kolicina: 50 },   // Jagoda (g)
    ],
  },
  {
    planId: 2,
    sastojci: [
      { id: 8, kolicina: 80 },   // Paradajz (g)
      { id: 10, kolicina: 50 },  // Paprika (g)
      { id: 11, kolicina: 100 }, // Piletina (g)
      { id: 15, kolicina: 3 },   // Jaja (kom)
      { id: 18, kolicina: 20 },  // Sir (g)
      { id: 19, kolicina: 100 }, // Pirinač (g)
      { id: 20, kolicina: 2 },   // Hleb (kom)
      { id: 25, kolicina: 150 }, // Losos (g)
      { id: 30, kolicina: 1 },   // Maslinovo ulje (kašika)
    ],
  },
  {
    planId: 3,
    sastojci: [
      { id: 6, kolicina: 150 },  // Krompir (g)
      { id: 8, kolicina: 50 },   // Paradajz (g)
      { id: 10, kolicina: 50 },  // Paprika (g)
      { id: 12, kolicina: 200 }, // Ćuretina (g)
      { id: 17, kolicina: 100 }, // Jogurt (ml)
      { id: 26, kolicina: 100 }, // Tuna (g)
      { id: 28, kolicina: 1 },   // Med (kašika)
      { id: 29, kolicina: 100 }, // Tamna čokolada (g)
      { id: 30, kolicina: 2 },   // Maslinovo ulje (kašike)
    ],
  },
  {
    planId: 4,
    sastojci: [
      { id: 1, kolicina: 2 },    // Banana (kom)
      { id: 2, kolicina: 2 },    // Jabuka (kom)
      { id: 3, kolicina: 50 },   // Jagoda (g)
      { id: 4, kolicina: 1 },    // Pomorandža (kom)
      { id: 8, kolicina: 150 },  // Paradajz (g)
      { id: 16, kolicina: 200 }, // Mleko (ml)
      { id: 20, kolicina: 100 }, // Hleb / pasta (g)
      { id: 21, kolicina: 50 },  // Ovsene pahuljice (g)
      { id: 30, kolicina: 1 },   // Maslinovo ulje (kašika)
    ],
  },
];

export default shoppingLists;
