import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CartDrawer } from "@/components/CartDrawer";
import { isGrabOnly } from "@/lib/ordering";

export default function CheckoutPage() {
  // In Grab-only mode, in-site checkout is closed — bounce back to the
  // homepage where the sticky Grab bar handles ordering.
  if (isGrabOnly()) redirect("/");

  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20">
      <Header />
      <div className="container-app">
        <CheckoutForm />
      </div>
      <CartDrawer />
    </main>
  );
}
