"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  ArrowSquareOut,
  Info,
  Crosshair,
  CheckCircle,
  WarningCircle,
  X,
  PencilSimple,
} from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";
import { useT } from "@/lib/i18n";
import {
  extractCoords,
  isShortMapsUrl,
  distanceKm as computeDistanceKm,
} from "@/lib/delivery";
import { StripePayment } from "./StripePayment";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  locationUrl: string;
  notes: string;
};

const empty: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  locationUrl: "",
  notes: "",
};

// Validation : doit ressembler à un lien Google Maps (court ou long)
const GMAPS_REGEX =
  /^https?:\/\/(?:[\w.-]+\.)?(?:google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i;

export function CheckoutForm() {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [geoStatus, setGeoStatus] = useState<{
    loading: boolean;
    error: string | null;
    zoneDetected: "rawai" | "outside" | "too_far" | null;
    distanceKm: number | null;
  }>({ loading: false, error: null, zoneDetected: null, distanceKm: null });
  const [showGrabModal, setShowGrabModal] = useState(false);
  const {
    lines,
    subtotal,
    deliveryFee,
    total,
    deliveryZoneId,
    setDeliveryZone,
    openDrawer: openCartDrawer,
  } = useCart();

  /** Classify a coords pair locally — mirrors lib/delivery.ts logic. */
  const classifyLocal = (
    lat: number,
    lng: number,
  ): { zone: "rawai" | "outside" | "too_far"; km: number } => {
    const km = computeDistanceKm(
      themeConfig.delivery.kitchenLocation,
      { lat, lng },
    );
    if (km > themeConfig.delivery.maxDistanceKm) {
      return { zone: "too_far", km };
    }
    const RAWAI = { n: 7.815, s: 7.735, e: 98.375, w: 98.282 };
    const inRawai =
      lat >= RAWAI.s && lat <= RAWAI.n && lng >= RAWAI.w && lng <= RAWAI.e;
    return { zone: inRawai ? "rawai" : "outside", km };
  };

  /** Auto-set zone when a URL is entered.
   *  1. Try local extraction (instant, works for long URLs).
   *  2. If the URL is a short maps.app.goo.gl link, ask the server to
   *     follow the redirect and resolve the coords for us.            */
  const updateLocationUrl = (url: string) => {
    setForm((f) => ({ ...f, locationUrl: url }));
    setErrors((e) => ({ ...e, locationUrl: undefined }));

    const coords = extractCoords(url);
    if (coords) {
      const { zone, km } = classifyLocal(coords.lat, coords.lng);
      if (zone !== "too_far") setDeliveryZone(zone);
      setGeoStatus({
        loading: false,
        error: null,
        zoneDetected: zone,
        distanceKm: km,
      });
      if (zone === "too_far") setShowGrabModal(true);
      return;
    }

    // Local extraction failed. If it's a short Maps URL, ask the server.
    if (isShortMapsUrl(url)) {
      setGeoStatus((s) => ({
        ...s,
        zoneDetected: null,
        distanceKm: null,
        error: null,
        loading: true,
      }));
      fetch("/api/resolve-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationUrl: url }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r)))
        .then(
          (data: {
            zoneId: "rawai" | "outside" | "too_far";
            coordsResolved: boolean;
            distanceKm: number | null;
          }) => {
            if (data.coordsResolved) {
              if (data.zoneId !== "too_far") setDeliveryZone(data.zoneId);
              setGeoStatus({
                loading: false,
                error: null,
                zoneDetected: data.zoneId,
                distanceKm: data.distanceKm,
              });
              if (data.zoneId === "too_far") setShowGrabModal(true);
            } else {
              setGeoStatus({
                loading: false,
                error: t("co.shortLinkFail"),
                zoneDetected: null,
                distanceKm: null,
              });
            }
          },
        )
        .catch(() =>
          setGeoStatus({
            loading: false,
            error: null,
            zoneDetected: null,
            distanceKm: null,
          }),
        );
      return;
    }

    setGeoStatus((s) => ({ ...s, zoneDetected: null, distanceKm: null, loading: false }));
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus((s) => ({
        ...s,
        error: t("co.geoUnsupported"),
      }));
      return;
    }
    setGeoStatus({ loading: true, error: null, zoneDetected: null, distanceKm: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        const { zone, km } = classifyLocal(latitude, longitude);
        setForm((f) => ({ ...f, locationUrl: url }));
        setErrors((e) => ({ ...e, locationUrl: undefined }));
        if (zone !== "too_far") setDeliveryZone(zone);
        setGeoStatus({ loading: false, error: null, zoneDetected: zone, distanceKm: km });
        if (zone === "too_far") setShowGrabModal(true);
      },
      (err) => {
        let msg = t("co.geoGeneric");
        if (err.code === err.PERMISSION_DENIED) {
          msg = t("co.geoDenied");
        } else if (err.code === err.TIMEOUT) {
          msg = t("co.geoTimeout");
        }
        setGeoStatus({ loading: false, error: msg, zoneDetected: null, distanceKm: null });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.06] bg-surface p-12 text-center">
        <h2 className="font-display text-2xl font-semibold">
          {t("co.cartEmpty")}
        </h2>
        <p className="mt-2 text-zinc-400">{t("co.cartEmptyHint")}</p>
        <button onClick={() => router.push("/")} className="btn-ghost mt-6">
          {t("co.backToMenu")}
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
    if (!form.firstName) e.firstName = t("co.firstNameError");
    if (!form.lastName) e.lastName = t("co.lastNameError");
    if (!/^[\d\s+()-]{8,}$/.test(form.phone)) e.phone = t("co.phoneError");
    // Email is optional — only validate format when provided.
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = t("co.emailError");
    }
    if (!form.locationUrl.trim()) {
      e.locationUrl = t("co.linkRequired");
    } else if (!GMAPS_REGEX.test(form.locationUrl.trim())) {
      e.locationUrl = t("co.linkInvalid");
    }
    // Hard block: too far from kitchen
    if (geoStatus.zoneDetected === "too_far") {
      e.locationUrl = t("co.locationOutsideError");
      setShowGrabModal(true);
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const locationOk =
    form.locationUrl.trim().length > 0 &&
    GMAPS_REGEX.test(form.locationUrl.trim());

  return (
    <>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3"
      >
        <header className="mb-8">
          <span className="chip">{t("co.finalStep")}</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tighter md:text-5xl">
            {t("co.title")}
          </h1>
        </header>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <Field label={t("co.firstName")} value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
          <Field label={t("co.lastName")} value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
          <Field
            className="md:col-span-2"
            label={t("co.phone")}
            placeholder={t("co.phonePh")}
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            inputMode="tel"
          />
          <Field
            className="md:col-span-2"
            label={t("co.email")}
            placeholder={t("co.emailPh")}
            value={form.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
            inputMode="email"
          />

          {/* ---------- BLOC LIEN GOOGLE MAPS ---------- */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
                <MapPin size={14} weight="duotone" />
                {t("co.locationTitle")}
              </span>
              <button
                type="button"
                onClick={() => setShowHelp((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-accent"
              >
                <Info size={13} weight="duotone" />
                {showHelp ? t("co.hideHelp") : t("co.howto")}
              </button>
            </div>

            {/* Big "Use my current location" button — 1-click solution */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoStatus.loading}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-accent/[0.08] px-4 py-4 text-sm text-accent transition-all hover:bg-accent hover:text-zinc-950 active:translate-y-[1px] disabled:opacity-70"
            >
              <span className="flex items-center gap-3">
                {geoStatus.loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="block h-4 w-4 rounded-full border-2 border-accent border-t-transparent"
                  />
                ) : (
                  <Crosshair size={18} weight="duotone" />
                )}
                <span className="font-medium">
                  {geoStatus.loading ? t("co.locating") : t("co.useMyLocation")}
                </span>
              </span>
              <span className="text-xs opacity-70">{t("co.oneTap")}</span>
            </button>

            <div className="flex items-center gap-3 py-1 text-[10px] uppercase tracking-widest text-zinc-600">
              <span className="h-px flex-1 bg-white/[0.04]" />
              {t("co.orPaste")}
              <span className="h-px flex-1 bg-white/[0.04]" />
            </div>

            {/* Direct shortcut to open Google Maps in a new tab */}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-sm text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.05] active:translate-y-[1px]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                  <MapPin size={16} weight="duotone" className="text-accent" />
                </span>
                <span>
                  <span className="block font-medium">{t("co.openMapsBtn")}</span>
                  <span className="block text-[11px] text-zinc-500">
                    {t("co.openMapsHint")}
                  </span>
                </span>
              </span>
              <ArrowSquareOut
                size={16}
                weight="bold"
                className="text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
              />
            </a>

            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400"
              >
                <p className="text-zinc-300 font-medium mb-2">
                  {t("co.helpMobile")}
                </p>
                <ol className="space-y-1.5 list-decimal list-inside marker:text-accent">
                  <li>{t("co.step1")}</li>
                  <li>{t("co.step2")}</li>
                  <li>{t("co.step3")}</li>
                  <li>{t("co.step4")}</li>
                </ol>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                >
                  {t("co.openMapsNewTab")}
                  <ArrowSquareOut size={12} weight="bold" />
                </a>
              </motion.div>
            )}

            <div className="relative">
              <input
                value={form.locationUrl}
                onChange={(e) => updateLocationUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={`w-full rounded-2xl border bg-white/[0.02] px-4 py-3.5 pr-12 text-sm placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-accent/60 ${
                  errors.locationUrl
                    ? "border-red-500/60"
                    : locationOk
                      ? "border-emerald-500/40"
                      : "border-white/[0.08]"
                }`}
              />
              {locationOk && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400"
                >
                  <MapPin size={18} weight="fill" />
                </motion.div>
              )}
            </div>

            {errors.locationUrl && (
              <span className="text-xs text-red-400">{errors.locationUrl}</span>
            )}
            {geoStatus.error && (
              <span className="text-xs text-red-400">{geoStatus.error}</span>
            )}
            {locationOk && !errors.locationUrl && !geoStatus.zoneDetected && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                {t("co.linkValid")}
              </span>
            )}

            {/* Zone auto-detected: green Rawai / amber Outside / red TooFar */}
            {geoStatus.zoneDetected && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                  geoStatus.zoneDetected === "rawai"
                    ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300"
                    : geoStatus.zoneDetected === "outside"
                      ? "border-amber-500/30 bg-amber-500/[0.06] text-amber-300"
                      : "border-red-500/30 bg-red-500/[0.06] text-red-300"
                }`}
              >
                {geoStatus.zoneDetected === "too_far" ? (
                  <WarningCircle size={14} weight="duotone" />
                ) : (
                  <CheckCircle size={14} weight="duotone" />
                )}
                {geoStatus.zoneDetected === "rawai" && (
                  <span>
                    <span className="font-medium">{t("co.inRawai.youAreIn")}</span>{" "}
                    {t("co.inRawai.tail")}
                  </span>
                )}
                {geoStatus.zoneDetected === "outside" && (
                  <span>
                    <span className="font-medium">{t("co.outside.youAreOut")}</span>{" "}
                    {t("co.outside.tail", { fee: formatPrice(20) })}
                  </span>
                )}
                {geoStatus.zoneDetected === "too_far" && (
                  <span>
                    <span className="font-medium">
                      {t("co.tooFar.label", { km: themeConfig.delivery.maxDistanceKm })}
                    </span>
                    {geoStatus.distanceKm !== null && (
                      <span className="ml-1 text-red-200/80">
                        ({geoStatus.distanceKm.toFixed(1)} km)
                      </span>
                    )}{" "}
                    {t("co.tooFar.tail")}
                  </span>
                )}
              </motion.div>
            )}

            {locationOk && (
              <a
                href={form.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-accent/40 hover:text-white"
              >
                {t("co.previewMaps")}
                <ArrowSquareOut size={12} weight="bold" />
              </a>
            )}
          </div>
          {/* ---------- /GOOGLE MAPS LINK BLOCK ---------- */}

          <Field
            className="md:col-span-2"
            label={t("co.notes")}
            placeholder={t("co.notesPh")}
            value={form.notes}
            onChange={(v) => update("notes", v)}
            multiline
          />

          {/* ---------- DELIVERY ZONE — READ-ONLY, AUTO-DETECTED ---------- */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                {t("co.zoneTitle")}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-600">
                <ShieldCheck size={11} weight="duotone" />
                {t("co.autoDetected")}
              </span>
            </div>

            {(() => {
              const tooFar = geoStatus.zoneDetected === "too_far";
              const activeZone = themeConfig.delivery.zones.find(
                (z) => z.id === deliveryZoneId,
              );
              const detected = !!geoStatus.zoneDetected;
              const isRawai = deliveryZoneId === "rawai" && !tooFar;

              // No location set yet → neutral placeholder
              if (!detected && !locationOk) {
                return (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-4 py-4 text-sm text-zinc-500">
                    <MapPin size={18} weight="duotone" className="opacity-50" />
                    <span>{t("co.shareFirst")}</span>
                  </div>
                );
              }

              // Too far → red card with Grab CTA
              if (tooFar) {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                        <WarningCircle size={18} weight="fill" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-red-300">
                          {t("co.outOfRange")}
                        </div>
                        <div className="mt-0.5 text-[11px] text-red-200/70">
                          {geoStatus.distanceKm !== null
                            ? `${geoStatus.distanceKm.toFixed(1)} km — `
                            : ""}
                          {t("co.zoneOnlyKm", { km: themeConfig.delivery.maxDistanceKm })}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGrabModal(true)}
                      className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20"
                    >
                      {t("co.tooFar.useGrab")}
                    </button>
                  </motion.div>
                );
              }

              // Zone detected (Rawai or Outside)
              return (
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: isRawai
                      ? "rgba(16, 185, 129, 0.06)"
                      : "rgba(245, 158, 11, 0.06)",
                    borderColor: isRawai
                      ? "rgba(16, 185, 129, 0.3)"
                      : "rgba(245, 158, 11, 0.3)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between gap-3 rounded-2xl border px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        isRawai
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      <MapPin size={18} weight="fill" />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          isRawai ? "text-emerald-300" : "text-amber-300"
                        }`}
                      >
                        {activeZone?.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-zinc-500">
                        {activeZone?.description}
                        {geoStatus.distanceKm !== null && (
                          <span className="ml-1 text-zinc-600">
                            · {geoStatus.distanceKm.toFixed(1)} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`text-right ${
                      isRawai ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    <div className="font-display text-xl font-semibold tracking-tight">
                      {activeZone && activeZone.fee === 0
                        ? t("co.free")
                        : `+${formatPrice(activeZone?.fee ?? 0)}`}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest opacity-70">
                      {t("co.deliveryFee")}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
          {/* ---------- /DELIVERY ZONE ---------- */}
        </form>

        <div className="mt-10 border-t border-white/[0.06] pt-8">
          {geoStatus.zoneDetected === "too_far" ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.04] p-6 text-center">
              <WarningCircle
                size={28}
                weight="duotone"
                className="mx-auto text-red-400"
              />
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-red-200">
                {t("co.outOfRange")}
              </h3>
              <p className="mt-2 mx-auto max-w-[42ch] text-sm text-red-200/70">
                {t("co.outOfRangeBody")}
              </p>
              <button
                type="button"
                onClick={() => setShowGrabModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-5 py-3 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/25"
              >
                <ArrowSquareOut size={16} weight="bold" />
                {t("co.openGrabFood")}
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </motion.section>

      <aside className="lg:col-span-2">
        <div className="sticky top-28 rounded-3xl border border-white/[0.06] bg-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="font-display text-lg font-semibold tracking-tight">
              {t("co.summary")}
            </div>
            <button
              type="button"
              onClick={openCartDrawer}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-300 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:translate-y-[1px]"
            >
              <PencilSimple size={12} weight="bold" />
              {t("co.modify")}
            </button>
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
          <Row label={t("co.subtotal")} value={formatPrice(subtotal())} />
          <Row
            label={t("co.delivery")}
            value={deliveryFee() === 0 ? t("co.free") : formatPrice(deliveryFee())}
            highlight={deliveryFee() === 0}
          />
          <div className="my-3 h-px bg-white/[0.06]" />
          <div className="flex items-center justify-between font-display text-lg font-semibold">
            <span>{t("co.total")}</span>
            <span className="font-mono tabular-nums">{formatPrice(total())}</span>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400">
            <ShieldCheck size={18} weight="duotone" className="mt-0.5 text-emerald-400" />
            <div>
              <span className="text-white">{t("co.estimatedDelivery")}</span>{" "}
              {themeConfig.delivery.estimatedMinutes.min}–
              {themeConfig.delivery.estimatedMinutes.max} {t("co.minAfter")}
            </div>
          </div>
        </div>
      </aside>
    </div>

    {/* ---------- OUT-OF-RANGE GRAB MODAL ---------- */}
    <AnimatePresence>
      {showGrabModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowGrabModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-white/[0.08] bg-surface p-8"
          >
            <button
              type="button"
              onClick={() => setShowGrabModal(false)}
              aria-label={t("common.close")}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={16} weight="bold" />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <WarningCircle size={28} weight="duotone" />
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">
              {t("gm.title")}
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              {t("gm.body1", { km: themeConfig.delivery.maxDistanceKm })}
              {geoStatus.distanceKm !== null && (
                <>
                  {" "}
                  {t("gm.body1.distance", { km: geoStatus.distanceKm.toFixed(1) })}
                </>
              )}
            </p>
            <p className="mt-3 text-sm text-zinc-400">{t("gm.body2")}</p>

            <a
              href={themeConfig.delivery.grabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-between gap-3 rounded-full bg-emerald-500 px-5 py-4 text-sm font-semibold text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px]"
            >
              <span className="flex items-center gap-2">
                <ArrowSquareOut size={18} weight="bold" />
                {t("gm.openGrab")}
              </span>
              <span className="text-xs uppercase tracking-widest opacity-70">
                {t("gm.external")}
              </span>
            </a>

            <button
              type="button"
              onClick={() => setShowGrabModal(false)}
              className="mt-3 w-full rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            >
              {t("gm.different")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
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
  inputMode?: "tel" | "numeric" | "text" | "email";
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
