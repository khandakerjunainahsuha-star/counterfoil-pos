import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

type Section = { id: string; label: string; price: number; rows: number; cols: number };
type Perf = { id: string; label: string; time: string; date: string };
type Show = { id: string; name: string; subtitle: string; perfs: Perf[]; sections: Section[] };

const shows: Show[] = [
  {
    id: "hamlet",
    name: "Hamlet",
    subtitle: "Shakespeare · 2h 45m · Drama",
    perfs: [
      { id: "eve", label: "Evening · Sat 20 Jun · 7:30 PM", time: "19:30", date: "2026-06-20" },
      { id: "mat", label: "Matinee · Sat 20 Jun · 2:00 PM", time: "14:00", date: "2026-06-20" },
    ],
    sections: [
      { id: "gallery", label: "Gallery", price: 28, rows: 3, cols: 16 },
      { id: "circle", label: "Dress Circle", price: 38, rows: 5, cols: 18 },
      { id: "stalls", label: "Stalls", price: 52, rows: 6, cols: 20 },
    ],
  },
  {
    id: "chicago",
    name: "Chicago",
    subtitle: "Musical · 2h 30m",
    perfs: [{ id: "fri", label: "Friday 26 Jun · 7:00 PM", time: "19:00", date: "2026-06-26" }],
    sections: [
      { id: "gallery", label: "Gallery", price: 32, rows: 3, cols: 16 },
      { id: "circle", label: "Dress Circle", price: 45, rows: 5, cols: 18 },
      { id: "stalls", label: "Stalls", price: 58, rows: 6, cols: 20 },
    ],
  },
  {
    id: "ballet",
    name: "Swan Lake",
    subtitle: "Ballet · 2h 15m",
    perfs: [{ id: "sun", label: "Sunday 28 Jun · 3:00 PM", time: "15:00", date: "2026-06-28" }],
    sections: [
      { id: "gallery", label: "Gallery", price: 25, rows: 3, cols: 16 },
      { id: "circle", label: "Dress Circle", price: 35, rows: 5, cols: 18 },
      { id: "stalls", label: "Stalls", price: 48, rows: 6, cols: 20 },
    ],
  },
];

const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

// Pre-taken: first 2 and last 2 of every row
function buildBaseTaken(section: Section): string[] {
  const taken: string[] = [];
  for (let r = 0; r < section.rows; r++) {
    const row = rowLabels[r];
    taken.push(`${row}1`, `${row}2`, `${row}${section.cols - 1}`, `${row}${section.cols}`);
  }
  return taken;
}

// Key: showId|perfId|sectionId
function invKey(showId: string, perfId: string, sectionId: string) {
  return `${showId}|${perfId}|${sectionId}`;
}

export function TheatresPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [selectedPerf, setSelectedPerf] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  // Tracks seats taken from previous additions, per show|perf|section
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({});

  const show = shows.find((s) => s.id === selectedShow) ?? null;
  const perf = show?.perfs.find((p) => p.id === selectedPerf) ?? null;
  const sec = show?.sections.find((s) => s.id === selectedSection) ?? null;

  const sectionTaken = (() => {
    if (!show || !perf || !sec) return [] as string[];
    const base = buildBaseTaken(sec);
    const booked = bookedMap[invKey(show.id, perf.id, sec.id)] ?? [];
    return [...base, ...booked];
  })();

  // Isolated-seat detection
  const isolatedWarning = (() => {
    if (!sec) return false;
    const occupied = new Set<string>([...sectionTaken, ...selectedSeats]);
    for (let r = 0; r < sec.rows; r++) {
      const row = rowLabels[r];
      for (let c = 2; c < sec.cols; c++) {
        const key = `${row}${c}`;
        if (occupied.has(key)) continue;
        const left = `${row}${c - 1}`;
        const right = `${row}${c + 1}`;
        if (occupied.has(left) && occupied.has(right)) return true;
      }
    }
    return false;
  })();

  const resetAll = () => {
    setSelectedShow(null);
    setSelectedPerf(null);
    setSelectedSection(null);
    setSelectedSeats([]);
  };

  const sectionStyles: Record<string, string> = {
    gallery: "bg-gray-100 hover:bg-violet-50",
    circle: "bg-gray-200 hover:bg-violet-100",
    stalls: "bg-gray-300 hover:bg-violet-200",
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Theatres & Performing Arts</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {shows.map((s) => {
          const active = selectedShow === s.id;
          return (
            <div
              key={s.id}
              onClick={() => {
                setSelectedShow(s.id);
                setSelectedPerf(null);
                setSelectedSection(null);
                setSelectedSeats([]);
              }}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                active
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
              }`}
            >
              <span className="text-xs font-medium text-violet-700 bg-violet-100 rounded px-1.5 py-0.5">
                BT-07
              </span>
              <div className="text-sm font-medium mt-2">{s.name}</div>
              <div className="text-xs text-gray-500">{s.subtitle}</div>
              <div className="text-sm font-medium mt-2">From ${s.sections[0].price}</div>
            </div>
          );
        })}
      </div>

      {show && (
        <div>
          <div className="text-xs uppercase text-gray-400 mb-2">Select performance</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {show.perfs.map((p) => {
              const active = selectedPerf === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPerf(p.id);
                    setSelectedSection(null);
                    setSelectedSeats([]);
                  }}
                  className={`border rounded-full px-3 py-1.5 text-sm cursor-pointer ${
                    active
                      ? "bg-violet-100 text-violet-700 border-violet-400"
                      : "border-gray-200 text-gray-700 hover:border-violet-300"
                  }`}
                >
                  {p.label}
                </div>
              );
            })}
          </div>

          {selectedPerf && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Choose section</div>
              <div className="border rounded-xl overflow-hidden mb-4">
                {[...show.sections].reverse().map((section) => {
                  const active = selectedSection === section.id;
                  return (
                    <div
                      key={section.id}
                      onClick={() => {
                        setSelectedSection(section.id);
                        setSelectedSeats([]);
                      }}
                      className={`w-full py-4 flex items-center justify-between px-4 cursor-pointer border-b ${
                        sectionStyles[section.id] ?? "bg-gray-100"
                      } ${active ? "ring-2 ring-violet-500 ring-inset" : ""}`}
                    >
                      <span className="font-medium text-sm">{section.label}</span>
                      <span className="text-sm">${section.price}</span>
                      <span className="text-xs text-gray-600">
                        {section.rows * section.cols} seats
                      </span>
                    </div>
                  );
                })}
                <div className="bg-gray-800 text-white text-xs text-center py-2">STAGE</div>
              </div>

              {sec && (
                <div>
                  <div className="text-xs uppercase text-gray-400 mb-2">
                    Select seats — {sec.label} · ${sec.price} per seat
                  </div>
                  <div className="flex flex-col items-center">
                    {Array.from({ length: sec.rows }).map((_, ri) => {
                      const row = rowLabels[ri];
                      return (
                        <div key={row} className="flex items-center">
                          <span className="text-xs text-gray-400 w-4 mr-1">{row}</span>
                          {Array.from({ length: sec.cols }).map((__, ci) => {
                            const key = `${row}${ci + 1}`;
                            const taken = sectionTaken.includes(key);
                            const sel = selectedSeats.includes(key);
                            const cls = taken
                              ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                              : sel
                                ? "bg-violet-500 border-violet-600"
                                : "bg-gray-100 border-gray-300 hover:bg-violet-100";
                            return (
                              <div
                                key={key}
                                onClick={() => {
                                  if (taken) return;
                                  setSelectedSeats((prev) =>
                                    prev.includes(key)
                                      ? prev.filter((s) => s !== key)
                                      : [...prev, key],
                                  );
                                }}
                                className={`w-5 h-5 rounded-sm border m-0.5 cursor-pointer ${cls}`}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {isolatedWarning && (
                    <div className="text-xs text-amber-600 mt-2">
                      ⚠ Selecting this leaves an isolated seat — consider selecting the adjacent
                      seat too
                    </div>
                  )}

                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={() => {
                      const price = selectedSeats.length * sec.price;
                      addToCart({
                        btBadge: "BT-07",
                        name: `${show.name} — ${sec.label}`,
                        price,
                        vertical: "Theatres & Performing Arts",
                        date: perf!.date,
                        time: perf!.time,
                      });
                      // Decrement inventory: mark seats as booked
                      const k = invKey(show.id, perf!.id, sec.id);
                      setBookedMap((prev) => ({
                        ...prev,
                        [k]: [...(prev[k] ?? []), ...selectedSeats],
                      }));
                      resetAll();
                    }}
                    className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
                  >
                    {selectedSeats.length > 0
                      ? `Add ${selectedSeats.length} seats · $${(selectedSeats.length * sec.price).toFixed(2)}`
                      : "Select seats above"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
