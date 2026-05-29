# BRAISE.

Dark kitchen premium — site de commande en ligne pour burgers flammés, livraison uniquement.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (panier persistant)
- Stripe Checkout (embedded)
- Server-Sent Events (tracking temps réel)

## Démarrer en local

```bash
# 1. Installer les dépendances
npm install

# 2. (Optionnel) Configurer les variables d'environnement
cp .env.local.example .env.local
# Puis éditez .env.local avec vos clés Stripe et mot de passe admin

# 3. Lancer le serveur de dev
npm run dev
```

Ouvrez http://localhost:3000

## Structure

```
app/             Pages et routes API (App Router)
components/      Composants BRAISE. (Hero, Menu, Cart, etc.)
components/ui/   Primitives shadcn (Button, Card, Badge)
config/          theme.config.ts — TOUT est paramétrable ici
data/            menu.ts, journey.ts
lib/             store Zustand, orders, auth, stripe, utils
```

## Personnalisation

Tout passe par `config/theme.config.ts` : nom de marque, couleurs, logique de livraison, contacts, réseaux sociaux.

## Mode démo vs production

| Fonctionnalité | Sans clés | Avec clés Stripe + admin |
|---|---|---|
| Menu + Panier | ✓ | ✓ |
| Checkout (UI) | ✓ | ✓ |
| Paiement réel | ✗ | ✓ |
| Tracking temps réel | ✓ (mock) | ✓ (réel via webhook) |
| Dashboard admin `/admin` | ✗ | ✓ |

## Déploiement Vercel

1. Pousser sur GitHub
2. Importer le repo sur https://vercel.com/new
3. Ajouter les variables d'environnement (Settings → Environment Variables)
4. Déployer

## Routes principales

| Route | Description |
|---|---|
| `/` | Site public + menu |
| `/checkout` | Tunnel de commande |
| `/tracking/[orderId]` | Suivi temps réel |
| `/admin` | Dashboard équipe (protégé) |
