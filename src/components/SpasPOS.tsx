import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
  qty: number;
}) => void;

type Treatment = { id: string; name: string; subtitle: string; price: number };

const categories = [
  { id: "massage", label: "Massage" },
  { id: "facial", label: "Facial" },
  { id: "body", label: "Body" },
  { id: "wellness", label: "Wellness" },
];

const treatments: Record<string, Treatment[]> = {
  massage: [
    { id: "swedish", name: "Swedish Massage", subtitle: "60 min · Full body relaxation", price: 95 },
    { id: "deep", name: "Deep Tissue Massage", subtitle: "60 min · Therapeutic pressure", price: 110 },
    { id: "hotstone", name: "Hot Stone Massage", subtitle: "90 min · Volcanic basalt stones", price: 140 },
    { id: "sports", name: "Sports Massage", subtitle: "45 min · Athletic recovery", price: 85 },
  ],
  facial: [
    { id: "classic", name: "Classic Facial", subtitle: "60 min · Deep cleanse", price: 75 },
    { id: "antiage", name: "Anti-Ageing Facial", subtitle: "75 min · Collagen boost", price: 120 },
  ],
  body: [
    { id: "wrap", name: "Body Wrap", subtitle: "90 min · Detox", price: 130 },
    { id: "scrub", name: "Salt Scrub", subtitle: "60 min · Exfoliation", price: 95 },
  ],
  wellness: [
    { id: "spaday", name: "Spa Day Access", subtitle: "Pool + sauna + steam · open access", price: 55 },
  ],
};

const therapists = [
  { id: "aisha", name: "Aisha K.", initials: "AK", tags: ["Swedish", "Deep Tissue", "Prenatal"], rating: 4.9, slots: ["10:00", "10:30", "14:00", "15:00", "16:00"], preferred: true },
  { id: "james", name: "James L.", initials: "JL", tags: ["Swedish", "Hot Stone", "Sports"], rating: 4.7, slots: ["09:00", "11:00", "13:00", "15:00", "17:00"], preferred: false },
  { id: "mei", name: "Mei W.", initials: "MW", tags: ["Swedish", "Facial", "Lymphatic"], rating: 4.8, slots: ["10:00", "12:00", "16:00"], preferred: false },
];

const dates = ["Sat 14 Jun", "Sun 15 Jun", "Mon 16 Jun", "Tue 17 Jun", "Wed 18 Jun"];

export function SpasPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [addOns, setAddOns] = useState({ oils: false, extended: false, robe: false });

  const resetSel = () => {
    setSelectedTreatment(null);
    setSelectedDate(null);
    setSelectedTherapist(null);
    setSelectedSlot(null);
    setAddOns({ oils: false, extended: false, robe: false });
  };

  const allTx = Object.values(treatments).flat();
  const tx = allTx.find((t) => t.id === selectedTreatment) || null;
  const therapist = therapists.find((t) => t.id === selectedTherapist) || null;
  const addOnTotal = (addOns.oils ? 15 : 0) + (addOns.extended ? 45 : 0) + (addOns.robe ? 10 : 0);
  const total = tx ? tx.price + addOnTotal : 0;

  const addOnList = [
    { key: "oils" as const, label: "Premium oils upgrade", price: 15 },
    { key: "extended" as const, label: "Extended +30 min", price: 45 },
    { key: "robe" as const, label: "Robe service", price: 10 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Spas & Wellness</h1>
      <p className="text-sm text-gray-500 mb-6">Book treatments and therapists</p>

      <div className="flex gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCategory(c.id);
              resetSel();
            }}
            className={`rounded-lg px-4 py-2 text-sm cursor-pointer ${
              activeCategory === c.id
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(treatments[activeCategory] || []).map((t) => (
          <div
            key={t.id}
            onClick={() => {
              setSelectedTreatment(t.id);
              setSelectedDate(null);
              setSelectedTherapist(null);
              setSelectedSlot(null);
              setAddOns({ oils: false, extended: false, robe: false });
            }}
            className={`border rounded-xl p-3 cursor-pointer ${
              selectedTreatment === t.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              BT-03
            </span>
            <div className="text-sm font-medium mt-2 text-gray-900">{t.name}</div>
            <div className="text-xs text-gray-500">{t.subtitle}</div>
            <div className="text-sm font-medium mt-2 text-gray-900">${t.price}</div>
          </div>
        ))}
      </div>

      {tx && (
        <>
          <div className="text-xs uppercase text-gray-400 mb-2">Date</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {dates.map((d) => (
              <div
                key={d}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedTherapist(null);
                  setSelectedSlot(null);
                }}
                className={`border rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  selectedDate === d
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {selectedDate && (
            <>
              <div className="text-xs uppercase text-gray-400 mb-2">Choose Your Therapist</div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {therapists.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTherapist(t.id);
                      setSelectedSlot(null);
                    }}
                    className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer ${
                      selectedTherapist === t.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {t.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                        {t.preferred && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 rounded-full">
                            Your usual
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">★ {t.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {therapist && (
            <>
              <div className="text-xs uppercase text-gray-400 mb-2">Time</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {therapist.slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`rounded-lg px-3 py-2 text-sm cursor-pointer ${
                      selectedSlot === s
                        ? "bg-violet-500 text-white"
                        : "border border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedSlot && (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="text-xs uppercase text-gray-400 mb-2">Add-ons</div>
              {addOnList.map((a) => (
                <button
                  key={a.key}
                  onClick={() => setAddOns((o) => ({ ...o, [a.key]: !o[a.key] }))}
                  className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 mb-2 text-sm ${
                    addOns[a.key]
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <span>
                    {a.label} +${a.price}
                  </span>
                  <span>{addOns[a.key] ? "✓" : "+"}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  if (!tx || !selectedDate || !selectedSlot) return;
                  addToCart({
                    btBadge: "BT-03",
                    name: tx.name,
                    price: total,
                    vertical: "Spas & Wellness",
                    date: selectedDate,
                    time: selectedSlot + " (" + tx.subtitle.split("·")[0].trim() + ")",
                    qty: 1,
                  });
                  resetSel();
                  setActiveCategory("massage");
                }}
                className="w-full mt-2 bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700"
              >
                {tx?.name} · {therapist?.name} · {selectedSlot} · ${total.toFixed(2)}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
