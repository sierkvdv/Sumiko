export const TEAS = [
  {
    id: "longjing",
    name: "Longjing (Dragon Well)",
    region: "Zhejiang, China",
    type: "Green Tea",
    tasting: "Nutty, chestnut, fresh.",
    notes: "Hand-picked, pan-fired to a gentle sweetness.",
    priceCents: 1895,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: "tieguanyin",
    name: "Tieguanyin",
    region: "Anxi, Fujian",
    type: "Oolong",
    tasting: "Floral, creamy, orchid hints.",
    notes: "Semi-oxidized; suitable for multiple infusions.",
    priceCents: 2095,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: "puerh",
    name: "Pu-erh",
    region: "Yunnan",
    type: "Fermented Dark Tea",
    tasting: "Earthy, round, sweet finish.",
    notes: "Improves with age; ideal after a meal.",
    priceCents: 1995,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: "jasmine-pearls",
    name: "Jasmine Pearls",
    region: "Fujian",
    type: "Scented Green",
    tasting: "Delicate jasmine aroma.",
    notes: "Hand-rolled leaves scented with jasmine blossoms.",
    priceCents: 1795,
    image:
      "https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?q=80&w=1600&auto=format&fit=crop"
  }
];

export function getTeaById(id) {
  return TEAS.find(t => t.id === id) || null;
}

