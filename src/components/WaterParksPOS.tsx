import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

const passes = [
  {
    id: "standard",
    bt: "BT-08",
    name: "Standard Day Pass",
    subtitle: "All pools & slides",
    prices: { adult: 42, child: 30, infant: 0 } as Record<string, number>,
    cap: { used: 387, total: 500, left: 113 },
  },
  {
    id: "premium",
    bt: "BT-08",
    name: "Premium Day Pass",
    subtitle: "Standard + Wave Pool priority + locker",
    prices: { adult: 62, child: 45, infant: 0 } as Record<string, number>,
    cap: { used: 94, total: 200, left: 106 },
  },
  {
    id: "group",
    bt: "BT-06",
    name: "Group / School Visit",
    subtitle: "Min 15 people · invoiced billing",
    prices: { adult: 28, child: 20, infant: 0 } as Record<string, number>,
    cap: { used: 0, total: 999, left: 999 },
  },
];

const dates = [
  { d: "Sat 14", left: 41 },
  { d: "Sun 15", left: 387 },
  { d: "Mon 16", left: 492 },
  { d: "Tue 17", left: 500 },
  { d: "Wed 18", left: 500 },
  { d: "Thu 19", left: 498 },
  { d: "Fri 20", left: 180 },
];

const ageGroups = [
  { id: "adult", label: "Adult", free: false },
  { id: "child", label: "Child (4–12)", free: false },
  { id: "infant", label: "Under 4", free: true },
];

const addOnItems = [
  { id: "locker", label: "Locker hire", price: 8 },
  { id: "towel", label: "Towel hire", price: 5 },
  { id: "ring", label: "Inflatable ring", price: 10 },
];

export function WaterParksPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [qtys, setQtys] = useState<Record<string, number>>({ adult: 0, child: 0, infant: 0 });
  const [addOns, setAddOns] = useState<Record<string, number>>({ locker: 0, towel: 0, ring: 0 });

  const pass = passes.find((p) => p.id === selectedPass);
  const subtotal = pass
    ? ageGroups.reduce(
        (s, a) => s + (qtys[a.id] || 0) * (a.free ? 0 : pass.prices[a.id]),
        0,
      )
    : 0;
  const addOnTotal = addOnItems.reduce((s, a) => s + (addOns[a.id] || 0) * a.price, 0);
  const total = subtotal + addOnTotal;

  const resetAll = () => {
    setSelectedPass(null);
    setSelectedDate(null);
    setQtys({ adult: 0, child: 0, infant: 0 });
    setAddOns({ locker: 0, towel: 0, ring: 0 });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Water Parks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {passes.map((p) => {
          const sel = selectedPass === p.id;
          const pct = (p.cap.used / p.cap.total) * 100;
          const barColor =
            pct > 85 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-green-500";
          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPass(p.id);
                setSelectedDate(null);
                setQtys({ adult: 0, child: 0, infant: 0 });
                setAddOns({ locker: 0, towel: 0, ring: 0 });
              }}
              className={`rounded-xl border p-3 cursor-pointer ${
                sel
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300"
              }`}
            >
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                {p.bt}
              </span>
              <div className="text-sm font-medium mt-2">{p.name}</div>
              <div className="text-xs text-gray-500">{p.subtitle}</div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 mt-3">
                <div
                  className={`h-1.5 rounded-full ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {p.cap.left} of {p.cap.total} left today
              </div>
            </div>
          );
        })}
      </div>

      {pass && (
        <div>
          <div className="text-xs uppercase text-gray-400 mb-2">Select date</div>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {dates.map((d) => {
              const sel = selectedDate === d.d;
              const dot =
                d.left < 50
                  ? "text-red-500"
                  : d.left < 200
                    ? "text-amber-500"
                    : "text-green-500";
              const dotChar = d.left < 50 ? "🔴" : d.left < 200 ? "🟡" : "🟢";
              return (
                <div
                  key={d.d}
                  onClick={() => setSelectedDate(d.d)}
                  className={`border rounded-xl px-3 py-2 text-xs cursor-pointer shrink-0 ${
                    sel
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  <div className="text-sm font-medium">{d.d}</div>
                  <div className={`text-xs ${dot}`}>
                    {dotChar} {d.left} left
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div>
              {ageGroups.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div>
                    <span className="text-sm text-gray-700">{a.label}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {a.free ? "Free" : `$${pass.prices[a.id]}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQtys((q) => ({ ...q, [a.id]: Math.max(0, (q[a.id] || 0) - 1) }))
                      }
                      className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{qtys[a.id] || 0}</span>
                    <button
                      onClick={() =>
                        setQtys((q) => ({ ...q, [a.id]: (q[a.id] || 0) + 1 }))
                      }
                      className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-sm font-medium mt-2">${subtotal.toFixed(2)}</div>

              {subtotal > 0 && (
                <div className="mt-4">
                  <div className="text-xs uppercase text-gray-400 mb-1">Add-ons</div>
                  {addOnItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-t border-gray-100"
                    >
                      <div>
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <span className="text-xs text-gray-500 ml-2">${item.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setAddOns((o) => ({
                              ...o,
                              [item.id]: Math.max(0, (o[item.id] || 0) - 1),
                            }))
                          }
                          className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">
                          {addOns[item.id] || 0}
                        </span>
                        <button
                          onClick={() =>
                            setAddOns((o) => ({ ...o, [item.id]: (o[item.id] || 0) + 1 }))
                          }
                          className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                disabled={subtotal === 0}
                onClick={() => {
                  addToCart({
                    btBadge: pass.bt,
                    name: pass.name,
                    price: total,
                    vertical: "Water Parks",
                    date: `${selectedDate}, 2026`,
                    time: "Full day",
                  });
                  resetAll();
                }}
                className={`w-full mt-4 rounded-xl py-3 text-sm font-semibold ${
                  subtotal > 0
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Add · ${total.toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
