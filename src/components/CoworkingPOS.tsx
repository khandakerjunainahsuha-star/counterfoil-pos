import { useState } from "react";
import { BlockedNotice } from "./BlockedNotice";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
  qty: number;
}) => void;

type Room = {
  id: string;
  bt: string;
  name: string;
  subtitle: string;
  ratePerHr?: number;
  flatPrice?: number;
  blocks: { from: number; to: number }[];
};

const rooms: Room[] = [
  {
    id: "board",
    bt: "BT-05",
    name: "Executive Boardroom",
    subtitle: "10 seats · Projector + video call",
    ratePerHr: 85,
    blocks: [
      { from: 8, to: 10 },
      { from: 13, to: 14 },
      { from: 18, to: 20 },
    ],
  },
  {
    id: "focus",
    bt: "BT-05",
    name: "Focus Room",
    subtitle: "4 seats · Whiteboard · quiet",
    ratePerHr: 35,
    blocks: [
      { from: 9, to: 11.5 },
      { from: 15, to: 17 },
    ],
  },
  {
    id: "creative",
    bt: "BT-05",
    name: "Creative Studio",
    subtitle: "8 seats · Standing desks · informal",
    ratePerHr: 55,
    blocks: [{ from: 10, to: 13 }],
  },
  {
    id: "hall",
    bt: "BT-03",
    name: "Event Hall — Full Day",
    subtitle: "80 theatre / 50 cabaret · AV included",
    flatPrice: 650,
    blocks: [],
  },
];

const dates = ["Sat 14 Jun", "Mon 16 Jun", "Tue 17 Jun", "Wed 18 Jun", "Thu 19 Jun"];
const cateringItems = [
  { id: "coffee" as const, label: "Morning refreshments", price: 8 },
  { id: "lunch" as const, label: "Working lunch", price: 22 },
  { id: "tea" as const, label: "Afternoon tea", price: 7 },
];
const fmt = (h: number) => Math.floor(h) + ":" + (h % 1 === 0.5 ? "30" : "00");

export function CoworkingPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startHour, setStartHour] = useState(14.5);
  const [duration, setDuration] = useState(2);
  const [catering, setCatering] = useState({ coffee: false, lunch: false, tea: false });
  const [delegates, setDelegates] = useState(5);

  const reset = () => {
    setSelectedRoom(null);
    setSelectedDate(null);
    setStartHour(14.5);
    setDuration(2);
    setCatering({ coffee: false, lunch: false, tea: false });
    setDelegates(5);
  };

  const room = rooms.find((r) => r.id === selectedRoom) || null;
  const roomCost = room ? (room.flatPrice ?? (room.ratePerHr || 0) * duration) : 0;
  const cateringCost =
    delegates * cateringItems.reduce((s, c) => s + (catering[c.id] ? c.price : 0), 0);
  const total = roomCost + cateringCost;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Co-working & Event Spaces</h1>
      <p className="text-sm text-gray-500 mb-6">Reserve rooms and event halls</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {rooms.map((r) => (
          <div
            key={r.id}
            onClick={() => {
              setSelectedRoom(r.id);
              setSelectedDate(null);
              setStartHour(14.5);
              setDuration(2);
              setCatering({ coffee: false, lunch: false, tea: false });
              setDelegates(5);
            }}
            className={`border rounded-xl p-3 cursor-pointer ${
              selectedRoom === r.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              {r.bt}
            </span>
            <div className="text-sm font-medium mt-2 text-gray-900">{r.name}</div>
            <div className="text-xs text-gray-500">{r.subtitle}</div>
            <div className="text-sm font-medium mt-2 text-gray-900">
              {r.flatPrice ? `$${r.flatPrice} flat` : `$${r.ratePerHr}/hr`}
            </div>
          </div>
        ))}
      </div>

      {room && (
        <>
          <div className="text-xs uppercase text-gray-400 mb-2">Date</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {dates.map((d) => (
              <div
                key={d}
                onClick={() => setSelectedDate(d)}
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

          {selectedDate && !room.flatPrice && room.ratePerHr && (
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="text-xs uppercase text-gray-400 mb-2">
                Availability · {selectedDate.toUpperCase()}
              </div>
              <div className="relative w-full h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                {room.blocks.map((b, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 bg-gray-400 flex items-center justify-center text-white text-xs"
                    style={{
                      left: `${((b.from - 8) / 12) * 100}%`,
                      width: `${((b.to - b.from) / 12) * 100}%`,
                    }}
                  >
                    Booked
                  </div>
                ))}
                <div
                  className="absolute top-0 bottom-0 bg-violet-500 rounded"
                  style={{
                    left: `${((startHour - 8) / 12) * 100}%`,
                    width: `${(duration / 12) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Start</span>
                  <button
                    onClick={() => setStartHour((v) => Math.max(8, v - 0.5))}
                    className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-sm w-12 text-center">{fmt(startHour)}</span>
                  <button
                    onClick={() => setStartHour((v) => Math.min(19, v + 0.5))}
                    className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Duration</span>
                  <button
                    onClick={() => setDuration((v) => Math.max(0.5, v - 0.5))}
                    className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-sm w-10 text-center">{duration} hr</span>
                  <button
                    onClick={() => setDuration((v) => Math.min(6, v + 0.5))}
                    className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-gray-400">End: {fmt(startHour + duration)}</div>
              </div>

              <div className="text-sm font-medium text-gray-700 mt-3">
                ${room.ratePerHr} × {duration}hr = ${(room.ratePerHr * duration).toFixed(2)}
              </div>

              {duration >= 1 && (
                <div className="mt-4">
                  <div className="text-xs uppercase text-gray-400 mb-2">Delegates</div>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setDelegates((v) => Math.max(1, v - 1))}
                      className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="text-sm w-8 text-center">{delegates}</span>
                    <button
                      onClick={() => setDelegates((v) => v + 1)}
                      className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs uppercase text-gray-400 mb-2">Catering</div>
                  {cateringItems.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCatering((o) => ({ ...o, [c.id]: !o[c.id] }))}
                      className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 mb-2 text-sm ${
                        catering[c.id]
                          ? "border-violet-400 bg-violet-50 text-violet-700"
                          : "border-gray-200 text-gray-700"
                      }`}
                    >
                      <span>
                        {c.label} · ${c.price}/head
                      </span>
                      <span>
                        {catering[c.id] ? `$${(c.price * delegates).toFixed(2)} ✓` : "+"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedDate && room.flatPrice && (
            <div className="border border-gray-200 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">Full day · {selectedDate}</div>
              <div className="text-sm font-medium text-gray-900">${room.flatPrice}</div>
            </div>
          )}

          <button
            disabled={!selectedDate}
            onClick={() => {
              if (!selectedDate) return;
              addToCart({
                btBadge: room.bt,
                name: room.name,
                price: total,
                vertical: "Co-working & Event Spaces",
                date: selectedDate,
                time: room.flatPrice ? "Full day" : fmt(startHour) + "–" + fmt(startHour + duration),
                qty: 1,
              });
              reset();
            }}
            className={`w-full rounded-xl py-3 text-sm font-semibold ${
              selectedDate
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to cart · ${total.toFixed(2)}
          </button>
        </>
      )}
    </div>
  );
}
