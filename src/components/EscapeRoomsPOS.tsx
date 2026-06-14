import { useState } from "react";
import { BlockedNotice } from "./BlockedNotice";

type Slot = { t: string; spots: number };
type Room = {
  id: string;
  bt: string;
  name: string;
  theme: string;
  price: number;
  min: number;
  max: number;
  slots: Slot[];
};

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
}) => void;

const rooms: Room[] = [
  {
    id: "vault",
    bt: "BT-03",
    name: "The Vault",
    theme: "Heist theme · ●●●○○ difficulty",
    price: 28,
    min: 2,
    max: 6,
    slots: [
      { t: "10:00", spots: 0 },
      { t: "11:30", spots: 1 },
      { t: "13:00", spots: 6 },
      { t: "14:30", spots: 4 },
      { t: "16:00", spots: 6 },
      { t: "17:30", spots: 6 },
      { t: "19:00", spots: 6 },
    ],
  },
  {
    id: "lab",
    bt: "BT-03",
    name: "The Laboratory",
    theme: "Sci-fi horror · ●●●●○ difficulty",
    price: 28,
    min: 2,
    max: 5,
    slots: [
      { t: "11:00", spots: 5 },
      { t: "12:30", spots: 0 },
      { t: "14:00", spots: 3 },
      { t: "15:30", spots: 5 },
      { t: "17:00", spots: 5 },
    ],
  },
  {
    id: "manor",
    bt: "BT-03",
    name: "Haunted Manor",
    theme: "Horror · ●●●●● difficulty",
    price: 32,
    min: 3,
    max: 8,
    slots: [
      { t: "10:30", spots: 8 },
      { t: "12:00", spots: 0 },
      { t: "13:30", spots: 8 },
      { t: "15:00", spots: 6 },
      { t: "16:30", spots: 8 },
    ],
  },
  {
    id: "family",
    bt: "BT-03",
    name: "Family Adventure",
    theme: "Kids friendly · ●○○○○ difficulty",
    price: 22,
    min: 2,
    max: 8,
    slots: [
      { t: "09:00", spots: 8 },
      { t: "10:30", spots: 8 },
      { t: "12:00", spots: 8 },
      { t: "13:30", spots: 4 },
      { t: "15:00", spots: 8 },
    ],
  },
];

const addOnList = [
  { id: "hints" as const, label: "Hint package (3 hints)", price: 10 },
  { id: "photo" as const, label: "Game photography", price: 25 },
  { id: "private" as const, label: "Private room upgrade", price: 40 },
];

export function EscapeRoomsPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [roomsData, setRoomsData] = useState<Room[]>(rooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(0);
  const [addOns, setAddOns] = useState({ hints: false, photo: false, private: false });
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const showBlocked = (msg: string) => {
    setBlockedMsg(msg);
    setTimeout(() => setBlockedMsg(null), 3000);
  };

  const room = roomsData.find((r) => r.id === selectedRoom);
  const addOnTotal = (addOns.hints ? 10 : 0) + (addOns.photo ? 25 : 0) + (addOns.private ? 40 : 0);
  const total = room ? groupSize * room.price + addOnTotal : 0;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {roomsData.map((r) => {
          const active = selectedRoom === r.id;
          return (
            <div
              key={r.id}
              onClick={() => {
                setSelectedRoom(r.id);
                setSelectedSlot(null);
                setGroupSize(0);
                setAddOns({ hints: false, photo: false, private: false });
              }}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                active
                  ? "border-violet-400 bg-violet-50"
                  : "border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm"
              }`}
            >
              <span className="inline-block text-xs font-medium text-violet-700 bg-violet-100 rounded px-1.5 py-0.5">
                {r.bt}
              </span>
              <div className="text-sm font-medium mt-2">{r.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.theme}</div>
              <div className="text-sm font-medium mt-2">${r.price}/person</div>
            </div>
          );
        })}
      </div>

      {room && (
        <div>
          <div className="text-xs uppercase text-gray-400 mb-2">SELECT A TIME SLOT</div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {room.slots.map((s) => {
              if (s.spots === 0) {
                return (
                  <div
                    key={s.t}
                    onClick={() =>
                      showBlocked(
                        "This session is fully booked — please choose a different time slot.",
                      )
                    }
                    className="bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg p-2 text-center text-xs"
                  >
                    <div className="text-sm font-medium">{s.t}</div>
                    <div className="text-xs">Sold out</div>
                  </div>
                );
              }
              if (selectedSlot === s.t) {
                return (
                  <div
                    key={s.t}
                    onClick={() => {
                      setBlockedMsg(null);
                      setSelectedSlot(s.t);
                    }}
                    className="border border-violet-400 bg-violet-50 text-violet-700 cursor-pointer rounded-lg p-2 text-center text-xs font-medium"
                  >
                    <div className="text-sm font-medium">{s.t}</div>
                    <div className="text-xs text-gray-500">{s.spots} spots</div>
                  </div>
                );
              }
              if (s.spots === 1) {
                return (
                  <div
                    key={s.t}
                    onClick={() => {
                      setBlockedMsg(null);
                      setSelectedSlot(s.t);
                    }}
                    className="border border-amber-400 bg-amber-50 text-amber-700 cursor-pointer rounded-lg p-2 text-center text-xs"
                  >
                    <div className="text-sm font-medium">{s.t}</div>
                    <div className="text-xs text-gray-500">{s.spots} spots</div>
                  </div>
                );
              }
              return (
                <div
                  key={s.t}
                  onClick={() => {
                    setBlockedMsg(null);
                    setSelectedSlot(s.t);
                  }}
                  className="border border-gray-200 bg-white hover:border-violet-300 cursor-pointer rounded-lg p-2 text-center text-xs"
                >
                  <div className="text-sm font-medium">{s.t}</div>
                  <div className="text-xs text-gray-500">{s.spots} spots</div>
                </div>
              );
            })}
          </div>
          <BlockedNotice message={blockedMsg} onDismiss={() => setBlockedMsg(null)} />


          {selectedSlot && (
            <div>
              <div className="text-xs uppercase text-gray-400 mb-2">GROUP SIZE</div>
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setGroupSize((g) => Math.max(0, g - 1))}
                  className="border rounded-lg w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                  {groupSize}
                </span>
                <button
                  onClick={() => setGroupSize((g) => Math.min(room.max, g + 1))}
                  className="border rounded-lg w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-xs text-gray-400">
                  Min {room.min} · Max {room.max} players
                </span>
              </div>

              {groupSize > 0 && groupSize < room.min && (
                <div className="text-xs text-red-500 mb-2">
                  Minimum {room.min} players required for this room
                </div>
              )}

              {groupSize >= room.min && (
                <div className="text-sm font-medium text-gray-900 mb-3">
                  {groupSize} × ${room.price} = ${(groupSize * room.price).toFixed(2)}
                </div>
              )}

              {groupSize >= room.min && (
                <div>
                  {addOnList.map((a) => {
                    const on = addOns[a.id];
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
                          onClick={() => setAddOns((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
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
                </div>
              )}

              <button
                disabled={groupSize < room.min}
                className="w-full mt-4 bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
                onClick={() => {
                  addToCart({
                    btBadge: "BT-03",
                    name: room.name,
                    price: total,
                    vertical: "Escape Rooms",
                    date: "2026-06-14",
                    time: selectedSlot!,
                  });
                  // Decrement inventory: escape room slot is exclusive once booked
                  setRoomsData((prev) =>
                    prev.map((r) =>
                      r.id === room.id
                        ? {
                            ...r,
                            slots: r.slots.map((s) =>
                              s.t === selectedSlot ? { ...s, spots: 0 } : s,
                            ),
                          }
                        : r,
                    ),
                  );
                  setSelectedRoom(null);
                  setSelectedSlot(null);
                  setGroupSize(0);
                  setAddOns({ hints: false, photo: false, private: false });
                }}
              >
                {groupSize >= room.min
                  ? `${groupSize} players · ${selectedSlot} · $${total.toFixed(2)}`
                  : "Select group size above"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
