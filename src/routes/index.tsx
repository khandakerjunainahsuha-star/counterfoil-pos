import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap,
  ShoppingCart,
  Package,
  Tag,
  CreditCard,
  Users,
  BarChart2,
  FileText,
  Layers,
  Plug,
  UserCheck,
  Bell,
  Settings,
  HelpCircle,
  Calendar,
  Clock,
  Banknote,
  Wallet,
} from "lucide-react";
import { MuseumsGalleriesPOS } from "@/components/MuseumsGalleriesPOS";
import { EscapeRoomsPOS } from "@/components/EscapeRoomsPOS";
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

  const addToCart = (item: Omit<CartItem, "id" | "qty">) => {
    setCartItems((prev) => [...prev, { ...item, id: Date.now(), qty: 1 }]);
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const navItems = [
    { icon: Zap, label: "Operate" },
    { icon: ShoppingCart, label: "POS", active: true },
    { icon: Package, label: "Catalog" },
    { icon: Tag, label: "Promotions" },
    { icon: CreditCard, label: "Payments" },
    { icon: Users, label: "Customers" },
    { icon: BarChart2, label: "Analytics" },
    { icon: FileText, label: "Reports" },
  ];

  const generalItems = [
    { icon: Layers, label: "Verticals" },
    { icon: Plug, label: "Integrations" },
    { icon: UserCheck, label: "Team" },
    { icon: Bell, label: "Notifications" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Support" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-[#F9FAFB] border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 bg-gray-900">
          <img src={counterfoilLogo} alt="Counterfoil" className="h-6 w-auto" />
        </div>

        <div className="px-4 pt-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">VERTICAL</div>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-violet-400"
            value={activeVertical}
            onChange={(e) => setActiveVertical(e.target.value)}
          >
            <option value="museums">01 · Museums & Galleries</option>
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

          <div className="text-xs uppercase tracking-wider text-gray-400 px-3 mt-4 mb-1">
            GENERAL
          </div>
          {generalItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-white overflow-y-auto p-6">
        {activeVertical === "museums" && <MuseumsGalleriesPOS addToCart={addToCart} />}
        {activeVertical === "escaperooms" && <EscapeRoomsPOS addToCart={addToCart} />}
      </main>

      {/* CART */}
      <aside className="w-[380px] bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">Cart</div>
          <div className="bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </div>
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
    </div>
  );
}
