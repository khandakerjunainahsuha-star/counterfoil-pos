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

type Tier = { id: string; label: string; price: number; free?: boolean };
type Session = { id: string; guide: string; time: string; date: string; spots: number };
type Product = {
  id: string;
  bt: string;
  name: string;
  subtitle: string;
  tiers?: Tier[];
  sessions?: Session[];
  price?: number;
  window?: string;
};

const sections = [
  { id: "entry", label: "General Entry" },
  { id: "passes", label: "Annual Passes" },
  { id: "experiences", label: "Special Experiences" },
];

const products: Record<string, Product[]> = {
  entry: [
    {
      id: "admission",
      bt: "BT-01",
      name: "General Admission",
      subtitle: "Open entry · no time slot",
      tiers: [
        { id: "adult", label: "Adult", price: 24 },
        { id: "child", label: "Child 3–15", price: 16 },
        { id: "infant", label: "Under 3", price: 0, free: true },
      ],
    },
  ],
  passes: [
    {
      id: "adult_annual",
      bt: "BT-02",
      name: "Adult Annual Pass",
      subtitle: "12 months · any visit day",
      tiers: [{ id: "adult", label: "Adult Pass", price: 120 }],
      window: "12 months from today",
    },
    {
      id: "family_annual",
      bt: "BT-02",
      name: "Family Annual Pass (2+3)",
      subtitle: "2 adults + 3 children · 12 months",
      tiers: [{ id: "family", label: "Family Pass", price: 240 }],
      window: "12 months from today",
    },
  ],
  experiences: [
    {
      id: "feeding",
      bt: "BT-09",
      name: "Animal Feeding Session",
      subtitle: "30 min · guide-led · max 12",
      price: 35,
      sessions: [
        { id: "t1", guide: "Marcus R.", time: "3:00 PM", date: "Tue 17 Jun", spots: 6 },
        { id: "t2", guide: "Sarah T.", time: "3:00 PM", date: "Wed 18 Jun", spots: 12 },
        { id: "t3", guide: "Marcus R.", time: "11:00 AM", date: "Fri 20 Jun", spots: 2 },
      ],
    },
    {
      id: "keeper",
      bt: "BT-09",
      name: "Keeper for a Day",
      subtitle: "Behind-the-scenes · 3 hrs",
      price: 95,
      sessions: [{ id: "k1", guide: "James P.", time: "9:00 AM", date: "Fri 20 Jun", spots: 2 }],
    },
  ],
};

export function ZoosPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [activeSection, setActiveSection] = useState("entry");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(1);

  const reset = () => {
    setSelectedProduct(null);
    setQtys({});
    setSelectedSession(null);
    setGroupSize(1);
  };

  const current = products[activeSection] || [];
  const allProds = [...products.entry, ...products.passes, ...products.experiences];
  const prod = allProds.find((p) => p.id === selectedProduct) || null;

  const tierTotal = prod?.tiers
    ? prod.tiers.reduce((s, t) => s + (qtys[t.id] || 0) * (t.free ? 0 : t.price), 0)
    : 0;

  const sessObj = prod?.sessions?.find((s) => s.id === selectedSession) || null;
  const sessTotal = sessObj && prod?.price ? groupSize * prod.price : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Zoos & Wildlife Parks</h1>
      <p className="text-sm text-gray-500 mb-6">Tickets, passes, and experiences</p>

      <div className="flex gap-2 mb-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id);
              setSelectedProduct(null);
              setQtys({});
              setSelectedSession(null);
              setGroupSize(1);
            }}
            className={`rounded-lg px-4 py-2 text-sm cursor-pointer ${
              activeSection === s.id
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {current.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProduct(p.id);
              setQtys({});
              setSelectedSession(null);
              setGroupSize(1);
            }}
            className={`border rounded-xl p-3 cursor-pointer ${
              selectedProduct === p.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              {p.bt}
            </span>
            <div className="text-sm font-medium mt-2 text-gray-900">{p.name}</div>
            <div className="text-xs text-gray-500">{p.subtitle}</div>
          </div>
        ))}
      </div>

      {prod && prod.tiers && (
        <div className="border border-gray-200 rounded-xl p-4">
          {prod.tiers.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0">
              <div>
                <div className="text-sm text-gray-900">{t.label}</div>
                <div className="text-xs text-gray-500">{t.free ? "Free" : `$${t.price}`}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setQtys((q) => ({ ...q, [t.id]: Math.max(0, (q[t.id] || 0) - 1) }))
                  }
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{qtys[t.id] || 0}</span>
                <button
                  onClick={() => setQtys((q) => ({ ...q, [t.id]: (q[t.id] || 0) + 1 }))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          {prod.window && (
            <div className="text-xs text-gray-500 mt-3">Validity: {prod.window}</div>
          )}
          <button
            disabled={tierTotal === 0}
            onClick={() => {
              addToCart({
                btBadge: prod.bt,
                name: prod.name,
                price: tierTotal,
                vertical: "Zoos & Wildlife Parks",
                date: prod.window || "Open entry",
                time: "Any time",
                qty: 1,
              });
              reset();
            }}
            className={`w-full mt-4 rounded-xl py-3 text-sm font-semibold ${
              tierTotal > 0
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to cart · ${tierTotal.toFixed(2)}
          </button>
        </div>
      )}

      {prod && prod.sessions && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="text-xs uppercase text-gray-400 mb-3">Available Sessions</div>
          {prod.sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSession(s.id);
                setGroupSize(1);
              }}
              className={`border rounded-xl p-3 mb-2 cursor-pointer ${
                selectedSession === s.id
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="text-sm font-medium text-gray-900">
                {s.date} · {s.time}
              </div>
              <div className="text-xs text-gray-500">Guide: {s.guide}</div>
              <div className="text-xs text-gray-500">{s.spots} spots</div>
            </div>
          ))}

          {sessObj && (
            <>
              <div className="text-xs uppercase text-gray-400 mb-2 mt-4">Group Size</div>
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setGroupSize((v) => Math.max(1, v - 1))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-lg font-medium w-6 text-center">{groupSize}</span>
                <button
                  onClick={() => setGroupSize((v) => Math.min(sessObj.spots, v + 1))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
                <div className="text-sm font-medium text-gray-700">
                  ${prod.price} × {groupSize} = ${sessTotal.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => {
                  addToCart({
                    btBadge: prod.bt,
                    name: prod.name,
                    price: sessTotal,
                    vertical: "Zoos & Wildlife Parks",
                    date: sessObj.date,
                    time: sessObj.time,
                    qty: 1,
                  });
                  reset();
                }}
                className="w-full mt-2 bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700"
              >
                Add to cart · ${sessTotal.toFixed(2)}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
