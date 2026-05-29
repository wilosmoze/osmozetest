"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";
import { StripePayment } from "./StripePayment";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  notes: string;
};

const empty: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  notes: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const { lines, subtotal, deliveryFee, total } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.06] bg-surface p-12 text-center">
        <h2 className="font-display text-2xl font-semibold">
          Votre panier est vide
        </h2>
        <p className="mt-2 text-zinc-400">
          Ajoutez quelques burgers avant de passer commande.
        </p>
        <button onClick={() => router.push("/")} className="btn-ghost mt-6">
          Retour à la carte
        </button>
      </div>
    );
  }

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.firstName) e.firstName = "Prénom requis";
    if (!form.lastName) e.lastName = "Nom requis";
    if (!/^[\d\s+()-]{8,}$/.test(form.phone)) e.phone = "Téléphone invalide";
    if (!form.address) e.address = "Adresse requise";
    if (!form.city) e.city = "Ville requise";
    if (!/^\d{5}$/.test(form.zip)) e.zip = "Code postal invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3"
      >
        <header className="mb-8">
          <span className="chip">Étape finale</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tighter md:text-5xl">
            Où livrons-nous ?
          </h1>
        </header>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <Field label="Prénom" value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
          <Field label="Nom" value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
          <Field
            className="md:col-span-2"
            label="Téléphone"
            placeholder="+33 6 XX XX XX XX"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            inputMode="tel"
          />
          <Field
            className="md:col-span-2"
            label="Adresse de livraison"
            placeholder="N° et rue"
            value={form.address}
            onChange={(v) => update("address", v)}
            error={errors.address}
          />
          <Field
            label="Code postal"
            value={form.zip}
            onChange={(v) => update("zip", v)}
            error={errors.zip}
            inputMode="numeric"
          />
          <Field label="Ville" value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
          <Field
            className="md:col-span-2"
            label="Notes de livraison (optionnel)"
            placeholder="Digicode, étage, instructions au livreur..."
            value={form.notes}
            onChange={(v) => update("notes", v)}
            multiline
          />
        </form>

        <div className="mt-10 border-t border-white/[0.06] pt-8">
          <StripePayment
            customer={form}
            lines={lines.map((l) => ({
              itemId: l.item.id,
              name: l.item.name,
              price: l.item.price,
              quantity: l.quantity,
            }))}
            deliveryFee={deliveryFee()}
            amount={total()}
            onValidate={validate}
          />
        </div>
      </motion.section>

      <aside className="lg:col-span-2">
        <div className="sticky top-28 rounded-3xl border border-white/[0.06] bg-surface p-6">
          <div className="font-display text-lg font-semibold tracking-tight">
            Récapitulatif
          </div>
          <ul className="mt-4 divide-y divide-white/[0.04]">
            {lines.map((l) => (
              <li key={l.item.id} className="flex gap-3 py-3">
                <img src={l.item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{l.item.name}</div>
                  <div className="font-mono text-xs text-zinc-500">× {l.quantity}</div>
                </div>
                <div className="font-mono text-sm tabular-nums">
                  {formatPrice(l.item.price * l.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-white/[0.06]" />
          <Row label="Sous-total" value={formatPrice(subtotal())} />
          <Row
            label="Livraison"
            value={deliveryFee() === 0 ? "Offerte" : formatPrice(deliveryFee())}
            highlight={deliveryFee() === 0}
          />
          <div className="my-3 h-px bg-white/[0.06]" />
          <div className="flex items-center justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span className="font-mono tabular-nums">{formatPrice(total())}</span>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400">
            <ShieldCheck size={18} weight="duotone" className="mt-0.5 text-emerald-400" />
            <div>
              <span className="text-white">Livraison estimée :</span>{" "}
              {themeConfig.delivery.estimatedMinutes.min}–
              {themeConfig.delivery.estimatedMinutes.max} min après confirmation.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
  multiline,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  inputMode?: "tel" | "numeric" | "text";
}) {
  const baseInput =
    "w-full rounded-2xl border bg-white/[0.02] px-4 py-3.5 text-sm placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-accent/60";
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInput} resize-none ${error ? "border-red-500/60" : "border-white/[0.08]"}`}
        />
      ) : (
        <input
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInput} ${error ? "border-red-500/60" : "border-white/[0.08]"}`}
        />
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm text-zinc-400">
      <span>{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? "text-accent" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
