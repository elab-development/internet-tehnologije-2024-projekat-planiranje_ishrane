const recepti = [
  {
    id: 1,
    naziv: "Piletina sa povrćem",
    tip_jela: "ručak",
    vreme_pripreme: 30,
    opis_pripreme: "Ispržiti piletinu i dodati povrće.",
    sastojci: [
      { sastojakId: 11, kolicina: 200 }, // Piletina - 200 g
      { sastojakId: 9, kolicina: 100 },  // Brokoli - 100 g
      { sastojakId: 7, kolicina: 50 },   // Šargarepa - 50 g
    ],
    omiljen: true,
  },
  {
    id: 2,
    naziv: "Omlet sa povrćem",
    tip_jela: "doručak",
    vreme_pripreme: 10,
    opis_pripreme: "Umutiti jaja, dodati seckano povrće i ispeći na tiganju.",
    sastojci: [
      { sastojakId: 15, kolicina: 3 },   // Jaja - 3 kom
      { sastojakId: 10, kolicina: 50 },  // Paprika - 50 g
      { sastojakId: 8, kolicina: 50 },   // Paradajz - 50 g
    ],
    omiljen: true,
  },
  {
    id: 3,
    naziv: "Losos sa pirinčem",
    tip_jela: "ručak",
    vreme_pripreme: 25,
    opis_pripreme: "Ispeći losos na maslinovom ulju, skuvati pirinač i poslužiti.",
    sastojci: [
      { sastojakId: 25, kolicina: 150 }, // Losos - 150 g
      { sastojakId: 19, kolicina: 100 }, // Pirinač - 100 g
      { sastojakId: 30, kolicina: 1 },   // Maslinovo ulje - 1 kašika
    ],
    omiljen: true,
  },
  {
    id: 4,
    naziv: "Ovsena kaša sa voćem",
    tip_jela: "doručak",
    vreme_pripreme: 5,
    opis_pripreme: "Skluvati ovsene pahuljice u mleku i dodati sveže voće.",
    sastojci: [
      { sastojakId: 21, kolicina: 50 },  // Ovsene pahuljice - 50 g
      { sastojakId: 16, kolicina: 200 }, // Mleko - 200 ml
      { sastojakId: 1, kolicina: 1 },    // Banana - 1 kom
      { sastojakId: 2, kolicina: 1 },    // Jabuka - 1 kom
    ],
    omiljen: true,
  },
  {
    id: 5,
    naziv: "Ćuretina sa krompirom",
    tip_jela: "ručak",
    vreme_pripreme: 40,
    opis_pripreme: "Ispeći ćuretinu i krompir u rerni.",
    sastojci: [
      { sastojakId: 12, kolicina: 200 }, // Ćuretina - 200 g
      { sastojakId: 6, kolicina: 150 },  // Krompir - 150 g
      { sastojakId: 30, kolicina: 1 },   // Maslinovo ulje - 1 kašika
    ],
    omiljen: true,
  },
  {
    id: 6,
    naziv: "Salata od tunjevine",
    tip_jela: "večera",
    vreme_pripreme: 10,
    opis_pripreme: "Pomešati tunjevinu sa povrćem i preliti maslinovim uljem.",
    sastojci: [
      { sastojakId: 26, kolicina: 100 }, // Tuna - 100 g
      { sastojakId: 8, kolicina: 50 },   // Paradajz - 50 g
      { sastojakId: 10, kolicina: 50 },  // Paprika - 50 g
      { sastojakId: 30, kolicina: 1 },   // Maslinovo ulje - 1 kašika
    ],
    omiljen: false,
  },
  {
    id: 7,
    naziv: "Pasta sa paradajz sosom",
    tip_jela: "ručak",
    vreme_pripreme: 20,
    opis_pripreme: "Skuvati pastu, napraviti paradajz sos i pomešati.",
    sastojci: [
      { sastojakId: 20, kolicina: 3 }, // Hleb (koristimo kao pastu) - 100 g
      { sastojakId: 8, kolicina: 150 },  // Paradajz - 150 g
      { sastojakId: 30, kolicina: 1 },   // Maslinovo ulje - 1 kašika
    ],
    omiljen: false,
  },
  {
    id: 8,
    naziv: "Voćna salata",
    tip_jela: "užina",
    vreme_pripreme: 5,
    opis_pripreme: "Iseckati svo voće i pomešati u činiji.",
    sastojci: [
      { sastojakId: 1, kolicina: 1 },    // Banana - 1 kom
      { sastojakId: 2, kolicina: 1 },    // Jabuka - 1 kom
      { sastojakId: 4, kolicina: 1 },    // Pomorandža - 1 kom
      { sastojakId: 3, kolicina: 50 },   // Jagoda - 50 g
    ],
    omiljen: true,
  },
  {
    id: 9,
    naziv: "Sendvič sa piletinom",
    tip_jela: "užina",
    vreme_pripreme: 10,
    opis_pripreme: "Staviti piletinu, povrće i sir između kriški hleba.",
    sastojci: [
      { sastojakId: 11, kolicina: 100 }, // Piletina - 100 g
      { sastojakId: 20, kolicina: 2 },   // Hleb (kriške) - 2 kom
      { sastojakId: 18, kolicina: 20 },  // Sir - 20 g
      { sastojakId: 8, kolicina: 30 },   // Paradajz - 30 g
    ],
    omiljen: false,
  },
  {
    id: 10,
    naziv: "Čokoladni mus",
    tip_jela: "desert",
    vreme_pripreme: 15,
    opis_pripreme: "Istopiti čokoladu, dodati umućenu pavlaku i ohladiti.",
    sastojci: [
      { sastojakId: 29, kolicina: 100 }, // Tamna čokolada - 100 g
      { sastojakId: 17, kolicina: 100 }, // Jogurt - 100 ml
      { sastojakId: 28, kolicina: 1 },   // Med - 1 kašika
    ],
    omiljen: true,
  },
];

export default recepti;
