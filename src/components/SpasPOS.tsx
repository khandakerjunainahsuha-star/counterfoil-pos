import { useState } from "react";

type CartItem = {
  vertical: string;
  therapistId?: string;
  timeMin?: number;
  [key: string]: unknown;
};

type AddToCartFn = (item: {
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
  qty: number;
  therapistId?: string;
  timeMin?: number;
}) => void;

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const services = [
  { id: "s1", name: "Swedish Massage (60m)", price: 90 },
  { id: "s2", name: "Deep Tissue (60m)", price: 110 },
  { id: "s3", name: "Facial (45m)", price: 75 },
  { id: "s4", name: "Hot Stone (90m)", price: 140 },
];

const therapists = [
  {
    id: "t1",
    name: "Amara Doyle",
    role: "Senior Therapist",
    rating: 4.9,
    times: [10 * 60, 11 * 60, 13 * 60, 14 * 60, 15 * 60, 16 * 60],
  },
  {
    id: "t2",
    name: "Ravi Mehta",
    role: "Massage Specialist",
    rating: 4.8,
    times: [10 * 60, 11 * 60, 12 * 60, 14 * 60, 16 * 60, 17 * 60],
  },
  {
    id: "t3",
    name: "Lena Fischer",
    role: "Skincare & Facials",
    rating: 4.7,
    times: [11 * 60, 12 * 60, 13 * 60, 15 * 60, 16 * 60],
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2);

export function SpasPOS({
  addToCart,
  cartItems,
}: {
  addToCart: AddToCartFn;
  cartItems: CartItem[];
}) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const isSlotTaken = (therapistId: string, timeMin: number) =>
    cartItems.some(
      (item) =>
        item.vertical === "Spas & Wellness" &&
        item.therapistId === therapistId &&
        Number(item.timeMin) === Number(timeMin),
    );

  const service = services.find((s) => s.id === selectedService) || null;
  const therapist = therapists.find((t) => t.id === selectedTherapist) || null;

  const slotConflict =
    therapist && selectedTime !== null && isSlotTaken(therapist.id, selectedTime);
  const canAdd = !!service && !!therapist && selectedTime !== null && !slotConflict;

  const handleAdd = () => {
    if (!service || !therapist || selectedTime === null) return;
    if (isSlotTaken(therapist.id, selectedTime)) return;
    addToCart({
      btBadge: "BT-10",
      name: `${service.name} · ${therapist.name}`,
      price: service.price,
      vertical: "Spas & Wellness",
      date: "Today",
      time: fmt(selectedTime),
      qty: 1,
      therapistId: therapist.id,
      timeMin: selectedTime,
    });
    setSelectedTime(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Spas & Wellness</h1>
        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
          BT-10
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Select a service, therapist, and time.</p>

      <div className="text-xs uppercase text-gray-400 mb-2">Service</div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedService(s.id);
              setSelectedTherapist(null);
              setSelectedTime(null);
            }}
            className={`text-left border rounded-xl p-3 cursor-pointer ${
              selectedService === s.id
                ? "border-violet-400 bg-violet-50"
                : "border-gray-200 hover:border-violet-300 hover:shadow-sm"
            }`}
          >
            <div className="text-sm font-medium text-gray-900">{s.name}</div>
            <div className="text-sm text-gray-700 mt-1">${s.price}</div>
          </button>
        ))}
      </div>

      {service && (
        <>
          <div className="text-xs uppercase text-gray-400 mb-2">Therapist</div>
          <div className="grid grid-cols-1 gap-3 mb-5">
            {therapists.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTherapist(t.id);
                  setSelectedTime(null);
                }}
                className={`text-left border rounded-xl p-3 flex items-center gap-3 cursor-pointer ${
                  selectedTherapist === t.id
                    ? "border-violet-400 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {initials(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {t.role}
                    </span>
                    <span className="text-xs text-gray-500">★ {t.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {therapist && (
        <>
          <div className="text-xs uppercase text-gray-400 mb-2">Time</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {therapist.times.map((t) => {
              const taken = isSlotTaken(therapist.id, t);
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  disabled={taken}
                  onClick={() => {
                    if (!taken) setSelectedTime(t);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm border ${
                    taken
                      ? "opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-500"
                      : isSelected
                        ? "border-violet-400 bg-violet-50 text-violet-700 cursor-pointer"
                        : "border-gray-200 hover:border-violet-300 cursor-pointer"
                  }`}
                >
                  {fmt(t)}
                  {taken && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide text-gray-500">
                      · Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {service && therapist && selectedTime !== null && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-700 mb-3">
            {service.name} · {therapist.name} · {fmt(selectedTime)} ·{" "}
            <span className="font-semibold text-gray-900">${service.price}</span>
          </div>
          {slotConflict && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
              Therapist not available at this time.
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`w-full rounded-xl py-3 text-sm font-semibold ${
              canAdd
                ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                : "bg-gray-900 text-white opacity-40 cursor-not-allowed"
            }`}
          >
            Add to Cart · ${service.price}
          </button>
        </div>
      )}
    </div>
  );
}
