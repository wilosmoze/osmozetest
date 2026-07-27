import { themeConfig } from "@/config/theme.config";

/**
 * Whether the site is currently in Grab-only soft-launch mode.
 * When true:
 *  - hero + product CTAs redirect to Grab Food
 *  - the cart, cart drawer, checkout and tracker are all hidden
 *  - a persistent floating bar at the bottom nudges users to Grab
 * Flip themeConfig.ordering.mode to "own_site" to disable.
 */
export function isGrabOnly(): boolean {
  return themeConfig.ordering.mode === "grab_only";
}

export const grabUrl = themeConfig.delivery.grabUrl;
