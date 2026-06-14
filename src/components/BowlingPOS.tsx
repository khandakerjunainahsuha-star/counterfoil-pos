import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

type Lane = { id: number; free: boolean; ends?: string };

const RATE = 15;

const initialLanes: Lane[] = [
  { id: 1, free: true },
  { id: 2, free: false, ends: "3:30 PM" },
  { id: 3, free: false, ends: "4:00 PM" },
  { id: 4, free: true },
  { id: 5, free: true },
  { id: 6, free: false, ends: "2:45 PM" },
  { id: 7, free: true },
  { id: 8, free: false, ends: "3:00 PM" },
  { id: 9, free: true },
  { id: 10, free: true },
  { id: 11, free: true },
  { id: 12, free: true },
  { id: 13, free: false, ends: "4:30 PM" },
  { id: 14, free: true },
  { id: 15, free: false, ends: "3:15 PM" },
  { id: 16, free: true },
  { id: 17, free: true },
  { id: 18, free: false, ends: "3:45 PM" },
  { id: 19, free: true },
  { id: 20, free: true },
];

function formatEndTime(d: number) {
  const end = 14.25 + d;
  return Math.floor(end) + ":" + (end % 1 === 0.5 ? "45" : "15") + " PM";
}

export function BowlingPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [lanesData, setLanesData] = useState<Lane[]>(initialLanes);
  const [selectedLane, setSelectedLane] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [partySize, setPartySize] = useState(2);
  const [shoeHire, setShoeHire] = useState(false);
  const [addOns, setAddOns] = useState({ food: false, birthday: false });

  const total =
    RATE * duration +
    (shoeHire ? 4 * partySize : 0) +
    (addOns.food ? 18 : 0) +
    (addOns.birthday ? 25 : 0);

  const resetAll = () => {
    setSelectedLane(null);
    setDuration(1);
    setPartySize(2);
    setShoeHire(false);
    setAddOns({ food: false, birthday: false });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bowling Alleys</h2>

      <div className="text-sm font-semibold mb-3">Lane Availability · Today</div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {lanesData.map((l) => {
          if (l.free) {
            const sel = selectedLane === l.id;
            return (
              <div
                key={l.id}
                onClick={() => setSelectedLane(l.id)}
                className={`rounded-xl border p-3 text-center text-xs bg-green-50 border-green-200 cursor-pointer hover:border-violet-300 ${
                  sel ? "ring-2 ring-violet-400" : ""
                }`}
              >
                <div className="text-sm font-bold text-green-700">Lane {l.id}</div>
                <div className="text-xs text-green-600">Free</div>
              </div>
            );
          }
          return (
            <div
              key={l.id}
              className="rounded-xl border p-3 text-center text-xs bg-gray-100 border-gray-200 cursor-not-allowed"
            >
              <div className="text-sm font-bold text-gray-400">Lane {l.id}</div>
              <div className="text-xs text-gray-400">until {l.ends}</div>
            </div>
          );
        })}
      </div>

      {selectedLane !== null && (
        <div>
          <div className="text-sm font-semibold mb-4">
            Lane {selectedLane} — New Booking
          </div>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="text-sm font-medium">Start: 2:15 PM</span>
            <button
              onClick={() => setDuration((d) => Math.max(1, +(d - 0.5).toFixed(1)))}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <span className="text-sm font-medium">{duration} hr</span>
            <button
              onClick={() => setDuration((d) => +(d + 0.5).toFixed(1))}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
            <span className="text-xs text-gray-500">End: {formatEndTime(duration)}</span>
            <span className="text-sm font-medium ml-auto">
              ${RATE} × {duration}hr = ${(RATE * duration).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-700">Bowlers:</span>
            <button
              onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <span className="text-sm font-medium w-6 text-center">{partySize}</span>
            <button
              onClick={() => setPartySize((p) => p + 1)}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          {[
            {
              key: "shoe",
              label: `Shoe hire × ${partySize} · $${4 * partySize}`,
              on: shoeHire,
              toggle: () => setShoeHire(!shoeHire),
            },
            {
              key: "food",
              label: "Nachos + drinks bundle · $18",
              on: addOns.food,
              toggle: () => setAddOns((p) => ({ ...p, food: !p.food })),
            },
            {
              key: "birthday",
              label: "Birthday party pack + 1hr · $25",
              on: addOns.birthday,
              toggle: () => setAddOns((p) => ({ ...p, birthday: !p.birthday })),
            },
          ].map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between py-2 border-t border-gray-100"
            >
              <span className="text-sm text-gray-700">{row.label}</span>
              <button
                onClick={row.toggle}
                className={
                  row.on
                    ? "bg-violet-100 text-violet-700 border border-violet-400 text-xs px-2 py-0.5 rounded-full"
                    : "border border-gray-300 text-gray-500 text-xs px-2 py-0.5 rounded-full hover:border-violet-300"
                }
              >
                {row.on ? "Added ✓" : "+ Add"}
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              addToCart({
                btBadge: "BT-05",
                name: `Bowling — Lane ${selectedLane}`,
                price: total,
                vertical: "Bowling Alleys",
                date: "2026-06-14",
                time: `14:15 – ${formatEndTime(duration)}`,
              });
              // Inventory: occupy lane
              setLanesData((prev) =>
                prev.map((l) =>
                  l.id === selectedLane
                    ? { ...l, free: false, ends: formatEndTime(duration) }
                    : l,
                ),
              );
              resetAll();
            }}
            className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800"
          >
            Lane {selectedLane} · {duration}hr · ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
