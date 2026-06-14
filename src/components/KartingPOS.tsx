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

type Activity = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  max: number;
  flat?: boolean;
  warning?: string;
  slots: { t: string; spots: number }[];
};

const activities: Activity[] = [
  {
    id: "junior",
    name: "Junior Karts (8–14 yrs)",
    subtitle: "12 laps · max 12 per session",
    price: 18,
    max: 12,
    warning: "All racers must be 8–14 yrs and min 1.2m tall.",
    slots: [
      { t: "10:00", spots: 12 },
      { t: "11:30", spots: 8 },
      { t: "13:00", spots: 12 },
      { t: "14:30", spots: 5 },
      { t: "16:00", spots: 12 },
      { t: "17:30", spots: 12 },
    ],
  },
  {
    id: "senior",
    name: "Senior Race (15+ yrs)",
    subtitle: "15 laps · max 12 per session",
    price: 24,
    max: 12,
    warning: "All racers must be 15+ and min 1.4m tall.",
    slots: [
      { t: "10:00", spots: 0 },
      { t: "11:30", spots: 2 },
      { t: "13:00", spots: 12 },
      { t: "14:30", spots: 5 },
      { t: "16:00", spots: 12 },
      { t: "17:30", spots: 12 },
      { t: "19:00", spots: 12 },
    ],
  },
  {
    id: "grandprix",
    name: "Grand Prix Package",
    subtitle: "3 races · timing gates · podium photo",
    price: 55,
    max: 12,
    slots: [
      { t: "12:00", spots: 12 },
      { t: "14:00", spots: 10 },
      { t: "16:00", spots: 12 },
      { t: "18:00", spots: 12 },
    ],
  },
  {
    id: "corporate",
    name: "Corporate Race Day",
    subtitle: "Exclusive track · 2 hrs · up to 24 racers",
    price: 580,
    max: 1,
    flat: true,
    slots: [
      { t: "Weekdays only", spots: 1 },
      { t: "By arrangement", spots: 1 },
    ],
  },
];

const addOnItems = [
  { id: "timing" as const, label: "Timing + personal lap report", price: 8, perPerson: true },
  { id: "photo" as const, label: "Race photos digital pack", price: 20, perPerson: false },
  { id: "overalls" as const, label: "Race overalls hire", price: 5, perPerson: true },
];

export function KartingPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [waiverChecked, setWaiverChecked] = useState(false);
  const [addOns, setAddOns] = useState({ timing: false, photo: false, overalls: false });
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const showBlocked = (msg: string) => {
    setBlockedMsg(msg);
    setTimeout(() => setBlockedMsg(null), 3000);
  };

  const reset = () => {
    setSelectedActivity(null);
    setSelectedSlot(null);
    setGroupSize(1);
    setWaiverChecked(false);
    setAddOns({ timing: false, photo: false, overalls: false });
  };

  const act = activities.find((a) => a.id === selectedActivity) || null;
  const fee = act ? (act.flat ? act.price : act.price * groupSize) : 0;
  const addOnTotal = addOnItems.reduce(
    (s, a) => s + (addOns[a.id] ? (a.perPerson ? groupSize * a.price : a.price) : 0),
    0,
  );
  const total = fee + addOnTotal;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Karting & Adventure Sports</h1>
      <p className="text-sm text-gray-500 mb-6">Race sessions and packages</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {activities.map((a) => (
          <div
            key={a.id}
            onClick={() => {
              setSelectedActivity(a.id);
              setSelectedSlot(null);
              setGroupSize(1);
              setWaiverChecked(false);
              setAddOns({ timing: false, photo: false, overalls: false });
            }}
            className={`border rounded-xl p-3 cursor-pointer ${
              selectedActivity === a.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300"
            }`}
          >
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              BT-03
            </span>
            <div className="text-sm font-medium mt-2 text-gray-900">{a.name}</div>
            <div className="text-xs text-gray-500">{a.subtitle}</div>
            <div className="text-sm font-medium mt-2 text-gray-900">
              {a.flat ? `$${a.price} flat` : `$${a.price}/person`}
            </div>
          </div>
        ))}
      </div>

      {act && (
        <>
          <div className="text-xs uppercase text-gray-400 mb-2">Select Session Time</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {act.slots.map((s) => {
              const soldOut = s.spots === 0;
              const low = s.spots > 0 && s.spots <= 2;
              const active = selectedSlot === s.t;
              let cls =
                "border-gray-200 bg-white hover:border-violet-300 cursor-pointer text-gray-700";
              if (soldOut) cls = "bg-gray-100 text-gray-400 cursor-not-allowed";
              else if (active)
                cls = "border-violet-400 bg-violet-50 text-violet-700 cursor-pointer font-medium";
              else if (low)
                cls = "border-amber-400 bg-amber-50 text-amber-700 cursor-pointer";
              return (
                <div
                  key={s.t}
                  onClick={() => !soldOut && setSelectedSlot(s.t)}
                  className={`border rounded-lg p-2 text-center text-xs ${cls}`}
                >
                  <div>{s.t}</div>
                  <div className="text-[10px] opacity-80">
                    {soldOut ? "Sold out" : low ? `${s.spots} left` : `${s.spots} spots`}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedSlot && !act.flat && (
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="text-xs uppercase text-gray-400 mb-2">Group Size</div>
              <div className="flex items-center gap-4 mb-1">
                <button
                  onClick={() => setGroupSize((v) => Math.max(1, v - 1))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-lg font-medium w-6 text-center">{groupSize}</span>
                <button
                  onClick={() => setGroupSize((v) => Math.min(act.max, v + 1))}
                  className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {act.warning && (
                <div className="text-xs text-amber-600 mt-1">⚠ {act.warning}</div>
              )}
              <div className="text-sm font-medium mt-2">
                ${act.price} × {groupSize} = ${(act.price * groupSize).toFixed(2)}
              </div>
            </div>
          )}

          {selectedSlot && groupSize >= 1 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div className="text-sm font-semibold mb-2 text-amber-900">
                🛡 Safety waiver — required
              </div>
              <div className="text-xs text-amber-800">
                All participants will sign the physical waiver at the venue before entering the
                track.
              </div>
              <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waiverChecked}
                  onChange={() => setWaiverChecked(!waiverChecked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-amber-900">
                  I confirm all {groupSize} participant{groupSize > 1 ? "s" : ""} have been
                  informed of the safety rules.
                </span>
              </label>
            </div>
          )}

          {waiverChecked && (
            <div className="mb-4">
              <div className="text-xs uppercase text-gray-400 mb-2">Add-ons</div>
              {addOnItems.map((a) => {
                const on = addOns[a.id];
                return (
                  <button
                    key={a.id}
                    onClick={() => setAddOns((o) => ({ ...o, [a.id]: !o[a.id] }))}
                    className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 mb-2 text-sm ${
                      on
                        ? "bg-violet-100 text-violet-700 border-violet-400"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    <span>
                      {a.label} · ${a.price}
                      {a.perPerson ? "/person" : ""}
                    </span>
                    <span>{on ? "Added ✓" : "+ Add"}</span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            disabled={!waiverChecked}
            onClick={() => {
              if (!waiverChecked || !selectedSlot) return;
              addToCart({
                btBadge: "BT-03",
                name: act.name,
                price: total,
                vertical: "Karting & Adventure Sports",
                date: "2026-06-14",
                time: selectedSlot,
                qty: 1,
              });
              reset();
            }}
            className={`w-full rounded-xl py-3 text-sm font-semibold ${
              waiverChecked
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to cart · ${total.toFixed(2)}
          </button>
        </>
      )}
    </div>
  );
}
