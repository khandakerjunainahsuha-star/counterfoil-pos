import { useState } from "react";

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

type Cage = {
  id: string;
  type: "batting" | "pitching";
  free: boolean;
  activity?: string;
  ends?: string;
  endingSoon?: boolean;
};

const tabs = [
  { id: "cages", label: "Cage Rental" },
  { id: "lessons", label: "Private Lessons" },
  { id: "packs", label: "Lesson Packs" },
  { id: "camps", label: "Camps" },
];

const initialCages: Cage[] = [
  { id: "A1", type: "batting", free: true },
  { id: "A2", type: "batting", free: false, activity: "BP", ends: "3:00 PM" },
  { id: "A3", type: "batting", free: false, activity: "Lesson", ends: "3:30 PM" },
  { id: "A4", type: "batting", free: true },
  { id: "A5", type: "batting", free: false, activity: "Team", ends: "4:00 PM" },
  { id: "A6", type: "batting", free: true },
  { id: "A7", type: "batting", free: false, activity: "BP", ends: "2:45 PM", endingSoon: true },
  { id: "A8", type: "batting", free: true },
  { id: "B1", type: "pitching", free: true },
  { id: "B2", type: "pitching", free: false, activity: "Lesson", ends: "3:00 PM" },
  { id: "B3", type: "pitching", free: true },
  { id: "B4", type: "pitching", free: false, activity: "Lesson", ends: "3:30 PM" },
  { id: "B5", type: "batting", free: true },
  { id: "B6", type: "batting", free: true },
  { id: "B7", type: "batting", free: false, activity: "BP", ends: "2:30 PM", endingSoon: true },
  { id: "B8", type: "batting", free: true },
];

const activityTypes = [
  { id: "batting", icon: "⚾", label: "Batting Practice" },
  { id: "pitching", icon: "⚾", label: "Pitching" },
  { id: "team", icon: "👥", label: "Team Rental" },
  { id: "skills", icon: "🎯", label: "Skills Drill" },
];

const initialCoaches = [
  {
    id: "mike_b",
    name: "Mike L.",
    initials: "ML",
    specialty: "Hitting · Exit velocity · Video analysis",
    rate: 85,
    avail: "Today 4:00 PM",
    rating: 4.9,
    preferred: true,
    slots: ["16:00", "17:00", "18:00"],
  },
  {
    id: "dana_b",
    name: "Dana R.",
    initials: "DR",
    specialty: "Pitching · Mechanics · Youth",
    rate: 75,
    avail: "Today 3:30 PM",
    rating: 4.7,
    preferred: false,
    slots: ["15:30", "16:30", "17:30", "18:30"],
  },
  {
    id: "carlos_b",
    name: "Carlos M.",
    initials: "CM",
    specialty: "Fielding · Catching · Infield",
    rate: 70,
    avail: "Mon 16 Jun",
    rating: 4.8,
    preferred: false,
    slots: ["16:00", "17:00", "18:00"],
  },
];

const packs = [
  { id: "p5", label: "5 Sessions", price: 425, perSession: 85, saving: 0 },
  { id: "p10", label: "10 Sessions", price: 800, perSession: 80, saving: 50, popular: true },
  { id: "p20", label: "20 Sessions", price: 1500, perSession: 75, saving: 200, bestValue: true },
];

const initialCamps = [
  {
    id: "summer_youth",
    name: "Summer Camp — Youth (7–12)",
    subtitle: "5-day · Mon–Fri · 9am–3pm",
    date: "Jul 14–18, 2026",
    price: 450,
    enrolled: 8,
    cap: 16,
    allDates: ["Mon 14 Jul", "Tue 15 Jul", "Wed 16 Jul", "Thu 17 Jul", "Fri 18 Jul"],
  },
  {
    id: "elite_hit",
    name: "Elite Hitting Clinic",
    subtitle: "Weekend intensive · video analysis",
    date: "Sat–Sun Jul 19–20",
    price: 280,
    enrolled: 6,
    cap: 12,
    allDates: ["Sat 19 Jul", "Sun 20 Jul"],
  },
  {
    id: "pitching",
    name: "Pitching Camp",
    subtitle: "3-day programme",
    date: "Jul 28–30, 2026",
    price: 320,
    enrolled: 3,
    cap: 10,
    allDates: ["Mon 28 Jul", "Tue 29 Jul", "Wed 30 Jul"],
  },
];

const dates = ["Mon 16 Jun", "Tue 17 Jun", "Wed 18 Jun", "Thu 19 Jun", "Fri 20 Jun", "Sat 21 Jun"];

// Compute end time given start 2:20 PM + duration hours
function computeEnd(duration: number): string {
  const startMin = 14 * 60 + 20;
  const endMin = startMin + Math.round(duration * 60);
  const h24 = Math.floor(endMin / 60) % 24;
  const m = endMin % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = ((h24 + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function BaseballPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [activeTab, setActiveTab] = useState("cages");
  // Inventory
  const [cagesData, setCagesData] = useState<Cage[]>(initialCages);
  const [coachBookings, setCoachBookings] = useState<Record<string, string[]>>({}); // `${coachId}|${date}` -> taken slots
  const [campsData, setCampsData] = useState(initialCamps);
  // Cages tab
  const [selectedCage, setSelectedCage] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [cageAddOns, setCageAddOns] = useState({ tokens: false, helmet: false });
  // Lessons
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  // Packs
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  // Camps
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");

  const freeCount = cagesData.filter((c) => c.free).length;
  const computedEnd = computeEnd(duration);
  const cageTotal = 28 * duration + (cageAddOns.tokens ? 8 : 0) + (cageAddOns.helmet ? 5 : 0);
  const coach = initialCoaches.find((c) => c.id === selectedCoach) ?? null;
  const coachTakenSlots =
    coach && selectedDate ? (coachBookings[`${coach.id}|${selectedDate}`] ?? []) : [];
  const camp = campsData.find((c) => c.id === selectedCamp) ?? null;

  const resetCage = () => {
    setSelectedCage(null);
    setActivityType(null);
    setDuration(1);
    setCageAddOns({ tokens: false, helmet: false });
  };
  const resetLesson = () => {
    setSelectedCoach(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };
  const resetCamp = () => {
    setSelectedCamp(null);
    setPlayerName("");
    setPlayerAge("");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Baseball Training Facilities</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`text-sm rounded-lg px-3 py-1.5 cursor-pointer ${
              activeTab === t.id
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-700 hover:border-violet-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CAGES */}
      {activeTab === "cages" && (
        <div>
          <div className="flex items-center mb-2">
            <span className="text-sm font-semibold">Cage Availability · Today</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-2">
              {freeCount} free
            </span>
          </div>
          <div className="flex gap-4 text-xs mb-3">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-green-50 border border-green-200 rounded-sm" />
              Free
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm" />
              Occupied
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-amber-50 border border-amber-200 rounded-sm" />
              Ending soon
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {cagesData.map((c) => {
              const isSel = selectedCage === c.id;
              if (c.free) {
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCage(c.id);
                      setActivityType(null);
                      setDuration(1);
                      setCageAddOns({ tokens: false, helmet: false });
                    }}
                    className={`rounded-xl border p-3 text-center text-xs bg-green-50 border-green-200 cursor-pointer hover:border-violet-300 ${
                      isSel ? "ring-2 ring-violet-400" : ""
                    }`}
                  >
                    <div className="text-sm font-bold text-green-700">{c.id}</div>
                    <div className="text-xs text-green-600">{c.type}</div>
                    <div className="text-xs">Free</div>
                  </div>
                );
              }
              if (c.endingSoon) {
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border p-3 text-center text-xs bg-amber-50 border-amber-200 cursor-not-allowed"
                  >
                    <div className="font-bold text-amber-700">{c.id}</div>
                    <div>{c.activity}</div>
                    <div className="text-xs text-amber-600">ends {c.ends}</div>
                  </div>
                );
              }
              return (
                <div
                  key={c.id}
                  className="rounded-xl border p-3 text-center text-xs bg-gray-100 border-gray-200 cursor-not-allowed"
                >
                  <div className="font-bold text-gray-400">{c.id}</div>
                  <div className="text-xs text-gray-400">until {c.ends}</div>
                </div>
              );
            })}
          </div>

          {selectedCage && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Activity type</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {activityTypes.map((a) => {
                  const active = activityType === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setActivityType(a.id)}
                      className={`border rounded-xl p-3 text-center cursor-pointer ${
                        active
                          ? "border-violet-400 bg-violet-50"
                          : "border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      <div className="text-xl">{a.icon}</div>
                      <div className="text-sm font-medium">{a.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-3">
                BT-04 · Cage {selectedCage} blocked for all activity types during this booking
              </div>

              {activityType && (
                <div>
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <span className="text-sm text-gray-700">Start: 2:20 PM</span>
                    <button
                      onClick={() => setDuration((d) => Math.max(0.5, +(d - 0.5).toFixed(1)))}
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
                    <span className="text-sm text-gray-700">End: {computedEnd}</span>
                  </div>
                  <div className="text-sm font-medium mb-3">
                    $28 × {duration}hr = ${(28 * duration).toFixed(2)}
                  </div>

                  {[
                    { id: "tokens" as const, label: "Ball machine tokens (50 pitches)", price: 8 },
                    { id: "helmet" as const, label: "Batting helmet", price: 5 },
                  ].map((a) => {
                    const on = cageAddOns[a.id];
                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between py-2 border-t border-gray-100"
                      >
                        <div>
                          <span className="text-sm text-gray-700">{a.label}</span>
                          <span className="text-xs text-gray-500 ml-2">${a.price}</span>
                        </div>
                        <button
                          onClick={() => setCageAddOns((p) => ({ ...p, [a.id]: !p[a.id] }))}
                          className={
                            on
                              ? "bg-violet-100 text-violet-700 border border-violet-400 text-xs px-2 py-0.5 rounded-full"
                              : "border border-gray-300 text-gray-500 text-xs px-2 py-0.5 rounded-full hover:border-violet-300"
                          }
                        >
                          {on ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => {
                      addToCart({
                        btBadge: "BT-04",
                        name: `Cage ${selectedCage} — ${activityTypes.find((a) => a.id === activityType)?.label}`,
                        price: cageTotal,
                        vertical: "Baseball Training Facilities",
                        date: "2026-06-14",
                        time: `14:20 – ${computedEnd}`,
                      });
                      // Inventory: mark cage as occupied
                      setCagesData((prev) =>
                        prev.map((c) =>
                          c.id === selectedCage
                            ? { ...c, free: false, activity: activityTypes.find((a) => a.id === activityType)?.label ?? "Booked", ends: computedEnd }
                            : c,
                        ),
                      );
                      resetCage();
                    }}
                    className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800"
                  >
                    Add to cart · ${cageTotal.toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LESSONS */}
      {activeTab === "lessons" && (
        <div>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {initialCoaches.map((c) => {
              const active = selectedCoach === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCoach(c.id);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                  }}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 ${
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-semibold">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.name}</span>
                      {c.preferred && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                          Preferred
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{c.specialty}</div>
                    <div className="text-xs text-gray-400">{c.avail} · ★ {c.rating}</div>
                  </div>
                  <div className="text-sm font-medium">${c.rate}/session</div>
                </div>
              );
            })}
          </div>

          {coach && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">Select date</div>
              <div className="flex gap-2 flex-wrap mb-3">
                {dates.map((d) => {
                  const active = selectedDate === d;
                  return (
                    <div
                      key={d}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedSlot(null);
                      }}
                      className={`border rounded-full px-3 py-1.5 text-sm cursor-pointer ${
                        active
                          ? "bg-violet-100 text-violet-700 border-violet-400"
                          : "border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>

              {selectedDate && (
                <div>
                  <div className="text-xs uppercase text-gray-400 mb-2">Select time</div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {coach.slots.map((s) => {
                      const taken = coachTakenSlots.includes(s);
                      const active = selectedSlot === s;
                      if (taken) {
                        return (
                          <div
                            key={s}
                            className="rounded-lg p-2 text-center text-xs bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            <div className="text-sm font-medium">{s}</div>
                            <div className="text-xs">Booked</div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`rounded-lg p-2 text-center text-xs cursor-pointer ${
                            active
                              ? "border border-violet-400 bg-violet-50 text-violet-700 font-medium"
                              : "border border-gray-200 hover:border-violet-300"
                          }`}
                        >
                          <div className="text-sm font-medium">{s}</div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedSlot && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-center justify-between">
                      <span className="text-xs text-amber-800">
                        💡 Buy 10 sessions for $800 and save $50.
                      </span>
                      <span
                        onClick={() => setActiveTab("packs")}
                        className="text-xs text-violet-600 cursor-pointer"
                      >
                        View packs →
                      </span>
                    </div>
                  )}

                  <button
                    disabled={!selectedSlot}
                    onClick={() => {
                      addToCart({
                        btBadge: "BT-10",
                        name: `Lesson — ${coach.name}`,
                        price: coach.rate,
                        vertical: "Baseball Training Facilities",
                        date: selectedDate!,
                        time: selectedSlot!,
                      });
                      const k = `${coach.id}|${selectedDate}`;
                      setCoachBookings((prev) => ({
                        ...prev,
                        [k]: [...(prev[k] ?? []), selectedSlot!],
                      }));
                      resetLesson();
                    }}
                    className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
                  >
                    {selectedSlot ? `Add lesson · $${coach.rate}` : "Select a time"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PACKS */}
      {activeTab === "packs" && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {packs.map((p) => {
              const active = selectedPack === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPack(p.id)}
                  className={`border rounded-xl p-4 cursor-pointer relative ${
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2 left-3 text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {p.bestValue && (
                    <span className="absolute -top-2 left-3 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">
                      BEST VALUE
                    </span>
                  )}
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-2xl font-bold mt-1">${p.price}</div>
                  <div className="text-xs text-gray-500 mt-1">${p.perSession}/session</div>
                  {p.saving > 0 && (
                    <div className="text-xs text-green-600 mt-1">Save ${p.saving}</div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            disabled={!selectedPack}
            onClick={() => {
              const p = packs.find((x) => x.id === selectedPack)!;
              addToCart({
                btBadge: "BT-12",
                name: `${p.label} Lesson Pack`,
                price: p.price,
                vertical: "Baseball Training Facilities",
                date: "2026-06-14",
                time: "Valid 6 months",
              });
              setSelectedPack(null);
            }}
            className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            {selectedPack
              ? `Add pack · $${packs.find((x) => x.id === selectedPack)?.price}`
              : "Select a pack"}
          </button>
        </div>
      )}

      {/* CAMPS */}
      {activeTab === "camps" && (
        <div>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {campsData.map((c) => {
              const active = selectedCamp === c.id;
              const pct = Math.min(100, (c.enrolled / c.cap) * 100);
              const full = c.enrolled >= c.cap;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (full) return;
                    setSelectedCamp(c.id);
                    setPlayerName("");
                    setPlayerAge("");
                  }}
                  className={`border rounded-xl p-4 ${
                    full
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : active
                        ? "border-violet-400 bg-violet-50 cursor-pointer"
                        : "border-gray-200 hover:border-violet-300 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-violet-700 bg-violet-100 rounded px-1.5 py-0.5">
                        BT-13
                      </span>
                      <div className="text-sm font-medium mt-2">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.subtitle}</div>
                      <div className="text-xs text-gray-400">{c.date}</div>
                    </div>
                    <div className="text-sm font-medium">${c.price}</div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {c.enrolled}/{c.cap} enrolled
                      </span>
                      {full && <span className="text-red-500">Full</span>}
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${full ? "bg-red-400" : "bg-violet-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {camp && (
            <div>
              <div className="border rounded-xl p-4 mb-4">
                <div className="text-xs uppercase text-gray-400 mb-3">
                  Enrolling in all {camp.allDates.length} sessions:
                </div>
                {camp.allDates.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-2 py-1.5 border-b border-gray-50"
                  >
                    <span className="text-green-500 text-xs">✓</span>
                    <span className="text-sm text-gray-700">{d}</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                  />
                  <input
                    value={playerAge}
                    onChange={(e) => setPlayerAge(e.target.value)}
                    placeholder="Age"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>
              <button
                disabled={!playerName}
                onClick={() => {
                  addToCart({
                    btBadge: "BT-13",
                    name: camp.name,
                    price: camp.price,
                    vertical: "Baseball Training Facilities",
                    date: camp.date,
                    time: `All ${camp.allDates.length} sessions`,
                  });
                  setCampsData((prev) =>
                    prev.map((c) =>
                      c.id === camp.id ? { ...c, enrolled: c.enrolled + 1 } : c,
                    ),
                  );
                  resetCamp();
                }}
                className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                {playerName ? `Enroll · $${camp.price}` : "Enter player name"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
