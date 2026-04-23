/**
 * Extra themes registered globally by the showcase Provider. Kept in a
 * data-only module so Layout.tsx can stay components-only (required by
 * React Fast Refresh).
 *
 * These double as worked examples for the Theming docs page — they
 * exercise `extends`, hex/triplet mixing, and both color schemes.
 */

import { defineTheme, type HarborTheme } from "../lib/theme";

export const demoThemes: HarborTheme[] = [
  defineTheme({
    name: "sunset",
    label: "Sunset",
    colorScheme: "dark",
    extends: "harbor-dark",
    tokens: {
      color: {
        accent: "#FF6B35",
        accent2: "#FFD166",
        accent3: "#EF476F",
        brand: "#FF6B35",
      },
    },
    meta: { preview: { primary: "#FF6B35", surface: "#0A0A0F" } },
  }),
  defineTheme({
    name: "forest",
    label: "Forest",
    colorScheme: "dark",
    extends: "harbor-dark",
    tokens: {
      color: {
        accent: "#10B981",
        accent2: "#34D399",
        accent3: "#84CC16",
        brand: "#10B981",
      },
    },
    meta: { preview: { primary: "#10B981", surface: "#0A0A0F" } },
  }),
  defineTheme({
    name: "ocean",
    label: "Ocean",
    colorScheme: "light",
    extends: "harbor-light",
    tokens: {
      color: {
        accent: "#0EA5E9",
        accent2: "#06B6D4",
        accent3: "#6366F1",
        brand: "#0EA5E9",
      },
    },
    meta: { preview: { primary: "#0EA5E9", surface: "#F4F6FC" } },
  }),
];
