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

type Block = { start: number; end: number; party: string };
type Cage = {
  id: string;
  label: string;
  hourlyRate: number;
  feature: string;
  occupied: Block[];
};
type Coach = {
  id: string;
  name: string;
  role: string;
  rating: number;
  rate: number;
  times: number[];
};

const OPEN = 9 * 60;
const CLOSE = 22 * 60;
const STEP = 30;
const NOW = 14 * 60 + 20;

const cages: Cage[] = [
  {
    id: "cage1",
    label: "Cage 1 — HitTrax",
    hourlyRate: 45,
    feature: "HitTrax",
    occupied: [
      { start: 10 * 60, end: 11 * 60 + 30, party: "Lovelace (private)" },
      { start: 16 * 60, end: 17 * 60, party: "Team slot" },
    ],
  },
  {
    id: "cage2",
    label: "Cage 2 — Rapsodo",
    hourlyRate: 50,
    feature: "Rapsodo",
    occupied: [{ start: 13 * 60, end: 15 * 60, party: "Pitching eval" }],
  },
  {
    id: "cage3",
    label: "Cage 3 — Standard",
    hourlyRate: 35,
    feature: "Standard",
    occupied: [
      { start: 9 * 60, end: 10 * 60, party: "Walk-in" },
      { start: 18 * 60, end: 20 * 60, party: "Birthday group" },
    ],
  },
  {
    id: "cage4",
    label: "Cage 4 — Standard",
    hourlyRate: 35,
    feature: "Standard",
    occupied: [],
  },
];

const coaches: Coach[] = [
  {
    id: "c1",
    name: "Mike Lovelace",
    role: "Hitting Coach",
    rating: 4.9,
    rate: 80,
    times: [9 * 60, 10 * 60, 11 * 60, 13 * 60, 15 * 60],
  },
  {
    id: "c2",
    name: "Dana Ruiz",
    role: "Pitching Coach",
    rating: 4.8,
    rate: 85,
    times: [10 * 60, 12 * 60, 14 * 60, 16 * 60, 17 * 60],
  },
  {
    id: "c3",
    name: "Sam Okafor",
    role: "Fielding & Speed",
    rating: 4.7,
    rate: 70,
    times: [9 * 60, 11 * 60, 13 * 60, 14 * 60, 18 * 60],
  },
];

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function cageStatus(c: Cage): "free" | "occupied" | "ending-soon" {
  const active = c.occupied.find((b) => b.start <= NOW && NOW < b.end);
  if (!active) return "free";
  if (active.end - NOW <= 15) return "ending-soon";
  return "occupied";
}

export function BaseballPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [mode, setMode] = useState<"cages" | "lessons">("cages");

  // cages
  const [selectedCage, setSelectedCage] = useState<string | null>(null);
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);

  // lessons
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [lessonTime, setLessonTime] = useState<number | null>(null);

  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const showBlocked = (msg: string) => {
    setBlockedMsg(msg);
    setTimeout(() => setBlockedMsg(null), 3000);
  };

  const cage = cages.find((c) => c.id === selectedCage) || null;

  const overlaps = (start: number, dur: number) => {
    if (!cage) return true;
    const end = start + dur;
    return cage.occupied.some((b) => start < b.end && end > b.start);
  };

  const isStartValid = (start: number, dur: number) =>
    start >= OPEN && start + dur <= CLOSE && !overlaps(start, dur);

  const startOptions: number[] = [];
  for (let t = OPEN; t + duration <= CLOSE; t += STEP) startOptions.push(t);

  const price = cage ? Math.round((duration / 60) * cage.hourlyRate) : 0;
  const span = CLOSE - OPEN;

  const handleDuration = (delta: number) => {
    setDuration((d) => {
      const nd = Math.max(30, Math.min(180, d + delta));
      if (startTime !== null && cage) {
        const end = startTime + nd;
        const bad =
          startTime < OPEN ||
          end > CLOSE ||
          cage.occupied.some((b) => startTime < b.end && end > b.start);
        if (bad) setStartTime(null);
      }
      return nd;
    });
  };

  const coach = coaches.find((c) => c.id === selectedCoach) || null;

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Baseball Training Facilities</h1>
      <p className="text-sm text-gray-500 mb-4">Cage rentals & private lessons.</p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        {(["cages", "lessons"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setBlockedMsg(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${
              mode === m
                ? "border-violet-400 bg-violet-50 text-gray-900"
                : "border-gray-200 text-gray-600 hover:border-violet-300"
            }`}
          >
            {m === "cages" ? "Cage Rentals" : "Private Lessons"}
          </button>
        ))}
      </div>

      {mode === "cages" && (
        <div>
          {/* Live dashboard */}
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
              Live cage status · {fmt(NOW)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cages.map((c) => {
                const status = cageStatus(c);
                const pill =
                  status === "free"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "ending-soon"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-200 text-gray-600";
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCage(c.id);
                      setStartTime(null);
                      setBlockedMsg(null);
                    }}
                    className={`text-left border rounded-xl p-3 ${
                      selectedCage === c.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{c.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.feature}</div>
                    <span className={`inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full ${pill}`}>
                      {status === "free" ? "Free" : status === "ending-soon" ? "Ending soon" : "Occupied"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cage selector */}
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Select cage</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cages.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCage(c.id);
                    setStartTime(null);
                    setBlockedMsg(null);
                  }}
                  className={`text-left border rounded-xl p-4 ${
                    selectedCage === c.id
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">{c.label}</div>
                    <div className="text-sm text-gray-900">${c.hourlyRate}/hr</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.feature} · {c.occupied.length} booking{c.occupied.length === 1 ? "" : "s"} today
                  </div>
                </button>
              ))}
            </div>
          </div>

          {cage && (
            <>
              {/* Timeline */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Timeline · {cage.label}
                </div>
                <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                  {cage.occupied.map((b, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        showBlocked(
                          "This time slot is already booked. Select a free section on the timeline.",
                        )
                      }
                      className="absolute top-0 bottom-0 bg-gray-300 cursor-not-allowed"
                      style={{
                        left: `${((b.start - OPEN) / span) * 100}%`,
                        width: `${((b.end - b.start) / span) * 100}%`,
                      }}
                      title={`${b.party} · ${fmt(b.start)}–${fmt(b.end)}`}
                    />
                  ))}
                  {startTime !== null && (
                    <div
                      className="absolute top-0 bottom-0 bg-violet-400/70"
                      style={{
                        left: `${((startTime - OPEN) / span) * 100}%`,
                        width: `${(duration / span) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  {[9, 12, 15, 18, 21].map((h) => (
                    <span key={h}>{String(h).padStart(2, "0")}:00</span>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Duration</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDuration(-30)}
                    className="w-9 h-9 rounded-lg border border-gray-200 hover:border-violet-300 text-gray-700"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-20 text-center">
                    {duration} min
                  </span>
                  <button
                    onClick={() => handleDuration(30)}
                    className="w-9 h-9 rounded-lg border border-gray-200 hover:border-violet-300 text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Start times */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Start time</div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {startOptions.map((t) => {
                    const valid = isStartValid(t, duration);
                    const selected = startTime === t;
                    return (
                      <button
                        key={t}
                        disabled={!valid}
                        onClick={() => {
                          if (!valid) {
                            showBlocked(
                              "This start time overlaps an existing booking. Pick another.",
                            );
                            return;
                          }
                          setStartTime(t);
                          setBlockedMsg(null);
                        }}
                        className={`text-xs px-2 py-2 rounded-lg border ${
                          !valid
                            ? "opacity-40 cursor-not-allowed border-gray-200"
                            : selected
                              ? "border-violet-400 bg-violet-50 text-gray-900"
                              : "border-gray-200 hover:border-violet-300 text-gray-700"
                        }`}
                      >
                        {fmt(t)}
                      </button>
                    );
                  })}
                </div>
                <BlockedNotice message={blockedMsg} onDismiss={() => setBlockedMsg(null)} />
              </div>

              {startTime !== null && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-600 mb-3">
                    {cage.label} · {fmt(startTime)}–{fmt(startTime + duration)} · {duration} min · ${price}
                  </div>
                  <button
                    onClick={() => {
                      addToCart({
                        btBadge: "BT-05",
                        name: `${cage.label} · ${duration} min`,
                        price,
                        vertical: "Baseball Training Facilities",
                        date: "Today",
                        time: `${fmt(startTime)}–${fmt(startTime + duration)}`,
                        qty: 1,
                      });
                      setStartTime(null);
                    }}
                    className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-800"
                  >
                    Add to cart · ${price}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mode === "lessons" && (
        <div>
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Select coach</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {coaches.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCoach(c.id);
                    setLessonTime(null);
                    setBlockedMsg(null);
                  }}
                  className={`text-left border rounded-xl p-4 ${
                    selectedCoach === c.id
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-medium">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                    <span>★ {c.rating}</span>
                    <span>${c.rate} / lesson</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {coach && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Available times</div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {coach.times.map((t) => {
                  const selected = lessonTime === t;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setLessonTime(t);
                        setBlockedMsg(null);
                      }}
                      className={`text-xs px-2 py-2 rounded-lg border ${
                        selected
                          ? "border-violet-400 bg-violet-50 text-gray-900"
                          : "border-gray-200 hover:border-violet-300 text-gray-700"
                      }`}
                    >
                      {fmt(t)}
                    </button>
                  );
                })}
              </div>
              <BlockedNotice message={blockedMsg} onDismiss={() => setBlockedMsg(null)} />
            </div>
          )}

          {coach && lessonTime !== null && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-sm text-gray-600 mb-3">
                Private Lesson · {coach.name} · {fmt(lessonTime)} · ${coach.rate}
              </div>
              <button
                onClick={() => {
                  addToCart({
                    btBadge: "BT-10",
                    name: `Private Lesson · ${coach.name}`,
                    price: coach.rate,
                    vertical: "Baseball Training Facilities",
                    date: "Today",
                    time: fmt(lessonTime),
                    qty: 1,
                  });
                  setLessonTime(null);
                }}
                className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-800"
              >
                Add to cart · ${coach.rate}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
