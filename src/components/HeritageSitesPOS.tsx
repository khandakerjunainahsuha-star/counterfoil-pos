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

const products: Product[] = [
  {
    id: "day",
    bt: "BT-01",
    name: "Garden Day Admission",
    subtitle: "Open entry · stroll at your pace",
    tiers: [
      { id: "adult", label: "Adult", price: 14 },
      { id: "concession", label: "Concession", price: 10 },
      { id: "junior", label: "Junior (U16)", price: 7 },
      { id: "infant", label: "Under 5", price: 0, free: true },
    ],
  },
  {
    id: "season",
    bt: "BT-02",
    name: "Spring & Summer Season Pass",
    subtitle: "Valid any day · Apr 1 – Sep 30",
    tiers: [
      { id: "adult", label: "Adult Pass", price: 52 },
      { id: "concession", label: "Concession Pass", price: 38 },
    ],
    window: "April 1 – September 30, 2026",
  },
  {
    id: "annual",
    bt: "BT-02",
    name: "Annual Friends Membership",
    subtitle: "12 months from purchase",
    tiers: [
      { id: "individual", label: "Individual", price: 95 },
      { id: "joint", label: "Joint", price: 155 },
    ],
    window: "12 months from today",
  },
  {
    id: "walk",
    bt: "BT-09",
    name: "Guided Garden Walk",
    subtitle: "90 min · expert-led · max 15",
    price: 18,
    sessions: [
      { id: "s1", guide: "Eleanor P.", time: "11:00 AM", date: "Sat 14 Jun", spots: 8 },
      { id: "s2", guide: "Tom H.", time: "2:00 PM", date: "Sat 14 Jun", spots: 15 },
      { id: "s3", guide: "Eleanor P.", time: "11:00 AM", date: "Sun 15 Jun", spots: 15 },
    ],
  },
  {
    id: "private",
    bt: "BT-09",
    name: "Private Garden Tour",
    subtitle: "Exclusive · min 8 people · 2 hrs",
    price: 28,
    sessions: [
      { id: "p1", guide: "To be assigned", time: "By arrangement", date: "Any date", spots: 99 },
    ],
  },
];

export function HeritageSitesPOS({ addToCart }: { addToCart: AddToCartFn }) {
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

  const prod = products.find((p) => p.id === selectedProduct) || null;
  const tierTotal = prod?.tiers
    ? prod.tiers.reduce((s, t) => s + (qtys[t.id] || 0) * (t.free ? 0 : t.price), 0)
    : 0;
  const sessObj = prod?.sessions?.find((s) => s.id === selectedSession) || null;
  const sessTotal = sessObj && prod?.price ? groupSize * prod.price : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Heritage Sites & Gardens</h1>
      <p className="text-sm text-gray-500 mb-6">Tickets, passes, and guided experiences</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {products.map((p) => (
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
            <div
              key={t.id}
              className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0"
            >
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
                vertical: "Heritage Sites & Gardens",
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
                    vertical: "Heritage Sites & Gardens",
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
