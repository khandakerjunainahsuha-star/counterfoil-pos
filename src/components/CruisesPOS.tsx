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

type Sailing = { id: string; label: string; tables: number };
type Area = { id: string; label: string; price: number; tables: string[] };
type Cruise = {
  id: string;
  bt: string;
  name: string;
  subtitle: string;
  type: "seating" | "ga";
  sailings?: Sailing[];
  areas?: Area[];
  price?: { adult: number; child: number };
  cap?: { filled: number; total: number };
};

const cruises: Cruise[] = [
  {
    id: "dinner",
    bt: "BT-07",
    name: "Sunset Dinner Cruise",
    subtitle: "4 hrs · departs 7:00 PM",
    type: "seating",
    sailings: [
      { id: "fri", label: "Fri 14 Jun · 7:00 PM", tables: 18 },
      { id: "sat", label: "Sat 15 Jun · 7:00 PM", tables: 32 },
      { id: "sun", label: "Sun 16 Jun · 7:00 PM", tables: 4 },
    ],
    areas: [
      { id: "outdoor", label: "Outdoor Deck", price: 85, tables: ["O1", "O2", "O3", "O4", "O5"] },
      { id: "indoor", label: "Indoor Dining", price: 95, tables: ["I1", "I2", "I3", "I4", "I5"] },
      { id: "vip", label: "VIP Lounge", price: 145, tables: ["V1", "V2", "V3", "V4"] },
    ],
  },
  {
    id: "brunch",
    bt: "BT-07",
    name: "Champagne Brunch Cruise",
    subtitle: "3 hrs · departs 11:00 AM",
    type: "seating",
    sailings: [{ id: "sun", label: "Sun 15 Jun · 11:00 AM", tables: 6 }],
    areas: [
      { id: "indoor", label: "Indoor Dining", price: 65, tables: ["I1", "I2", "I3", "I4", "I5", "I6"] },
      { id: "vip", label: "VIP Lounge", price: 95, tables: ["V1", "V2", "V3"] },
    ],
  },
  {
    id: "ferry",
    bt: "BT-06",
    name: "City Sightseeing Ferry",
    subtitle: "90 min loop · open deck",
    type: "ga",
    price: { adult: 22, child: 14 },
    cap: { filled: 44, total: 120 },
  },
];

export function CruisesPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedCruise, setSelectedCruise] = useState<string | null>(null);
  const [selectedSailing, setSelectedSailing] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [gaQtys, setGaQtys] = useState<{ adult: number; child: number }>({ adult: 0, child: 0 });

  const reset = () => {
    setSelectedCruise(null);
    setSelectedSailing(null);
    setSelectedArea(null);
    setSelectedTable(null);
    setGuestCount(2);
    setGaQtys({ adult: 0, child: 0 });
  };

  const cruise = cruises.find((c) => c.id === selectedCruise) || null;
  const area = cruise?.areas?.find((a) => a.id === selectedArea) || null;
  const gaTotal = cruise?.price
    ? gaQtys.adult * cruise.price.adult + gaQtys.child * cruise.price.child
    : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Cruises & Ferries</h1>
      <p className="text-sm text-gray-500 mb-6">Sailings, seatings, and ferry tickets</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {cruises.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedCruise(c.id);
              setSelectedSailing(null);
              setSelectedArea(null);
              setSelectedTable(null);
              setGuestCount(2);
              setGaQtys({ adult: 0, child: 0 });
            }}
            className={`border rounded-xl p-3 cursor-pointer ${
              selectedCruise === c.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              {c.bt}
            </span>
            <div className="text-sm font-medium mt-2 text-gray-900">{c.name}</div>
            <div className="text-xs text-gray-500">{c.subtitle}</div>
          </div>
        ))}
      </div>

      {cruise && cruise.type === "ga" && cruise.price && (
        <div className="border border-gray-200 rounded-xl p-4">
          {(["adult", "child"] as const).map((k) => (
            <div
              key={k}
              className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0"
            >
              <div>
                <div className="text-sm text-gray-900 capitalize">{k}</div>
                <div className="text-xs text-gray-500">${cruise.price![k]}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGaQtys((q) => ({ ...q, [k]: Math.max(0, q[k] - 1) }))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{gaQtys[k]}</span>
                <button
                  onClick={() => setGaQtys((q) => ({ ...q, [k]: q[k] + 1 }))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            disabled={gaTotal === 0}
            onClick={() => {
              addToCart({
                btBadge: cruise.bt,
                name: cruise.name,
                price: gaTotal,
                vertical: "Cruises & Ferries",
                date: "2026-06-14",
                time: "Any departure",
                qty: 1,
              });
              reset();
            }}
            className={`w-full mt-4 rounded-xl py-3 text-sm font-semibold ${
              gaTotal > 0
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to cart · ${gaTotal.toFixed(2)}
          </button>
        </div>
      )}

      {cruise && cruise.type === "seating" && cruise.sailings && cruise.areas && (
        <div>
          <div className="text-xs uppercase text-gray-400 mb-2">Sailing</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {cruise.sailings.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSailing(s.id);
                  setSelectedArea(null);
                  setSelectedTable(null);
                }}
                className={`border rounded-xl px-3 py-2 text-sm cursor-pointer ${
                  selectedSailing === s.id
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                <div>{s.label}</div>
                <div className={`text-xs ${s.tables <= 6 ? "text-amber-600" : "text-gray-500"}`}>
                  {s.tables} tables
                </div>
              </div>
            ))}
          </div>

          {selectedSailing && (
            <>
              <div className="text-xs uppercase text-gray-400 mb-2">Area</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {cruise.areas.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedArea(a.id);
                      setSelectedTable(null);
                    }}
                    className={`border rounded-xl p-3 cursor-pointer text-center ${
                      selectedArea === a.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{a.label}</div>
                    <div className="text-xs text-gray-500">${a.price}/person</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {area && (
            <>
              <div className="text-xs uppercase text-gray-400 mb-2">Select Table</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {area.tables.map((t, i) => {
                  const reserved = i === 0;
                  if (reserved) {
                    return (
                      <span
                        key={t}
                        className="bg-gray-400 text-white cursor-not-allowed text-xs px-3 py-1.5 rounded-lg"
                      >
                        {t} · Reserved
                      </span>
                    );
                  }
                  const active = selectedTable === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTable(t)}
                      className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${
                        active
                          ? "bg-violet-500 text-white"
                          : "bg-green-100 text-green-700 hover:bg-violet-100"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {area && selectedTable && (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="text-xs uppercase text-gray-400 mb-2">Guests</div>
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setGuestCount((v) => Math.max(1, v - 1))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-lg font-medium w-6 text-center">{guestCount}</span>
                <button
                  onClick={() => setGuestCount((v) => v + 1)}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
                <div className="text-sm font-medium text-gray-700">
                  ${area.price} × {guestCount} = ${(guestCount * area.price).toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => {
                  addToCart({
                    btBadge: "BT-07",
                    name: cruise.name + " — " + area.label,
                    price: guestCount * area.price,
                    vertical: "Cruises & Ferries",
                    date: "2026-06-14",
                    time: "19:00",
                    qty: 1,
                  });
                  reset();
                }}
                className="w-full mt-2 bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700"
              >
                Add to cart · Table {selectedTable} · ${(guestCount * area.price).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
