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

const sessions = [
  { id: "s1", arena: "Main Arena", time: "2:30 PM", filled: 12, total: 20, soon: true },
  { id: "s2", arena: "Main Arena", time: "3:00 PM", filled: 4, total: 20, soon: false },
  { id: "s3", arena: "VIP Arena", time: "2:30 PM", filled: 19, total: 20, soon: true },
  { id: "s4", arena: "Main Arena", time: "3:30 PM", filled: 0, total: 20, soon: false },
  { id: "s5", arena: "VIP Arena", time: "3:00 PM", filled: 8, total: 20, soon: false },
  { id: "s6", arena: "Main Arena", time: "4:00 PM", filled: 0, total: 20, soon: false },
];

const PRICE = 18;

export function LaserTagPOS({ addToCart }: { addToCart: AddToCartFn }) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [addOns, setAddOns] = useState({ photo: false, cert: false });
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);
  const showBlocked = (msg: string) => {
    setBlockedMsg(msg);
    setTimeout(() => setBlockedMsg(null), 3000);
  };

  const sess = sessions.find((s) => s.id === selectedSession) || null;
  const sessRemaining = sess ? sess.total - sess.filled : 0;
  const total = sess
    ? PRICE * groupSize + (addOns.photo ? 12 : 0) + (addOns.cert ? groupSize * 5 : 0)
    : 0;

  const reset = () => {
    setSelectedSession(null);
    setGroupSize(1);
    setAddOns({ photo: false, cert: false });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Laser Tag / Arcades</h1>
      <p className="text-sm text-gray-500 mb-6">Book an arena session</p>

      <div className="text-xs uppercase text-gray-400 mb-3">Upcoming Sessions</div>
      {sessions.map((s) => {
        const remaining = s.total - s.filled;
        const pct = (s.filled / s.total) * 100;
        const barColor =
          pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-green-500";
        const remColor =
          remaining === 1
            ? "text-red-600"
            : remaining < 5
              ? "text-amber-600"
              : "text-green-600";

        let cls = "border-gray-200 bg-white hover:border-violet-300";
        if (remaining === 0) cls = "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60";
        else if (selectedSession === s.id) cls = "border-violet-400 bg-violet-50";
        else if (s.soon) cls = "border-amber-400 bg-amber-50";

        return (
          <div
            key={s.id}
            onClick={() => {
              if (remaining === 0) {
                showBlocked("This session is full. Please choose another available session below.");
                return;
              }
              setBlockedMsg(null);
              setSelectedSession(s.id);
              setGroupSize(1);
            }}
            className={`border rounded-xl p-4 mb-3 cursor-pointer ${cls}`}
          >
            <div className="flex items-center">
              <span className="text-xs text-gray-500">{s.arena}</span>
              {s.soon && remaining > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full ml-auto">
                  STARTING SOON
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-gray-900 mt-1">{s.time}</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className={`h-2 ${barColor} rounded-full`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className={`text-xs mt-1 ${remColor}`}>{remaining} spots left</div>
          </div>
        );
      })}
      <BlockedNotice message={blockedMsg} onDismiss={() => setBlockedMsg(null)} />


      {sess && (
        <div className="mt-6 border border-gray-200 rounded-xl p-4">
          <div className="text-xs uppercase text-gray-400 mb-3">Group Size</div>
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setGroupSize((v) => Math.max(1, v - 1))}
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              −
            </button>
            <span className="text-lg font-medium w-6 text-center">{groupSize}</span>
            <button
              onClick={() => setGroupSize((v) => Math.min(sessRemaining, v + 1))}
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              +
            </button>
            <div className="text-sm font-medium text-gray-700">
              ${PRICE} × {groupSize} = ${(PRICE * groupSize).toFixed(2)}
            </div>
          </div>

          <div className="text-xs uppercase text-gray-400 mb-2 mt-4">Add-ons</div>
          <button
            onClick={() => setAddOns((a) => ({ ...a, photo: !a.photo }))}
            className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 mb-2 text-sm ${
              addOns.photo
                ? "border-violet-400 bg-violet-50 text-violet-700"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <span>Photo package · $12 flat</span>
            <span>{addOns.photo ? "✓" : "+"}</span>
          </button>
          <button
            onClick={() => setAddOns((a) => ({ ...a, cert: !a.cert }))}
            className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm ${
              addOns.cert
                ? "border-violet-400 bg-violet-50 text-violet-700"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <span>Mission certificate · $5 each</span>
            <span>{addOns.cert ? "✓" : "+"}</span>
          </button>

          <button
            onClick={() => {
              addToCart({
                btBadge: "BT-06",
                name: "Laser Tag · " + sess.arena,
                price: total,
                vertical: "Laser Tag / Arcades",
                date: "2026-06-14",
                time: sess.time,
                qty: 1,
              });
              reset();
            }}
            className="w-full mt-4 bg-violet-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-violet-700"
          >
            {groupSize} players · {sess.time} · ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
