import { useState } from "react";
import { BlockedNotice } from "./BlockedNotice";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

type AgeId = "adult" | "child" | "infant" | "senior";

type Tier = {
  id: string;
  name: string;
  subtitle: string;
  prices: Record<AgeId, number>;
  benefits: string[];
  missing: string[];
  soldOut: boolean;
};

const tiers: Tier[] = [
  {
    id: "standard",
    name: "Standard Day Pass",
    subtitle: "General entry + all base rides",
    prices: { adult: 58, child: 42, senior: 50, infant: 0 },
    benefits: ["Full park entry", "All standard rides"],
    missing: ["FastPass", "Dining credit"],
    soldOut: true,
  },
  {
    id: "premium",
    name: "Premium Day Pass",
    subtitle: "Entry + FastPass for top 5 rides",
    prices: { adult: 89, child: 65, senior: 75, infant: 0 },
    benefits: ["Full park entry", "All rides", "FastPass · 5 credits"],
    missing: ["Dining credit"],
    soldOut: false,
  },
  {
    id: "vip",
    name: "VIP Day Pass",
    subtitle: "Unlimited FastPass + $30 dining credit",
    prices: { adult: 129, child: 95, senior: 110, infant: 0 },
    benefits: [
      "Full park entry",
      "All rides",
      "Unlimited FastPass",
      "$30 dining credit",
      "Reserved show seating",
    ],
    missing: [],
    soldOut: false,
  },
];

const dates = [
  { d: "Sat 14", mult: 1.2, demand: "high" },
  { d: "Sun 15", mult: 1, demand: "normal" },
  { d: "Mon 16", mult: 0.85, demand: "low" },
  { d: "Tue 17", mult: 0.85, demand: "low" },
  { d: "Fri 20", mult: 1.1, demand: "high" },
  { d: "Sat 21", mult: 1.3, demand: "very-high" },
];

const ageGroups: { id: AgeId; label: string; free?: boolean }[] = [
  { id: "adult", label: "Adult (18+)" },
  { id: "child", label: "Child (3–17)" },
  { id: "infant", label: "Infant (free)", free: true },
  { id: "senior", label: "Senior (65+)" },
];

const fastpassRides = [
  { id: "thunder" as const, label: "Thunder Mountain 11:00 AM" },
  { id: "galaxy" as const, label: "Galaxy Coaster 2:00 PM" },
  { id: "splash" as const, label: "Splash Falls 4:00 PM" },
];

export function AmusementParksPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<AgeId, number>>({
    adult: 0,
    child: 0,
    infant: 0,
    senior: 0,
  });
  const [fastpass, setFastpass] = useState({ thunder: false, galaxy: false, splash: false });

  const tier = tiers.find((t) => t.id === selectedTier) ?? null;
  const dateObj = dates.find((d) => d.d === selectedDate) ?? null;
  const totalQty = Object.values(qtys).reduce((s, v) => s + v, 0);
  const totalPrice =
    tier && dateObj
      ? ageGroups.reduce(
          (s, a) =>
            s + (qtys[a.id] || 0) * (a.free ? 0 : tier.prices[a.id] * dateObj.mult),
          0,
        )
      : 0;
  const hasFastpass = !!tier?.benefits.some((b) => b.includes("FastPass"));

  const resetAll = () => {
    setSelectedTier(null);
    setSelectedDate(null);
    setQtys({ adult: 0, child: 0, infant: 0, senior: 0 });
    setFastpass({ thunder: false, galaxy: false, splash: false });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Amusement & Theme Parks</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {tiers.map((t) => {
          const active = selectedTier === t.id;
          const base = "border rounded-xl p-4 transition-all";
          const cls = t.soldOut
            ? `${base} opacity-60 cursor-not-allowed border-gray-200 bg-gray-50`
            : active
              ? `${base} border-violet-400 bg-violet-50 cursor-pointer`
              : `${base} border-gray-200 hover:border-violet-300 cursor-pointer`;
          return (
            <div
              key={t.id}
              onClick={() => {
                if (t.soldOut) return;
                setSelectedTier(t.id);
                setSelectedDate(null);
                setQtys({ adult: 0, child: 0, infant: 0, senior: 0 });
                setFastpass({ thunder: false, galaxy: false, splash: false });
              }}
              className={cls}
            >
              <span className="text-xs font-medium text-violet-700 bg-violet-100 rounded px-1.5 py-0.5">
                BT-08
              </span>
              <div className="text-sm font-medium mt-2">{t.name}</div>
              <div className="text-xs text-gray-500">{t.subtitle}</div>
              <div className="mt-2 space-y-0.5">
                {t.benefits.map((b) => (
                  <div key={b} className="text-xs text-green-700">
                    ✓ {b}
                  </div>
                ))}
                {t.missing.map((m) => (
                  <div key={m} className="text-xs text-gray-400">
                    ✗ {m}
                  </div>
                ))}
              </div>
              {t.soldOut && (
                <div className="text-xs text-red-500 mt-2">Sold out today</div>
              )}
            </div>
          );
        })}
      </div>

      {tier && (
        <div>
          <div className="text-xs uppercase text-gray-400 mb-2">Select date</div>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {dates.map((d) => {
              const active = selectedDate === d.d;
              return (
                <div
                  key={d.d}
                  onClick={() => setSelectedDate(d.d)}
                  className={`border rounded-xl px-3 py-2 text-xs cursor-pointer shrink-0 ${
                    active
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  <div className="text-sm font-medium">{d.d}</div>
                  <div className="text-xs text-gray-500">
                    ${(tier.prices.adult * d.mult).toFixed(0)}
                  </div>
                  {d.demand === "very-high" && (
                    <div className="text-xs text-amber-600">⚡ High demand</div>
                  )}
                </div>
              );
            })}
          </div>

          {dateObj && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Tickets</div>
              {ageGroups.map((age) => {
                const qty = qtys[age.id];
                const unit = age.free ? 0 : tier.prices[age.id] * dateObj.mult;
                return (
                  <div
                    key={age.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div>
                      <span className="text-sm text-gray-700">{age.label}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {age.free ? "Free" : `$${unit.toFixed(0)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQtys((q) => ({ ...q, [age.id]: Math.max(0, q[age.id] - 1) }))
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{qty}</span>
                      <button
                        onClick={() =>
                          setQtys((q) => ({ ...q, [age.id]: q[age.id] + 1 }))
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
              {totalQty > 0 && (
                <div className="text-sm font-medium mt-2">${totalPrice.toFixed(2)}</div>
              )}

              {totalQty > 0 && hasFastpass && (
                <div className="mt-4">
                  <div className="text-xs uppercase text-gray-400 mb-2">
                    Pre-book FastPass (optional)
                  </div>
                  {fastpassRides.map((r) => {
                    const on = fastpass[r.id];
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between py-1.5 border-b border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{r.label}</span>
                        <button
                          onClick={() =>
                            setFastpass((p) => ({ ...p, [r.id]: !p[r.id] }))
                          }
                          className={
                            on
                              ? "bg-violet-100 text-violet-700 border border-violet-400 text-xs px-2 py-0.5 rounded-full"
                              : "border border-gray-300 text-gray-500 text-xs px-2 py-0.5 rounded-full hover:border-violet-300"
                          }
                        >
                          {on ? "✓ Booked" : "+ Book"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                disabled={totalQty === 0}
                onClick={() => {
                  addToCart({
                    btBadge: "BT-08",
                    name: tier.name,
                    price: totalPrice,
                    vertical: "Amusement & Theme Parks",
                    date: `${selectedDate}, 2026`,
                    time: "Full day",
                  });
                  resetAll();
                }}
                className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                {totalQty > 0
                  ? `Add ${totalQty} passes · $${totalPrice.toFixed(2)}`
                  : "Select tickets above"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
