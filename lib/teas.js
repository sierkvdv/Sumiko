export const TEAS = [
  {
    id: "longjing",
    name: "Longjing (Dragon Well)",
    region: "Zhejiang, China",
    type: "Green Tea",
    tasting: "Nutty, chestnut, fresh.",
    notes: "Hand-picked, pan-fired to a gentle sweetness.",
    priceCents: 1895,
    image: "/photos/Sumiko_Longjing.png"
  },
  {
    id: "tieguanyin",
    name: "Tieguanyin",
    region: "Anxi, Fujian",
    type: "Oolong",
    tasting: "Floral, creamy, orchid hints.",
    notes: "Semi-oxidized; suitable for multiple infusions.",
    priceCents: 2095,
    image: "/photos/Sumiko_Tieguanyin.png"
  },
  {
    id: "puerh",
    name: "Pu-erh",
    region: "Yunnan",
    type: "Fermented Dark Tea",
    tasting: "Earthy, round, sweet finish.",
    notes: "Improves with age; ideal after a meal.",
    priceCents: 1995,
    image: "/photos/Sumiko_Pu-erh fermented.png"
  },
  {
    id: "jasmine-pearls",
    name: "Jasmine Pearls",
    region: "Fujian",
    type: "Scented Green",
    tasting: "Delicate jasmine aroma.",
    notes: "Hand-rolled leaves scented with jasmine blossoms.",
    priceCents: 1795,
    image: "/photos/Sumiko_JasminePearl.png"
  }
];

export function getTeaById(id) {
  return TEAS.find(t => t.id === id) || null;
}

