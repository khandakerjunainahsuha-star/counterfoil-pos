import { useState } from "react";

type Tier = { id: string; label: string; price: number; free?: boolean };
type Product = {
  id: string;
  bt: string;
  name: string;
  subtitle: string;
  tiers: Tier[];
  note?: string;
  validWindow?: string;
};

const products: Product[] = [
  {
    id: "admission",
    bt: "BT-01",
    name: "General Admission",
    subtitle: "Open entry · no time slot required",
    tiers: [
      { id: "adult", label: "Adult", price: 18 },
      { id: "child", label: "Child (5–15)", price: 10 },
      { id: "senior", label: "Senior (65+)", price: 12 },
      { id: "infant", label: "Under 5", price: 0, free: true },
    ],
    note: "BT-01 · No visit date required for this ticket type",
  },
  {
    id: "summer",
    bt: "BT-02",
    name: "Summer Season Pass",
    subtitle: "Valid any day · May 1 – Sep 30",
    tiers: [
      { id: "adult", label: "Adult Pass", price: 85 },
      { id: "family", label: "Family (2 adults + 3 children)", price: 180 },
    ],
    validWindow: "May 1, 2026 — September 30, 2026",
  },
  {
    id: "annual",
    bt: "BT-02",
    name: "Annual Membership",
    subtitle: "12 months from purchase · includes guest passes",
    tiers: [
      { id: "individual", label: "Individual", price: 120 },
      { id: "joint", label: "Joint (2 people)", price: 190 },
    ],
    validWindow: "12 months from today",
  },
];

export function MuseumsGalleriesPOS({
  addToCart,
}: {
  addToCart: (item: {
    btBadge: string;
    name: string;
    price: number;
    vertical: string;
    date: string;
    time: string;
  }) => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  const prod = products.find((p) => p.id === selectedProduct);
  const totalQty = Object.values(qtys).reduce((s, v) => s + v, 0);
  const totalPrice = prod
    ? prod.tiers.reduce((s, t) => s + (qtys[t.id] || 0) * (t.free ? 0 : t.price), 0)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Museums & Galleries</h1>
        <p className="text-sm text-gray-500 mt-1">Select a ticket type to configure</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProduct(p.id);
              setQtys({});
            }}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedProduct === p.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
            }`}
          >
            <div className="text-xs font-medium text-violet-600 mb-1">{p.bt}</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">{p.name}</div>
            <div className="text-xs text-gray-500">{p.subtitle}</div>
          </div>
        ))}
      </div>

      {prod && (
        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-semibold text-gray-900">{prod.name}</div>
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded">
              {prod.bt}
            </span>
          </div>

          {prod.validWindow && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-500 mb-1">Valid for any visit between:</div>
              <div className="text-sm font-medium text-gray-900">{prod.validWindow}</div>
            </div>
          )}

          {prod.note && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-600">{prod.note}</div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {prod.tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between py-2 px-3 border border-gray-100 rounded-lg"
              >
                <div>
                  <div className="text-sm text-gray-900">{tier.label}</div>
                  <div className="text-xs text-gray-500">
                    {tier.free ? "Free" : `$${tier.price}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setQtys((q) => ({
                        ...q,
                        [tier.id]: Math.max(0, (q[tier.id] || 0) - 1),
                      }))
                    }
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm text-gray-900">
                    {qtys[tier.id] || 0}
                  </span>
                  <button
                    onClick={() =>
                      setQtys((q) => ({ ...q, [tier.id]: (q[tier.id] || 0) + 1 }))
                    }
                    className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={totalQty === 0}
            onClick={() => {
              addToCart({
                btBadge: prod.bt,
                name: prod.name,
                price: totalPrice,
                vertical: "Museums & Galleries",
                date: prod.validWindow || "Open entry",
                time: "Any time",
              });
              setSelectedProduct(null);
              setQtys({});
            }}
            className={`w-full rounded-xl py-3 text-sm font-medium transition-colors ${
              totalQty > 0
                ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {totalQty > 0
              ? `Add ${totalQty} ticket${totalQty !== 1 ? "s" : ""} · $${totalPrice.toFixed(2)}`
              : "Select tickets above"}
          </button>
        </div>
      )}
    </div>
  );
}
