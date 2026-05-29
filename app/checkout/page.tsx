import { Header } from "@/components/Header";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20">
      <Header />
      <div className="container-app">
        <CheckoutForm />
      </div>
    </main>
  );
}
