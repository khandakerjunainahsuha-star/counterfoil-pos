import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingCart,
  Calendar,
  BarChart2,
  Clock,
  CreditCard,
  Banknote,
  Wallet,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { MuseumsGalleriesPOS } from "@/components/MuseumsGalleriesPOS";
import { EscapeRoomsPOS } from "@/components/EscapeRoomsPOS";
import { CinemasPOS } from "@/components/CinemasPOS";
import { TheatresPOS } from "@/components/TheatresPOS";
import { BaseballPOS } from "@/components/BaseballPOS";
import { AmusementParksPOS } from "@/components/AmusementParksPOS";
import { BowlingPOS } from "@/components/BowlingPOS";
import { WaterParksPOS } from "@/components/WaterParksPOS";
import { LaserTagPOS } from "@/components/LaserTagPOS";
import { ZoosPOS } from "@/components/ZoosPOS";
import { HeritageSitesPOS } from "@/components/HeritageSitesPOS";
import { CruisesPOS } from "@/components/CruisesPOS";
import { SpasPOS } from "@/components/SpasPOS";
import { CoworkingPOS } from "@/components/CoworkingPOS";
import { KartingPOS } from "@/components/KartingPOS";
import counterfoilLogo from "@/assets/counterfoil-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Counterfoil Go POS" },
      { name: "description", content: "Point of sale for tours, attractions, and venues." },
    ],
  }),
  component: Index,
});

type CartItem = {
  id: number;
  btBadge: string;
  name: string;
  price: number;
  vertical: string;
  date: string;
  time: string;
  qty: number;
};

function Index() {
  const [activeVertical, setActiveVertical] = useState("museums");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, "id" | "qty">) => {
    setCartItems((prev) => [...prev, { ...item, id: Date.now(), qty: 1 }]);
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const navItems = [
    { icon: ShoppingCart, label: "POS", active: true },
    { icon: Calendar, label: "Schedule" },
    { icon: BarChart2, label: "Sales" },
    { icon: UserCheck, label: "Check In" },
  ];


  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* MOBILE TOP BAR */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <img src={counterfoilLogo} alt="Counterfoil" className="h-8 w-auto" />
        <button
          onClick={() => setCartOpen(true)}
          className="p-2 -mr-2 rounded-md hover:bg-gray-100 relative"
          aria-label="Open cart"
        >
          <ShoppingCart size={20} />
          {cartItems.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-violet-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      {/* BACKDROP */}
      {(sidebarOpen || cartOpen) && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => {
            setSidebarOpen(false);
            setCartOpen(false);
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-[240px] bg-[#F9FAFB] border-r border-gray-200 flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <img src={counterfoilLogo} alt="Counterfoil" className="h-9 w-auto" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 -mr-1 rounded-md hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">VERTICAL</div>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-violet-400"
            value={activeVertical}
            onChange={(e) => setActiveVertical(e.target.value)}
          >
            <option value="museums">01 · Museums & Galleries</option>
            <option value="cinemas">02 · Cinemas</option>
            <option value="theatres">03 · Theatres & Performing Arts</option>
            <option value="amusement">04 · Amusement & Theme Parks</option>
            <option value="waterparks">05 · Water Parks</option>
            <option value="bowling">08 · Bowling Alleys</option>
            <option value="lasertag">09 · Laser Tag / Arcades</option>
            <option value="zoos">10 · Zoos & Wildlife Parks</option>
            <option value="heritage">11 · Heritage Sites & Gardens</option>
            <option value="cruises">12 · Cruises & Ferries</option>
            <option value="spas">13 · Spas & Wellness</option>
            <option value="coworking">14 · Co-working & Event Spaces</option>
            <option value="karting">18 · Karting & Adventure Sports</option>
            <option value="baseball">31 · Baseball Training Facilities</option>
            <option value="escaperooms">07 · Escape Rooms</option>
          </select>
        </div>

        <nav className="flex flex-col gap-1 p-4 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer ${
                  item.active
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-white overflow-y-auto p-4 sm:p-6 pt-[72px] pb-[88px] lg:pt-6 lg:pb-6">
        {activeVertical === "museums" && <MuseumsGalleriesPOS addToCart={addToCart} />}
        {activeVertical === "escaperooms" && <EscapeRoomsPOS addToCart={addToCart} />}
        {activeVertical === "cinemas" && <CinemasPOS addToCart={addToCart} />}
        {activeVertical === "theatres" && <TheatresPOS addToCart={addToCart} />}
        {activeVertical === "amusement" && <AmusementParksPOS addToCart={addToCart} />}
        {activeVertical === "waterparks" && <WaterParksPOS addToCart={addToCart} />}
        {activeVertical === "bowling" && <BowlingPOS addToCart={addToCart} />}
        {activeVertical === "lasertag" && <LaserTagPOS addToCart={addToCart} />}
        {activeVertical === "zoos" && <ZoosPOS addToCart={addToCart} />}
        {activeVertical === "heritage" && <HeritageSitesPOS addToCart={addToCart} />}
        {activeVertical === "cruises" && <CruisesPOS addToCart={addToCart} />}
        {activeVertical === "spas" && <SpasPOS addToCart={addToCart} />}
        {activeVertical === "coworking" && <CoworkingPOS addToCart={addToCart} />}
        {activeVertical === "karting" && <KartingPOS addToCart={addToCart} />}
        {activeVertical === "baseball" && <BaseballPOS addToCart={addToCart} />}
      </main>

      {/* CART */}
      <aside
        className={`w-full max-w-[380px] lg:w-[380px] bg-white border-l border-gray-200 flex flex-col shrink-0 fixed lg:static inset-y-0 right-0 z-40 transition-transform duration-200 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-gray-900">Cart</div>
            <div className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="lg:hidden p-1 -mr-1 rounded-md hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-sm text-gray-400 mt-10">No items in cart</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                      {item.btBadge}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.vertical}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.time}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3">
                    <button className="text-xs text-violet-600 hover:underline cursor-pointer">
                      Edit details
                    </button>
                    <button
                      className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() =>
                        setCartItems((prev) => prev.filter((i) => i.id !== item.id))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCartItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
                          ),
                        )
                      }
                      className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
                    >
                      −
                    </button>
                    <span className="text-sm w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() =>
                        setCartItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
                          ),
                        )
                      }
                      className="w-6 h-6 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4 shrink-0">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tax (5%)</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-gray-100 mt-2">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { id: "card", label: "Card", Icon: CreditCard },
              { id: "cash", label: "Cash", Icon: Banknote },
              { id: "wallet", label: "Wallet", Icon: Wallet },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`rounded-xl py-2 text-sm font-medium cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMethod === id
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <button
            disabled={cartItems.length === 0}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
              cartItems.length > 0
                ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {cartItems.length > 0 ? `Charge $${total.toFixed(2)}` : "Charge $0.00"}
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 grid grid-cols-4 h-[72px] pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                item.active ? "text-violet-600 font-medium" : "text-gray-500"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
