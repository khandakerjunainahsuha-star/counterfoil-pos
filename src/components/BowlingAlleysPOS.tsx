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

const OPEN = 10 * 60;
const CLOSE = 23 * 60;
const STEP = 30;

type Block = { start: number; end: number; party: string };
type Lane = { id: string; label: string; hourlyRate: number; occupied: Block[] };

const lanes: Lane[] = [
  {
    id: "lane1",
    label: "Lane 1",
    hourlyRate: 24,
    occupied: [
      { start: 12 * 60, end: 13 * 60 + 30, party: "Reyes (4)" },
      { start: 18 * 60, end: 19 * 60, party: "Khan (2)" },
    ],
  },
  {
    id: "lane2",
    label: "Lane 2",
    hourlyRate: 24,
    occupied: [
      { start: 10 * 60, end: 11 * 60, party: "Walk-in" },
      { start: 20 * 60, end: 22 * 60, party: "Osei (6)" },
    ],
  },
  {
    id: "lane3",
    label: "Lane 3",
    hourlyRate: 28,
    occupied: [{ start: 15 * 60, end: 16 * 60 + 30, party: "Birthday (8)" }],
  },
  { id: "lane4", label: "Lane 4", hourlyRate: 28, occupied: [] },
];

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function BowlingAlleysPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedLane, setSelectedLane] = useState<string | null>(null);
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const showBlocked = (msg: string) => {
    setBlockedMsg(msg);
    setTimeout(() => setBlockedMsg(null), 3000);
  };

  const lane = lanes.find((l) => l.id === selectedLane);

  const overlaps = (start: number, dur: number) => {
    if (!lane) return true;
    const end = start + dur;
    return lane.occupied.some((b) => start < b.end && end > b.start);
  };

  const isStartValid = (start: number, dur: number) =>
    start >= OPEN && start + dur <= CLOSE && !overlaps(start, dur);

  const startOptions: number[] = [];
  for (let t = OPEN; t + duration <= CLOSE; t += STEP) startOptions.push(t);

  const price = lane ? Math.round((duration / 60) * lane.hourlyRate) : 0;
  const span = CLOSE - OPEN;

  const changeDuration = (next: number) => {
    if (
      next > duration &&
      startTime !== null &&
      lane &&
      !isStartValid(startTime, next)
    ) {
      showBlocked(
        "Can't extend here — this time is already booked. Try a shorter duration or an earlier start time.",
      );
      return;
    }
    setBlockedMsg(null);
    setDuration(next);
    if (startTime !== null && !isStartValid(startTime, next)) setStartTime(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-gray-900">Bowling Alleys</h2>
        <span className="bg-violet-100 text-violet-700 text-xs font-medium px-2 py-0.5 rounded-full">
          BT-05
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Select a lane, then choose your start time and duration.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {lanes.map((l) => {
          const active = selectedLane === l.id;
          return (
            <div
              key={l.id}
              onClick={() => {
                setBlockedMsg(null);
                setSelectedLane(l.id);
                setStartTime(null);
              }}
              className={`rounded-xl border p-3 cursor-pointer ${
                active
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 hover:border-violet-300 hover:shadow-sm"
              }`}
            >
              <div className="text-sm font-semibold text-gray-900">{l.label}</div>
              <div className="text-xs text-gray-500">${l.hourlyRate}/hr</div>
              <div className="text-xs text-gray-400 mt-1">
                {l.occupied.length} booking{l.occupied.length === 1 ? "" : "s"}
              </div>
            </div>
          );
        })}
      </div>

      {lane && (
        <>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Timeline — {lane.label}
          </div>
          <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden mb-1">
            {lane.occupied.map((b, i) => (
              <div
                key={i}
                onClick={() =>
                  showBlocked(
                    "This time slot is already booked. Select a free section on the timeline.",
                  )
                }
                className="absolute top-0 bottom-0 bg-gray-300 flex items-center justify-center text-[10px] text-gray-700 overflow-hidden cursor-not-allowed"
                style={{
                  left: `${((b.start - OPEN) / span) * 100}%`,
                  width: `${((b.end - b.start) / span) * 100}%`,
                }}
                title={`${b.party} · ${fmt(b.start)}–${fmt(b.end)}`}
              >
                <span className="truncate px-1">{b.party}</span>
              </div>
            ))}
            {startTime !== null && (
              <div
                className="absolute top-0 bottom-0 bg-violet-400/70 border border-violet-600 rounded"
                style={{
                  left: `${((startTime - OPEN) / span) * 100}%`,
                  width: `${(duration / span) * 100}%`,
                }}
              />
            )}
          </div>
          <div className="relative h-4 mb-2 text-[10px] text-gray-400">
            {[10, 13, 16, 19, 22].map((h) => (
              <span
                key={h}
                className="absolute -translate-x-1/2"
                style={{ left: `${((h * 60 - OPEN) / span) * 100}%` }}
              >
                {fmt(h * 60)}
              </span>
            ))}
          </div>
          <BlockedNotice message={blockedMsg} onDismiss={() => setBlockedMsg(null)} />


          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-medium text-gray-700">Duration</span>
            <button
              onClick={() => changeDuration(Math.max(30, duration - 30))}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <span className="text-sm font-medium w-16 text-center">{duration} min</span>
            <button
              onClick={() => changeDuration(Math.min(180, duration + 30))}
              className="border rounded-lg w-7 h-7 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Start time
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-5">
            {startOptions.map((t) => {
              const valid = isStartValid(t, duration);
              const selected = startTime === t;
              return (
                <button
                  key={t}
                  disabled={!valid}
                  onClick={() => setStartTime(t)}
                  className={`rounded-lg border py-2 text-sm ${
                    !valid
                      ? "opacity-40 cursor-not-allowed border-gray-200"
                      : selected
                        ? "border-violet-400 bg-violet-50"
                        : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {fmt(t)}
                </button>
              );
            })}
          </div>

          {startTime !== null && (
            <>
              <div className="text-sm text-gray-700 mb-3">
                {lane.label} · {fmt(startTime)}–{fmt(startTime + duration)} · {duration} min · $
                {price}
              </div>
              <button
                onClick={() => {
                  addToCart({
                    btBadge: "BT-05",
                    name: `${lane.label} · ${duration} min`,
                    price,
                    vertical: "Bowling Alleys",
                    date: "Today",
                    time: `${fmt(startTime)}–${fmt(startTime + duration)}`,
                    qty: 1,
                  });
                  setStartTime(null);
                }}
                className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800"
              >
                Add to Cart · ${price}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
