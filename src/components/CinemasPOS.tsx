import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

type Showtime = { t: string; spots: number };
type Film = {
  id: string;
  bt: string;
  name: string;
  genre: string;
  type: "ga" | "seated";
  price: number;
  showtimes: Showtime[];
};

const films: Film[] = [
  {
    id: "f1",
    bt: "BT-06",
    name: "Cinema · Standard",
    genre: "Headcount only",
    type: "ga",
    price: 18,
    showtimes: [
      { t: "10:00", spots: 187 },
      { t: "12:30", spots: 33 },
      { t: "15:00", spots: 0 },
      { t: "17:30", spots: 201 },
      { t: "20:00", spots: 219 },
    ],
  },
  {
    id: "f2",
    bt: "BT-06",
    name: "Comedy Night · GA",
    genre: "Standing room",
    type: "ga",
    price: 22,
    showtimes: [
      { t: "11:00", spots: 120 },
      { t: "19:30", spots: 80 },
      { t: "22:00", spots: 60 },
    ],
  },
  {
    id: "f3",
    bt: "BT-07",
    name: "Cinema · Premium Assigned",
    genre: "Select your seat",
    type: "seated",
    price: 24,
    showtimes: [
      { t: "14:00", spots: 87 },
      { t: "19:30", spots: 42 },
    ],
  },
  {
    id: "f4",
    bt: "BT-07",
    name: "Dolby Atmos · Assigned",
    genre: "Premium front section",
    type: "seated",
    price: 32,
    showtimes: [
      { t: "18:00", spots: 40 },
      { t: "21:00", spots: 38 },
    ],
  },
];

const tiers = [
  { id: "adult", label: "Adult", adj: 0 },
  { id: "child", label: "Child (under 12)", adj: -4 },
  { id: "senior", label: "Senior", adj: -2 },
];

const initialTakenSeats = ["A1", "A2", "A3", "B12", "B13", "B14", "D6", "D7", "D8", "E1", "E14"];
const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = Array.from({ length: 14 }, (_, i) => i + 1);

export function CinemasPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [filmsData, setFilmsData] = useState<Film[]>(films);
  const [takenSeats, setTakenSeats] = useState<string[]>(initialTakenSeats);
  const [selectedFilm, setSelectedFilm] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketQtys, setTicketQtys] = useState<Record<string, number>>({});

  const film = filmsData.find((f) => f.id === selectedFilm) ?? null;
  const totalQty = Object.values(ticketQtys).reduce((s, v) => s + v, 0);
  const totalPrice = film
    ? tiers.reduce((s, t) => s + (ticketQtys[t.id] || 0) * (film.price + t.adj), 0)
    : 0;

  const resetAll = () => {
    setSelectedFilm(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setTicketQtys({});
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cinemas</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {filmsData.map((f) => {
          const active = selectedFilm === f.id;
          return (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFilm(f.id);
                setSelectedShowtime(null);
                setSelectedSeats([]);
                setTicketQtys({});
              }}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                active
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
              }`}
            >
              <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                {f.bt}
              </span>
              <div className="text-sm font-medium mt-2">{f.name}</div>
              <div className="text-xs text-gray-500">{f.genre}</div>
              <div className="text-sm font-medium mt-2">From ${f.price}</div>
            </div>
          );
        })}
      </div>

      {film && (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="text-xs uppercase text-gray-400 mb-2">Select showtime</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {film.showtimes.map((s) => {
              const soldOut = s.spots === 0;
              const isSelected = selectedShowtime === s.t;
              const low = s.spots > 0 && s.spots < 50;
              const cls = soldOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isSelected
                  ? "border border-violet-400 bg-violet-50 text-violet-700 font-medium cursor-pointer"
                  : low
                    ? "border border-amber-400 bg-amber-50 text-amber-700 cursor-pointer"
                    : "border border-gray-200 bg-white hover:border-violet-300 cursor-pointer";
              return (
                <div
                  key={s.t}
                  onClick={() => {
                    if (!soldOut) {
                      setSelectedShowtime(s.t);
                      setSelectedSeats([]);
                      setTicketQtys({});
                    }
                  }}
                  className={`rounded-lg p-2 text-center text-xs ${cls}`}
                >
                  <div className="text-sm font-medium">{s.t}</div>
                  <div className="text-xs">{soldOut ? "Sold out" : `${s.spots} left`}</div>
                </div>
              );
            })}
          </div>

          {selectedShowtime && film.type === "ga" && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Ticket types</div>
              {tiers.map((tier) => {
                const qty = ticketQtys[tier.id] || 0;
                return (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div>
                      <span className="text-sm text-gray-700">{tier.label}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ${film.price + tier.adj}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setTicketQtys((q) => ({ ...q, [tier.id]: Math.max(0, qty - 1) }))
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{qty}</span>
                      <button
                        onClick={() =>
                          setTicketQtys((q) => ({ ...q, [tier.id]: qty + 1 }))
                        }
                        className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedShowtime && film.type === "seated" && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Select your seats</div>
              <div className="w-full h-2 bg-gray-800 rounded mb-3 flex items-center justify-center text-white text-xs">
                SCREEN
              </div>
              <div className="flex flex-col items-center">
                {rows.map((r) => (
                  <div key={r} className="flex items-center">
                    <span className="text-xs text-gray-400 w-4 mr-1">{r}</span>
                    {cols.map((c) => {
                      const key = `${r}${c}`;
                      const taken = takenSeats.includes(key);
                      const sel = selectedSeats.includes(key);
                      const cls = taken
                        ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                        : sel
                          ? "bg-violet-500 border-violet-600"
                          : "bg-gray-100 border-gray-300 hover:bg-violet-100 hover:border-violet-300";
                      return (
                        <div
                          key={key}
                          onClick={() => {
                            if (taken) return;
                            setSelectedSeats((prev) =>
                              prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
                            );
                          }}
                          className={`w-5 h-5 rounded-sm border m-0.5 cursor-pointer ${cls}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs mt-2">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm" />
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm" />
                  Taken
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-violet-500 rounded-sm" />
                  Selected
                </span>
              </div>
            </div>
          )}

          {selectedShowtime && (
            <button
              disabled={
                film.type === "ga" ? totalQty === 0 : selectedSeats.length === 0
              }
              onClick={() => {
                const price =
                  film.type === "ga" ? totalPrice : selectedSeats.length * film.price;
                addToCart({
                  btBadge: film.bt,
                  name: film.name,
                  price,
                  vertical: "Cinemas",
                  date: "2026-06-14",
                  time: selectedShowtime,
                });
                // Decrement inventory
                if (film.type === "ga") {
                  setFilmsData((prev) =>
                    prev.map((f) =>
                      f.id === film.id
                        ? {
                            ...f,
                            showtimes: f.showtimes.map((s) =>
                              s.t === selectedShowtime
                                ? { ...s, spots: Math.max(0, s.spots - totalQty) }
                                : s,
                            ),
                          }
                        : f,
                    ),
                  );
                } else {
                  setTakenSeats((prev) => [...prev, ...selectedSeats]);
                }
                resetAll();
              }}
              className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
            >
              {film.type === "ga"
                ? totalQty > 0
                  ? `Add ${totalQty} tickets · $${totalPrice.toFixed(2)}`
                  : "Select tickets above"
                : selectedSeats.length > 0
                  ? `Add ${selectedSeats.length} seats · $${(selectedSeats.length * film.price).toFixed(2)}`
                  : "Select seats above"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
