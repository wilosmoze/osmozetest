import { Header } from "@/components/Header";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CartDrawer } from "@/components/CartDrawer";

export default function CheckoutPage() {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20">
      <Header />
      <div className="container-app">
        <CheckoutForm />
      </div>
      {/* Mount the cart drawer here so the header cart button + the */}
      {/* 'Modify cart' link inside the form both open the same panel */}
      {/* where quantities can be tweaked or lines removed.           */}
      <CartDrawer />
    </main>
  );
}
